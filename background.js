

  chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed or updated!');
     });
console.log('initialized');
// initializes arrays that contain domains and timers sent from settings popup
  let urls=[];
  console.log(urls.length);
  let timers_url={};
  let urltimer={};
  let timer_toid={};
  let visitedDomain=new Set();
  let timer_overwrite={};
  let running_url=[];

  chrome.storage.local.get(
    ['urls', 'overwritten', 'visitedDomain', 'timertoid', 'running', 'timers', 'urltotimer'],
    (result) => {
      urls = result.urls || [];
      // console.log(urls);
      timers_url = result.timers || {};
      urltimer = result.urltotimer || {};
      timer_toid = result.timertoid || {};
      visitedDomain = result.visitedDomain || new Set();
      running_url = result.running || [];
      timer_overwrite = result.overwritten || [];
    }
  );

let activeTabId;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
       activeTabId = tabs[0].id;
      console.log("Active tab ID:", activeTabId);
    }
  })
// first event post installation that occurs once extension icon gets clicked
chrome.action.onClicked.addListener(()=>{
  // 
  console.log(urls)
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
         activeTabId = tabs[0].id;
      console.log("Active tab ID:", activeTabId);
    }
  });
    if(urls.length>0)
    {
        message_responsesender({action:'hereyougo',object:urls}).then(
          (response)=>{
            chrome.windows.create({
              url:'sites.html',
              type:'popup',
              width:300,
              height:300,
              left: 900, // Adjust the position to the bottom right
              top: 70
             
          
          })
          }
        )
        ;
        
            // let popupURL=`sites.html?domainId=${domains}`
            // chrome.tabs.reload(tabId,{bypassCache:false});
            ;
        
        ;
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

async function storethenget(){
  const data= await new Promise((resolve)=>{
    
chrome.storage.local.set({urls:urls,timers:timers_url,
  urltotimer:urltimer,timertoid:timer_toid,overwritten:timer_overwrite,
running:running_url,visitedDomain:visitedDomain}
  ,()=>{chrome.storage.local.get(['urls', 'overwritten', 'visitedDomain', 'timertoid', 'running', 'timers', 'urltotimer'],
  (result)=>{
    urls = result.urls;
    timers_url = result.timers  ;
    urltimer = result.urltotimer ;
    timer_toid = result.timertoid;
    visitedDomain = result.visitedDomain;
    running_url = result.running;
    timer_overwrite = result.overwritten;

  });
chrome.runtime.sendMessage({action:'setting_over'});
  });

  })
  return data;
}

async function storethenget_1(){
  const data= await new Promise((resolve)=>{
    
chrome.storage.local.set({overwritten:timer_overwrite}
  ,()=>{chrome.storage.local.get(['overwritten', 'visitedDomain','running'],
  (result)=>{
    visitedDomain = result.visitedDomain;
    running_url = result.running;
    timer_overwrite = result.overwritten;

  });
chrome.runtime.sendMessage({action:'setting_over'});
  });

  })
  return data;
}

async function message_responsesender(message){
  return new Promise((resolve)=>{
    chrome.runtime.sendMessage(message,(response)=>
    {
      resolve(response)
    })
  })
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {            
    if (message.action === 'monitorURL' && !urls.includes(message.url)) {
            let monitoredURL = message.url;
            console.log(monitoredURL);
      let sent_timer=message.timer;
      console.log(sent_timer);
        urls.push(monitoredURL);
      urltimer[monitoredURL]=sent_timer;

      // timers_url[timerId]=sent_timer;
      // /timer_toid[sent_timer]=timerId;
      timer_overwrite[monitoredURL]=sent_timer;
      chrome.storage.local.set({urls:urls,timers:timers_url,
        urltotimer:urltimer,timertoid:timer_toid,visitedDomain:visitedDomain,
        overwritten:timer_overwrite,
         running:running_url},()=>{
        console.log('Data stored in local storage.')
          })
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            for (let i = 0; i < tabs.length; i++) {
              let curr_url = tabs[i].url;
              let tabId=tabs[i].id;
              let curr_domain=curr_url.hostname
                for(let i=0;i<urls.length;i++){
                    if (curr_domain===urls[i]) { 
                       
                       running_url.push(curr_domain);
                       visitedDomain.add(curr_domain);
                       chrome.storage.local.set({visitedDomain:visitedDomain,running:running_url},
                         ()=>{
                             console.log('Data stored in local storage.');
                            //  let popupURL = `timers.html?domainId=${curr_domain}`
                             message_responsesender({action:'launch_now',object:timer_overwrite[curr_domain]}).then((response)=> 
                             {chrome.tabs.reload(tabId,{bypassCache:false});
                              chrome.windows.create({
                                 url: 'timers.html',
                                 type: 'popup',
                                 width: 100,
                                 height: 100,
                                 left: 950, // Adjust the position to the bottom right
                                 top: 520,
    
                                 tabId:tabId
                               })})
                              })
                     
                     }
                   }
                  // })
              
        }     })
        }
  } 
    
    // const MonitoredURL = monitoredURL;
  

  );
     
  
    


