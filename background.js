// chrome.runtime.getBackgroundPage();
let urls=[];
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'monitorURL') {
      // Get the monitored URL from the message and add it to your monitoring list
      const monitoredURL = message.url;
      urls.push(monitoredURL);
      chrome.storage.local.set({url:urls},()=>{
        console.log('Data stored in local storage.')
    })
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
     
    }
    // if (message.action==='getkeysarray'){
    //     sendResponse({keys:keysarray});

    // }
   
  });
//   key_vals={}
//   for (let i=0;i<urls.length;i++){
//     key_vals[i.toString()]=urls[i];}





  // Other background script logic and tasks...
  chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed or updated!');
    // Add any initialization logic or tasks here
  });
// let keysarray=[];
// for (let i=0;i<Object.keys(key_vals).length;i++){
//     keysarray.push(i.toString());
// }

  // Listen for messages from content scripts or other parts of the extension
//   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     // Handle the incoming messages
//     // You can distinguish different actions using the message.action property
//   });
// let vals=[];
// keysarray.forEach(key=>{
//     vals.push(keysarray[key]);
// })
 

  chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab)=>{
    if (changeInfo.status==="complete"){
        const taburl=tab.url;

     chrome.storage.local.get(['urls'],(result)=> {
        const urls=result.urls
        for (let i=0;i<urls.length;i++)
        {if (taburl.includes(urls[i])){
            chrome.windows.create({
                url: 'timers.html',
    type: 'popup',
    width: 200,
    height: 200,
    left: screen.availWidth - 420, // Adjust the position to the bottom right
    top: screen.availHeight - 220,
            })
        }} }) 
    }
  })

chrome.action.onClicked.addListener(()=>{
    chrome.windows.create({
        url:'sites.html',
        type:'popup',
        width:400,
        height:400,
        left: screen.availWidth - 420, // Adjust the position to the bottom right
        top: screen.availHeight,

    });
  chrome.storage.local.get (['urls'],(result)=>{ 
    let vals=result.urls;
    if (vals){
        chrome.runtime.sendMessage({action:'initialize',vals})
        
    }} )})


try {
    console.log("start");
    throw new Error("lol");
    console.log("end");
  } catch (e) {
    console.error(e);
  }