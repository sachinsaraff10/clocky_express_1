// chrome.runtime.getBackgroundPage();
let urls=[];
let timers_url={};
let urltimer={};
let timer_toid={};
let visitedDomain=new Set();
let timer_overwrite={};
let running_url=[];

chrome.action.onClicked.addListener(()=>{
  if (urls)
  {chrome.storage.local.get (['urls'],(result)=>{ 
    let domains =result.urls;
    chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
      if (message.action==='storageplease'){
        sendResponse({object:domains});
      }
    });
    
        let popupURL=`sites.html?domainId=${domains}`
        // chrome.tabs.reload(tabId,{bypassCache:false});
        chrome.windows.create({
        url:popupURL,
        type:'popup',
        width:300,
        height:300,
        left: 900, // Adjust the position to the bottom right
        top: 70
       

    });
    });
  }
  else{
    chrome.windows.create({
    url:'sites.html',
    type:'popup',
    width:300,
    height:300,
    left: 900, // Adjust the position to the bottom right
    top: 70
   

});
}
        
    } );


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {            
    if (message.action === 'monitorURL') {
        if(urls.length===0)
        {
      // Get the monitored URL from the message and add it to your monitoring list
      let monitoredURL = message.url;
      let sent_timer=message.timer;
      let timerId=sent_timer.urlId;
      
    //   let urlId=uuidv4();
    //   timer_overwrite[urlId]=sent_timer;
      urls.push(monitoredURL);
      urltimer[monitoredURL]=sent_timer;

      timers_url[timerId]=sent_timer;
      timer_toid[sent_timer]=timerId;
      timer_overwrite[monitoredURL]=sent_timer;
      chrome.storage.local.set({urls:urls,timers:timers_url,
        urltotimer:urltimer,timertoid:timer_toid,visitedDomain:visitedDomain,overwritten:timer_overwrite,
         running:running_url},()=>{
        console.log('Data stored in local storage.')
    })} 
    else{
        chrome.storage.local.get(['urls','timers','urltotimer',
            'timertoid','overwritten'],(result)=>{
                
                let urls = result.urls;
                let urltimer=result.urltotimer;
                
                let timer_overwrite=result.overwritten;
              //   let urlId=uuidv4();
              //   timer_overwrite[urlId]=sent_timer;
                urls.push(monitoredURL);
                urltimer[monitoredURL]=sent_timer;
                
                timer_overwrite[monitoredURL]=sent_timer;
                chrome.storage.local.set({urls:urls,timers:timers_url,
                  urltotimer:urltimer,timertoid:timer_toid,overwritten:timer_overwrite},()=>{
                  console.log('Data stored in local storage.')
              })            })
        
    }
    // const MonitoredURL = monitoredURL;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        for (let i = 0; i < tabs.length; i++) {
          let curr_url = tabs[i].url;
          let tabId=tabs[i].id;
          let curr_domain=curr_url.hostname
          chrome.storage.local.get(['urls'],(result)=>{
            let urls=result.urls;
            for(let i=0;i<urls.length;i++){
                if (curr_domain===urls[i]) { 
                 chrome.storage.local.get(['visitedDomain','running','overwritten'],(result)=>{
                   let visitedDomain=result.visitedDomain;
                   let running_url=result.running;
                   let timer_overwrite=result.overwritten;
                   
                   running_url.push(curr_domain);
                   visitedDomain.add(curr_domain);
                   chrome.storage.local.set({visitedDomain:visitedDomain,running:running_url},
                     ()=>{
                         console.log('Data stored in local storage.')
                     })  
                   let popupURL = `timers.html?domainId=${curr_domain}`
                   chrome.tabs.reload(tabId,{bypassCache:false});
                     chrome.windows.create({
                       url: popupURL,
                       type: 'popup',
                       width: 100,
                       height: 100,
                       left: 950, // Adjust the position to the bottom right
                       top: 520,
                       tabId:tabId
                     },()=>{
                      
                      // chrome.storage.local.set({overwritten:timer_overwrite})
                     })})  
                 
                 }
               }})
          
    } 
      })
}});
     
  
  // Other background script logic and tasks...
  chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed or updated!'); });


chrome.runtime.onMessage.addListener((message,sender,
    sendResponse)=>{
if (message.action==='timer_please'){
    let domID=message.domainId;
    chrome.storage.local.get(['overwritten'],(result)=>{
        let timer_overwrite=result.overwritten;
        let timerObject=timer_overwrite[domID];

        sendResponse({timer:timerObject})
    })
    }})
    


