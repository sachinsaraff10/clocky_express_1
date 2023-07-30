chrome.extension.getBackgroundPage();
let urls=[];
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'monitorURL') {
      // Get the monitored URL from the message and add it to your monitoring list
      const monitoredURL = message.url;
      urls.push(monitoredURL);
      const lowercasedMonitoredURL = monitoredURL.toLowerCase();
      chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
            for (let i=0;i<tabs.length;i++){
                const releurl=tabs[i].url.toLowerCase();
                if (releurl.includes(lowercasedMonitoredURL)){
                    chrome.windows.create({
                        url: 'timers.html',
            type: 'popup',
            width: 400,
            height: 200,
            left: screen.availWidth - 420, // Adjust the position to the bottom right
            top: screen.availHeight - 220,
                    })
                }
            }


      })  
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
  chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed or updated!');
    // Add any initialization logic or tasks here
  });
  
  // Listen for messages from content scripts or other parts of the extension
//   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     // Handle the incoming messages
//     // You can distinguish different actions using the message.action property
//   });
  
  chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab)=>{
    if (changeInfo.status==="complete"){
        const taburl=tab.url;
        for (let i=0;i<urls.length;i++)
        {if (taburl.includes(urls[i])){
            chrome.windows.create({
                url: 'timers.html',
    type: 'popup',
    width: 400,
    height: 200,
    left: screen.availWidth - 420, // Adjust the position to the bottom right
    top: screen.availHeight - 220,
            })
        }}
    }
  })

  chrome.runtime.getURL("sites.html",(url)=>{

    fetch(url).then((response)=>response.text()).then((html)
    =>{

    }
    
    )
    .catch((error)=>{
        console.error("error fetching sites.html:",error);
    })


    



  })