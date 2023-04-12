### Nostri.chat extension
##### Loads nostrichat everywhere
This is a work in progress
Try it:
- clone this repo and go to your chrome browser
- In chrome go to 'chrome://extensions' and press 'Load unpacked'
- Now you have a new extension that loads nostri.chat everywhere and takes the actual URL to set the topic

#### How it works:
Once you have installed the extension in Chrome, you can click on its icon to open a new window with a live chat based on the URL you are visiting.This allows you to comment via nostr on any site on the internet!

#### What happens in the background?
When you click on the extension icon it automatically takes the url of the page you are visiting and formats it a bit to clean it from superfluous trackers, then with this url it makes a call to a cloudflare worker I have running and it loads a live chat based on the url you are visiting.

<details>
    <summary>Worker code</summary>

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    if (request.method === "GET") {
      const url = new URL(request.url);
      const currentUrl = url.toString();

      let chatReferenceTags = "";
      const ref = url.searchParams.get("ref");
      if (ref) {
        chatReferenceTags = `data-chat-reference-tags="${ref.replace(/^(https?:\/\/)?(www\.)?/i, '').split('&')[0]}"`;
      }

      const tag = url.searchParams.has("tag") ? url.searchParams.get("tag") : "";
      const chatTags = tag ? `data-chat-tags="${tag}"` : "";

      let relays = "wss://relay.f7z.io,wss://nos.lol,wss://relay.nostr.info,wss://nostr-pub.wellorder.net,wss://relay.current.fyi,wss://relay.nostr.band,wss://nostr.mutinywallet.com ";
      if (url.searchParams.has("relays")) {
        relays = url.searchParams.get("relays");
      }

      const pub = url.searchParams.has("dm") ? url.searchParams.get("dm") : "";
      const chatType = pub ? "DM" : "GLOBAL";
      const dmPub = pub ? `data-website-owner-pubkey="${pub}"` : "";

      let chatOptionHideAnon = "";
      const hideAnon = url.searchParams.has("hide-anon");
      if (hideAnon) {
        chatOptionHideAnon = "<style>.flex > button:nth-child(3) {display: none;}	</style>";
      }

      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(currentUrl)}&size=200x200`;

      const widget = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${ref || ""} ${tag} ${pub}</title>
            <link rel="stylesheet" href="https://nostri.chat/public/bundle.css">
            ${chatOptionHideAnon}
            <style>
              div {word-break: break-all;}
              body {background:#1a1a1a;margin-top:10px;}
              #share {padding: 10px;background-color: white;border-radius: 15px;text-align:center;}
              .qr-code {display: flex;justify-content: center;margin-top: 20px;}
              .qr-code img {width: 200px;height: 200px;}
            </style>
          </head>
          <body>
            <div id="share">
              <p>Share: <a href="${currentUrl}" target="_blank" rel="noreferrer">${currentUrl}</a></p>
            </div>
            <div class="qr-code">
              <img src="${qrCodeUrl}" alt="QR code for ${currentUrl}">
            </div>
            <script src="https://nostri.chat/public/bundle.js" data-chat-type="${chatType}" ${chatReferenceTags} ${chatTags} ${dmPub} data-relays="${relays}"></script>
          </body>
        </html>
      `;
      const headers = { "Content-Type": "text/html" };
      return new Response(widget, { headers });
    }
  } catch (error) {
    console.error("Error occurred: ", error);
    const body = "Error occurred while processing your request.";
    return new Response(body, {
      status: 500,
      statusText: "Error",
      headers: { "Content-Type": "text/plain" },
    });
  }
}

</details>

#### What else can you do?
As there is a worker giving service, you can use it without having the extension installed.
The root is `chat.punkhub.me/` and you can use different hooks with it.
- ref: sets an 'r' tag inside the notes. 
- e.g: `chat.punkhub.me/?ref=https://nostr.com/`.
- tag: sets an 't' tag inside the note.
- e.g: `chat.punkhub.me/?tag=bitcoin` 
- relays: set the list of relays you connect to, if left empty it defaults to the list suggested by nostri.chat.
- e.g: `chat.punkhub.me/?relays=wss://nos.lol,wss://relay.snort.social`.
- dm: Set the chat to dm type and take a public key in HEX format as value.
- e.g: `chat.punkhub.me/?dm=40b9c85fffeafc1cadf8c30a4e5c88660ff6e4971a0dc723d5ab674b5e61b451`
- hide-anon: hides the Ephemeral Keys button
- e.g: `chat.punkhub.me/?hide-anon`

Of course you can combine these hooks, e.g:
- `chat.punkhub.me/?ref=https://nostr.com/&tag=bitcoin&relays=wss://nos.lol`.


For more info about nostri.chat visit https://nostri.chat/