chrome.tabs.onActivated.addListener((activeInfo)=>{
    
    let currenttabId=activeInfo.tabId;
    if(urls){
    chrome.storage.local.get(['urls','overwritten','running','visitedDomain'],(result)=>{
        let releurl=result.urls;
        let running_url=result.running;
        let visited=result.visitedDomain;
        let timer_overwrite=result.overwritten;
        chrome.tabs.get(currenttabId,(currentTab)=>{
            let currentdomain=currentTab.url.hostname;
        if (releurl && releurl.includes(currentdomain)) {

                      if (visited.has(currentdomain)){
                        if (running_url){
                          if(running_url[0]===currentdomain){
                            chrome.runtime.sendMessage(
                              {action:'store_current_timer'},(response)=>{
      
                          if(response.action==='returned_timer'){
                              let new_timer=response.object;
                              timer_overwrite[currentdomain]=new_timer;
                              chrome.storage.local.set({overwritten:timer_overwrite,running:running_url})
                      let popupURL=`timers.html?domainId=${currentdomain}`;
                      chrome.tabs.reload(tabId,{bypassCache:false});
                      chrome.windows.create(
                          {
                              url: popupURL,
                             type: 'popup',
                             width: 100,
                             height: 100,
                             left: 950, // Adjust the position to the bottom right
                             top: 520,
                             tabId:currenttabId
                          }
                      )
                      }})
                          }
                          else{
                            let running_timer=timer_overwrite[running_url[0]];
          chrome.runtime.sendMessage({action:'pausetimer',object:running_timer},(response)=>{
            let pausedtimer=response.object;
            timer_overwrite[running_url[0]]=pausedtimer;
            chrome.storage.local.set({overwritten:timer_overwrite})})
          running_url=[];
          running_url.push(currentdomain);
          chrome.storage.local.set({running:running_url,visitedDomain:visited});

          let popupURL=`timers.html?domainId=${currentdomain}`;
          chrome.tabs.reload(tabId,{bypassCache:false});
          chrome.windows.create(
            {
              url: popupURL,
                       type: 'popup',
                       width: 100,
                       height: 100,
                       left: 950, // Adjust the position to the bottom right
                       top: 520,
                       tabId:currenttabId
            }
          )
                          }
                        }else{
          running_url.push(currentdomain);
          chrome.storage.local.set({running:running_url});
          let popupURL=`timers.html?domainId=${currentdomain}`;
          chrome.tabs.reload(tabId,{bypassCache:false});
          chrome.windows.create(
            {
              url: popupURL,
                       type: 'popup',
                       width: 100,
                       height: 100,
                       left: 950, // Adjust the position to the bottom right
                       top: 520,
                       tabId:currenttabId
            }
          )
                        }
                    
        }  else
        {if(running_url)
          
          {let running_timer=timer_overwrite[running_url[0]];
          chrome.runtime.sendMessage({action:'pausetimer',object:running_timer},(response)=>{
            let pausedtimer=response.object;
            timer_overwrite[running_url[0]]=pausedtimer;
            chrome.storage.local.set({overwritten:timer_overwrite})})          
          visited.add(currentdomain);
          running_url=[]
          running_url.push(currentdomain);
          chrome.storage.local.set({running:running_url,visitedDomain:visited});

          let popupURL=`timers.html?domainId=${currentdomain}`;
          chrome.tabs.reload(tabId,{bypassCache:false});
          chrome.windows.create(
            {
              url: popupURL,
                       type: 'popup',
                       width: 100,
                       height: 100,
                       left: 950, // Adjust the position to the bottom right
                       top: 520,
                       tabId:currenttabId
            }
          )
        }else{
          visited.add(currentdomain);
          running_url.push(currentdomain);
          chrome.storage.local.set({running:running_url,visitedDomain:visited});

          let popupURL=`timers.html?domainId=${currentdomain}`;
          chrome.tabs.reload(tabId,{bypassCache:false});
          chrome.windows.create(
            {
              url: popupURL,
                       type: 'popup',
                       width: 100,
                       height: 100,
                       left: 950, // Adjust the position to the bottom right
                       top: 520,
                       tabId:currenttabId
            }
          )
          }}
}
          
    else{
        if (running_url){
          let running_timer=timer_overwrite[running_url[0]];
          chrome.runtime.sendMessage({action:'pausetimer',
          object:running_timer},(response)=>{
            let pausedtimer=response.object;
            timer_overwrite[running_url[0]]=pausedtimer;
            chrome.storage.local.set({overwritten:timer_overwrite})
          });

        } 
    } }
    )
})}
})

   
chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab)=>{
        if (changeInfo.status==="complete"){
            const taburl=tab.url;
            let currentdomain=taburl.hostname;
         chrome.storage.local.get(['urls',
         'visitedDomain','overwritten','running'],(result)=> {
            const urls=result.urls;
            let visited=result.visitedDomain;
            let timer_overwrite=result.overwritten;
            let running_url=result.running;
            if (urls){
            for (let i=0;i<urls.length;i++)
            {if (currentdomain===urls[i]){
              if(visited.has(currentdomain)){
                if(running_url){
                  if(running_url[0]===currentdomain){
                    chrome.runtime.sendMessage(
                      {action:'store_current_timer'},(response)=>{

                  if(response.action==='returned_timer'){
                      let new_timer=response.object;
                      timer_overwrite[currentdomain]=new_timer;
                      chrome.storage.local.set({overwritten:timer_overwrite,running:running_url})
              let popupURL=`timers.html?domainId=${currentdomain}`;
              chrome.tabs.reload(tabId,{bypassCache:false});
              chrome.windows.create(
                  {
                      url: popupURL,
                     type: 'popup',
                     width: 100,
                     height: 100,
                     left: 950, // Adjust the position to the bottom right
                     top: 520,
                     tabId:tabId
                  }
              )}})
                  }
                  else{

                    let running_timer=timer_overwrite[running_url[0]];
          chrome.runtime.sendMessage({action:'pausetimer',object:running_timer},(response)=>{
            let pausedtimer=response.object;
            timer_overwrite[running_url[0]]=pausedtimer;
            chrome.storage.local.set({overwritten:timer_overwrite})})
          running_url=[];
          running_url.push(currentdomain);
          chrome.storage.local.set({running:running_url,visitedDomain:visited});

          let popupURL=`timers.html?domainId=${currentdomain}`;
          chrome.tabs.reload(tabId,{bypassCache:false});
          chrome.windows.create(
            {
              url: popupURL,
                       type: 'popup',
                       width: 100,
                       height: 100,
                       left: 950, // Adjust the position to the bottom right
                       top: 520,
                       tabId:tabId
            }
          )

                  }
                }else{
                  running_url.push(currentdomain);
                  chrome.storage.local.set({running:running_url});
                  let popupURL=`timers.html?domainId=${currentdomain}`;
                  chrome.tabs.reload(tabId,{bypassCache:false});
                  chrome.windows.create(
                    {
                      url: popupURL,
                               type: 'popup',
                               width: 100,
                               height: 100,
                               left: 950, // Adjust the position to the bottom right
                               top: 520,
                               tabId:tabId
                    }
                  )


                }
              }
              else{
                if(running_url)
                  {let running_timer=timer_overwrite[running_url[0]];
                    chrome.runtime.sendMessage({action:'pausetimer',object:running_timer},(response)=>{
                      let pausedtimer=response.object;
                      timer_overwrite[running_url[0]]=pausedtimer;
                      chrome.storage.local.set({overwritten:timer_overwrite})})          
                    visited.add(currentdomain);
                    running_url=[]
                    running_url.push(currentdomain);
                    chrome.storage.local.set({running:running_url,visitedDomain:visited});
          
                    let popupURL=`timers.html?domainId=${currentdomain}`;
                    chrome.tabs.reload(tabId,{bypassCache:false});
                    chrome.windows.create(
                      {
                        url: popupURL,
                                 type: 'popup',
                                 width: 100,
                                 height: 100,
                                 left: 950, // Adjust the position to the bottom right
                                 top: 520,
                                 tabId:tabId
                      }
                    )
                }
                else{
                  visited.add(currentdomain);
          running_url.push(currentdomain);
          chrome.storage.local.set({running:running_url,visitedDomain:visited});

          let popupURL=`timers.html?domainId=${currentdomain}`;
          chrome.tabs.reload(tabId,{bypassCache:false});
          chrome.windows.create(
            {
              url: popupURL,
                       type: 'popup',
                       width: 100,
                       height: 100,
                       left: 950, // Adjust the position to the bottom right
                       top: 520,
                       tabId:tabId
            })}
              } }
              else{
                if (running_url){
                  let running_timer=timer_overwrite[running_url[0]];
                  chrome.runtime.sendMessage({action:'pausetimer',
                  object:running_timer},(response)=>{
                    let pausedtimer=response.object;
                    timer_overwrite[running_url[0]]=pausedtimer;
                    running_url=[];
                    chrome.storage.local.set({overwritten:timer_overwrite,running:running_url},
                     ()=>{console.log("done w storage")} );
                  })
        
                }
              } 
            }} })}}
            ) 
 
      
     // Add any initialization logic or tasks here
 


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
 



    // try {
    //     console.log("start");
    //     throw new Error("lol");
    //     console.log("end");
    // }
    //  catch (e) {
    //     console.error(e);
    // }