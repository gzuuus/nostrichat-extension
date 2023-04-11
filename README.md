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
        const ref = url.searchParams.get("ref");

        let chatReferenceTags = "";
        if (ref) {
            chatReferenceTags = `data-chat-reference-tags="${ref}"`;
        }

        let chatTags = "";
        if (url.searchParams.has("tag")) {
            tag = url.searchParams.get("tag");
            chatTags = `data-chat-tags="${tag}"`
        }

        let relays = "wss://relay.f7z.io,wss://nos.lol,wss://relay.nostr.info,wss://nostr-pub.wellorder.net,wss://relay.current.fyi,wss://relay.nostr.band";
        if (url.searchParams.has("relays")) {
            relays = url.searchParams.get("relays");
        }

        chatType= "GLOBAL"
        dmPub=""
        if (url.searchParams.has("dm")){
            chatType= "DM"
            pub = url.searchParams.get('dm')
            dmPub = `data-website-owner-pubkey="${pub}"`
        }

        const widget = `
            <body>
            <div id="nostri"></div>
            <link rel="stylesheet" href="https://nostri.chat/public/bundle.css">
            <script src="https://nostri.chat/public/bundle.js" data-chat-type="${chatType}" ${chatReferenceTags} ${chatTags} ${dmPub} data-relays="${relays}"></script>
            </body>
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
- ref: put an 'r' tag inside the note. 
- ex: `chat.punkhub.me/?ref=https://nostr.com/`
- tag: puts a 't' tag inside the note.
- ex: `chat.punkhub.me/?tag=bitcoin`
- relays: set the list of relays you connect to, if left empty it defaults to the list suggested by nostri.chat.
- ex: `chat.punkhub.me/?relays=wss://nos.lol,wss://relay.snort.social`
- dm: Set the chat to dm type and take a public key in HEX format as value.
- ex: `chat.punkhub.me/?dm=40b9c85fffeafc1cadf8c30a4e5c88660ff6e4971a0dc723d5ab674b5e61b451`

Of course you can combine these hooks, e.g:
- `chat.punkhub.me/?ref=https://nostr.com/&tag=bitcoin&relays=wss://nos.lol`


For more info about nostri.chat visit https://nostri.chat/