chrome.tabs.onActivated.addListener((activeInfo)=>{
    
    let currenttabId=activeInfo.tabId;
    console.log(currenttabId);
    if(activeTabId===currenttabId)
    {
      chrome.tabs.get(currenttabId,(currentTab)=>{
        let currentdomain=currentTab.url.hostname;
      if (urls.length>0){
    if ( urls.includes(currentdomain)) {
                  console.log('yeahhh')
                  console.log('were here');
                  if (visitedDomain.has(currentdomain)){
                    if (running_url){
                      if(running_url[0]===currentdomain){
                        chrome.runtime.sendMessage(
                          {action:'store_current_timer'},(response)=>{
  
                      if(response.action==='returned_timer'){
                          let new_timer=response.object;
                          timer_overwrite[currentdomain]=new_timer;
                          chrome.storage.local.set({overwritten:timer_overwrite,running:running_url},()=>{
                  // let popupURL=`timers.html`;
                  
                  message_responsesender({action:'launch_now',object:timer_overwrite[currentdomain]}).then((response)=> 
                   {chrome.tabs.reload(tabId,{bypassCache:false});;
                    chrome.windows.create({
                       url: 'timers.html',
                       type: 'popup',
                       width: 100,
                       height: 100,
                       left: 950, // Adjust the position to the bottom right
                       top: 520,

                       tabId:tabId
                     })})
                })
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
      chrome.storage.local.set({running:running_url,visitedDomain:visited},()=>{
        message_responsesender({action:'launch_now',object:timer_overwrite[currentdomain]}).then((response)=> 
        {chrome.tabs.reload(tabId,{bypassCache:false});
         chrome.windows.create({
            url: 'timers.html',
            type: 'popup',
            width: 100,
            height: 100,
            left: 950, // Adjust the position to the bottom right
            top: 520,

            tabId:tabId
          })})
    }
      )
                      }
                    }else{
      running_url.push(currentdomain);
      chrome.storage.local.set({running:running_url});
      message_responsesender({action:'launch_now',object:timer_overwrite[currentdomain]}).then((response)=> 
        {chrome.tabs.reload(tabId,{bypassCache:false});
         chrome.windows.create({
            url: 'timers.html',
            type: 'popup',
            width: 100,
            height: 100,
            left: 950, // Adjust the position to the bottom right
            top: 520,

            tabId:tabId
          })})
                    }
                
    }  else
    {if(running_url.length>0)
      
      {let running_timer=timer_overwrite[running_url[0]];
      chrome.runtime.sendMessage({action:'pausetimer',object:running_timer},(response)=>{
        let pausedtimer=response.object;
        timer_overwrite[running_url[0]]=pausedtimer;
        chrome.storage.local.set({overwritten:timer_overwrite})})          
      visited.add(currentdomain);
      running_url=[]
      running_url.push(currentdomain);
      chrome.storage.local.set({running:running_url,visitedDomain:visited});

      message_responsesender({action:'launch_now',object:timer_overwrite[currentdomain]}).then((response)=> 
        {chrome.tabs.reload(tabId,{bypassCache:false});
         chrome.windows.create({
            url: 'timers.html',
            type: 'popup',
            width: 100,
            height: 100,
            left: 950, // Adjust the position to the bottom right
            top: 520,

            tabId:tabId
          })})
    }else{
      visited.add(currentdomain);
      running_url.push(currentdomain);
      chrome.storage.local.set({running:running_url,visitedDomain:visited});

      message_responsesender({action:'launch_now',object:timer_overwrite[currentdomain]}).then((response)=> 
        {chrome.tabs.reload(tabId,{bypassCache:false});
         chrome.windows.create({
            url: 'timers.html',
            type: 'popup',
            width: 100,
            height: 100,
            left: 950, // Adjust the position to the bottom right
            top: 520,

            tabId:tabId
          })})
      }}
}
      
else{
    if (running_url.length>0){
      console.log('oh')
      console.log(running_url);
      let running_timer=timer_overwrite[running_url[0]];
      chrome.runtime.sendMessage({action:'pausetimer',
      object:running_timer},(response)=>{
        console.log('oh')
        let pausedtimer=response.object;
        timer_overwrite[running_url[0]]=pausedtimer;
        chrome.storage.local.set({overwritten:timer_overwrite})
      });

    } 
} 
      }  }
)
    }
          
  })
  

   
chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab)=>{
        if (changeInfo.status==="complete" && changeInfo.url){
            const taburl=tab.url;
            let currentdomain=taburl.hostname;
        //  chrome.storage.local.get(['urls',
        //  'visitedDomain','overwritten','running'],(result)=> {
        //      urls=result.urls;
        //     let visited=result.visitedDomain;
        //      timer_overwrite=result.overwritten;
        //     running_url=result.running;
            if (urls.length>0){
              console.log('lets go')
            for (let i=0;i<urls.length;i++)
            {if (currentdomain===urls[i]){
              if(visitedDomain.has(currentdomain)){
                if(running_url.length>0){
                  if(running_url[0]===currentdomain){
                    chrome.runtime.sendMessage(
                      {action:'store_current_timer'},(response)=>{

                  if(response.action==='returned_timer'){
                      let new_timer=response.object;
                      timer_overwrite[currentdomain]=new_timer;
                      chrome.storage.local.set({overwritten:timer_overwrite,running:running_url},
                        ()=>{

                          message_responsesender({action:'launch_now',object:new_timer}).then((response)=> 
                          {consolge.log('')
                            chrome.tabs.reload(tabId,{bypassCache:false});
                           chrome.windows.create({
                              url: 'timers.html',
                              type: 'popup',
                              width: 100,
                              height: 100,
                              left: 950, // Adjust the position to the bottom right
                              top: 520,
            
                              tabId:tabId
                            })})

                      })
              
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
          chrome.storage.local.set({running:running_url,visitedDomain:visitedDomain},
            ()=>{

              message_responsesender({action:'launch_now',object:timer_overwrite[currentdomain]}).then((response)=> 
              {chrome.tabs.reload(tabId,{bypassCache:false});
               chrome.windows.create({
                  url: 'timers.html',
                  type: 'popup',
                  width: 100,
                  height: 100,
                  left: 950, // Adjust the position to the bottom right
                  top: 520,

                  tabId:tabId
                })})
        }
          )

                  }
                }else{
                  running_url.push(currentdomain);
                  chrome.storage.local.set({running:running_url},()=>{
                    message_responsesender({action:'launch_now',object:timer_overwrite[currentdomain]}).then((response)=> 
                    {chrome.tabs.reload(tabId,{bypassCache:false});
                     chrome.windows.create({
                        url: 'timers.html',
                        type: 'popup',
                        width: 100,
                        height: 100,
                        left: 950, // Adjust the position to the bottom right
                        top: 520,
      
                        tabId:tabId
                      })}) 
                })


                }
              }
              else{
                if(running_url.length>0)
                  {let running_timer=timer_overwrite[running_url[0]];
                    chrome.runtime.sendMessage({action:'pausetimer',object:running_timer},(response)=>{
                      let pausedtimer=response.object;
                      timer_overwrite[running_url[0]]=pausedtimer;
                      chrome.storage.local.set({overwritten:timer_overwrite})})          
                    visitedDomain.add(currentdomain);
                    running_url=[]
                    running_url.push(currentdomain);
                    chrome.storage.local.set({running:running_url,visitedDomain:visitedDomain});
          
                    message_responsesender({action:'launch_now',object:timer_overwrite[currentdomain]}).then((response)=> 
              {chrome.tabs.reload(tabId,{bypassCache:false});
               chrome.windows.create({
                  url: 'timers.html',
                  type: 'popup',
                  width: 100,
                  height: 100,
                  left: 950, // Adjust the position to the bottom right
                  top: 520,

                  tabId:tabId
                })})
                }
                else{
                  visitedDomain.add(currentdomain);
          running_url.push(currentdomain);
          chrome.storage.local.set({running:running_url,visitedDomain:visitedDomain},()=>{

          message_responsesender({action:'launch_now',object:timer_overwrite[currentdomain]}).then((response)=> 
              {chrome.tabs.reload(tabId,{bypassCache:false});
               chrome.windows.create({
                  url: 'timers.html',
                  type: 'popup',
                  width: 100,
                  height: 100,
                  left: 950, // Adjust the position to the bottom right
                  top: 520,

                  tabId:tabId
                })})
          
              }
                )}
                  
              }}
              else {if (running_url.length>0){
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
            }}
          }}
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