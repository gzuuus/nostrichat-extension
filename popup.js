chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var url = tabs[0].url;
    var cleanedUrl = url.replace(/^(https?:\/\/)?(www\.)?/i, ''); // Elimina el prefijo de la URL
    var scriptCode = `var script = document.createElement("script"); script.src = "https://nostri.chat/public/bundle.js"; script.setAttribute("data-website-owner-pubkey", "40b9c85fffeafc1cadf8c30a4e5c88660ff6e4971a0dc723d5ab674b5e61b451"); script.setAttribute("data-chat-type", "GLOBAL"); script.setAttribute("data-chat-tags","${url}"); script.setAttribute("data-relays", "wss://relay.f7z.io,wss://nos.lol,wss://relay.nostr.info,wss://nostr-pub.wellorder.net,wss://relay.current.fyi,wss://relay.nostr.band"); document.body.appendChild(script); var link = document.createElement("link"); link.rel = "stylesheet"; link.href = "https://nostri.chat/public/bundle.css"; document.body.appendChild(link);`;
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: scriptCode}
    );
    document.getElementById('url').innerHTML = url;
});
