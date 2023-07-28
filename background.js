chrome.extension.getBackgroundPage();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'monitorURL') {
      // Get the monitored URL from the message and add it to your monitoring list
      const monitoredURL = message.url;
      // Perform your logic to monitor the URL and trigger the timer if needed
      // For example, you can store the monitoredURL in an array and check it against the active tabs using the chrome.tabs API
      // If the monitoredURL matches an active tab URL, open the timer page
      // Example:
      // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      //   const activeURL = tabs[0].url;
      //   if (activeURL.includes(monitoredURL)) {
      //     // Open the timer page using chrome.tabs.create()
      //   }
      // });
    }
  });
  
  // Other background script logic and tasks...