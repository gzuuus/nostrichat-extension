function saveOptions(e) {
    e.preventDefault();
    var relayList = document.getElementById("relay-list").value;
    chrome.storage.sync.set({relayList: relayList}, function() {
      console.log("Relay list saved.");
    });
  }
  
  function restoreOptions() {
    chrome.storage.sync.get("relayList", function(items) {
      if (items.relayList) {
        document.getElementById("relay-list").value = items.relayList;
      }
    });
  }
  
  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.getElementById("options-form").addEventListener("submit", saveOptions);
  