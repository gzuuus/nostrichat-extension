    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var url = tabs[0].url;
    var cleanedUrl = url.replace(/^(https?:\/\/)?(www\.)?/i, '');
    chrome.storage.sync.get("relayList", function(items) {
    var relayList = items.relayList;
    var cleanedUrlNoQuery = cleanedUrl.split("&")[0];
    document.getElementById('url').innerHTML = cleanedUrlNoQuery;
    let hook = `https://chat.punkhub.me/?ref=${cleanedUrlNoQuery}`;
    if (relayList) {
    hook += `&relays=${relayList}`;
    }
    const options = {
      width: 425,
      height: 650
      };
      const windowFeatures = Object.entries(options).map(([key, value]) => `${key}=${value}`).join(",");
      const win = window.open(hook, "_blank", windowFeatures);
    win.focus();
    });
    
    });
