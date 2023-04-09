chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var url = tabs[0].url;
    var cleanedUrl = url.replace(/^(https?:\/\/)?(www\.)?/i, ''); // Elimina el prefijo de la URL
    var scriptCode = `
      var container = document.getElementById('nostri-container');
      if (container) {
        container.remove();
      }
      container = document.createElement('div');
      container.setAttribute('id', 'nostri-container');
      container.classList.add('${cleanedUrl}');
      var script = document.createElement('script');
      script.src = "https://nostri.chat/public/bundle.js";
      script.setAttribute("data-chat-type", "GLOBAL");
      script.setAttribute("data-chat-reference-tags","${url}");
      script.setAttribute("data-relays", "wss://relay.f7z.io,wss://nos.lol,wss://relay.nostr.info,wss://nostr-pub.wellorder.net,wss://relay.current.fyi,wss://relay.nostr.band");
      container.appendChild(script);
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://nostri.chat/public/bundle.css";
      container.appendChild(link);
      document.body.appendChild(container);
      
      var style = document.createElement("style");
      style.type = "text/css";
      style.innerHTML = "#nostri-container { z-index: 9999; }";
      document.head.appendChild(style);
    `;
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: scriptCode}
    );
    document.getElementById('url').innerHTML = url;
  });
  