  let urls = [];
  let timers_url={};
  let urltimer={};
  let running_timer;
  let visitedDomain=[];
  let timer_overwrite={};
  let running_url=[];
  let testset=new Set();
  let activeTaburl;
  let releurl;
  let pausedtimer;
  let window1;
  let new_timer;
  let reconnectInterval = 1000; 

let ws;

function initializeWebSocket() {
  ws = new WebSocket('ws://localhost:8080 ');

  ws.onopen = () => {
    console.log('WebSocket connection opened');
    chrome.storage.local.get('username', (result) => {
      if (chrome.runtime.lastError) {
        // An error occurred during the storage operation
        console.error('Error retrieving username:', 
          chrome.runtime.lastError.message);
        return;
      }
    
      const username = result.username;
    
      if (username) {
        console.log('Username exists:', username);
        // Continue with your logic
        message = username;
        ws.send(message);
      } else {
        console.log('No username found in chrome.storage.local');
        // Handle the absence of the username
      }
    })
  };

  ws.onmessage = (event) => {
    console.log('Message received:', event.data);
    // Handle incoming messages
  };



  ws.onclose = () => {
    console.log('WebSocket connection closed');
    // Optionally, try to reconnect or handle the close event
    setTimeout(() => {
      initializeWebSocket();
    }, reconnectInterval);
    ;

  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    // Handle error
  };
}

function reconnect() {
  console.log(`Attempting to reconnect in ${reconnectInterval}ms`);
  initializeWebSocket();
  // Increase reconnect interval exponentially up to a maximum value
  reconnectInterval = Math.min(reconnectInterval * 2, 60000);
   // Maximum reconnect interval of 1 minute (60000ms)
}


initializeWebSocket();

  function getUsername() {
    // Retrieve the username from localStorage
    const username = chrome.storage.local.get('username');
    
    if (!username) {
      console.error('No username found in localStorage');
      return null;
    }
  
    console.log('Username:', username);
    return username;
  }

  // Function to send the username over WebSocket
function sendUsername() {
  const username = getUsername();
  if (username && ws.readyState === WebSocket.OPEN) {
    // const username = chrome.storage.local.get('username');
    // message = {credentials:username};
    ws.send(username);
    console.log('Username sent:', message);
  } else {
    console.error('WebSocket is not open or username is not available');
  }
}

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId != chrome.windows.WINDOW_ID_NONE) {
    // Query all tabs or perform any tasks when focus changes to a window
    queryTabs();
  }
});



function checkUsernameExists(callback) {
  chrome.storage.local.get('username', (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving username:', chrome.runtime.lastError);
      callback(false);
      return;
    }

    const username = result.username;

    if (username) {
      console.log('Username exists:', username);
      callback(true);
    } else {
      console.log('No username found in chrome.storage.local');
      callback(false);
    }
  });
}

  chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed or updated!');
    if(details.reason==='install')
    {
      
      chrome.storage.local.get(
      ['urls', 'overwritten', 'visitedDomain', 'running', 
      'timers', 'urltotimer'],
      (result) => {
        urls = result.urls || [];
        console.log(urls);
        timers_url = result.timers || {};
        urltimer = result.urltotimer || {};
        visitedDomain = result.visitedDomain || [];
        running_url = result.running || [];
        timer_overwrite = result.overwritten || {};
      }
    )}
    else if(details.reason==='update')
    {chrome.storage.local.get(
      ['urls', 'overwritten', 'visitedDomain', 'running', 'timers', 'urltotimer'],
      (result) => {
        urls = result.urls || [];
        console.log(urls);
        timers_url = result.timers || {};
        urltimer = result.urltotimer || {};
        visitedDomain = [];
        running_url = [];
        timer_overwrite = result.overwritten || {};
      }
    )}
  });

 
  
  ws.onmessage = async (event) => {
    console.log(event);
    const data = JSON.parse(event.data);
    if (data.message === 'here are the user websites') {
      console.log('Received user websites data');
      // Handle the user websites data here
      console.log('Websites:', data.sites);
  
      try {
        const result = await getFromStorage(['urls','urltotimer','overwritten']);
        urls = result.urls || [];
        urltimer = result.urltotimer || {}
        timer_overwrite = result.overwritten || {}
        for (let i=0;i<data.sites.length;i++){
          urls.push(data.sites.website);
          let  timer = {
                  
            hourinput: data.sites.hours,
            minuteinput: data.sites.minutes,
            secondinput: data.sites.seconds,
            urlId:null,
            intervalId:null
          };
            urltimer[data.sites.website]=timer;
            timer_overwrite[data.sites.website] = timer;
    
        }
        
        await new Promise((resolve, reject) => {
          chrome.storage.local.set({urls: urls,urltotimer:urltimer}, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          });
        });
  
        // Further processing as needed
      } catch (error) {
        console.error('Error accessing storage:', error);
      }
    } else {
      console.log('Received other message:', data.message);
      // Handle other types of messages if needed
    }
  };
  ;

  function getFromStorage(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    });
  }
  
 
  chrome.action.onClicked.addListener(() => {
    if (ws.readyState === WebSocket.OPEN) {
      chrome.storage.local.get('username', (result) => {
        if (chrome.runtime.lastError) {
          // An error occurred during the storage operation
          console.error('Error retrieving username:', 
            chrome.runtime.lastError.message);
          return;
        }
      
        const username = result.username;
      
        if (username) {
          console.log('Username exists:', username);
          // Continue with your logic
          message = username;
          ws.send(message);
        } else {
          console.log('No username found in chrome.storage.local');
          // Handle the absence of the username
        }
      })
  
    } else {
      console.error('WebSocket is not open');
    }
  });
  
console.log('initialized');
// console.log(urls.length);
// initializes arrays that contain domains and timers sent from settings popup
function addToArrayIfNotExists(array, element) {
  if (!array.includes(element)) {
    array.push(element);
  }
}

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
  console.log(visitedDomain);
  console.log(urls)
  console.log(urltimer[urls[0]]);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
         activeTabId = tabs[0].id;
      console.log("Active tab ID:", activeTabId);
    }
  ;
  ;    if(urls.length>0)
    {
        // chrome.storage.local.get(['sites'],
        //   (result)=>{
            // let popupURL=result.sites;
            chrome.windows.create({
              url:'sites.html',
              type:'popup',
              width:300,
              height:300,
              left: 900, // Adjust the position to the bottom right
              top: 70},(window)=>{
                window1=window;
                chrome.scripting.executeScript({
                  target: {tabId:window1.tabs[0].id, allFrames: true,},
                  files: ['sites.js']
               },
               ()=>{
                  chrome.runtime.sendMessage({action:
                'hereyougo',object:urls,urltotimer:urltimer})
              })
              })
      
          
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
  })
 
  } );

async function storethenget(){
  const data= await new Promise((resolve)=>{
    
chrome.storage.local.set({url:urls,timers:timers_url,
  urltotimer:urltimer,overwritten:timer_overwrite,
running:running_url,visitedDomain:visitedDomain}
  ,()=>{chrome.storage.local.get(['urls', 'overwritten', 'visitedDomain', 'timertoid', 'running', 'timers', 'urltotimer'],
  (result)=>{
    urls = result.urls;
    timers_url = result.timers  ;
    urltimer = result.urltotimer ;
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
      resolve(response);
    })
  })
}
chrome.runtime.onMessageExternal.addListener((message,sender,sendResponse)=>{
 if(message.action === 'username'){
      let username1 = message.data;
      console.log(username1);
      chrome.storage.local.set({username:username1},()=>{
        console.log(chrome.storage.local);
      });
    } 
})


chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  for (let i = 0; i < tabs.length; i++) {
    let curr_url = tabs[i].url;
    let tabId=tabs[i].id;
    const result = await getFromStorage(['urls','urltotimer','overwritten','visitedDomain']);
     urls = result.urls || [];
     visitedDomain=result.visitedDomain||[];
      urltotimer = result.urltotimer || {};
     overwritten = result.overwritten || {};
    let curr_domain=new URL(curr_url).hostname
    console.log(curr_domain);
      for(let i=0;i<urls.length;i++){
          if (curr_domain===urls[i]) { 
            
             addToArrayIfNotExists(visitedDomain,curr_domain);
             chrome.storage.local.set({visitedDomain:visitedDomain
              },
               ()=>{console.log('nice to see')
                   console.log('Data stored in local storage.');
                  //  let popupURL = `timers.html?domainId=${curr_domain}`
                  if(window1){
                    chrome.windows.remove(window1.id,()=>{
                    running_url=[];
                    chrome.windows.create({
                      url: 'timers.html',
                      type: 'popup',
                      width: 100,
                      height: 100,
                      left: 950, // Adjust the position to the bottom right
                      top: 520
                    },
                    (window)=>{
                      window1=window;
                      console.log('checking');
                running_url.push(releurl);
                chrome.storage.local.set({running:running_url})
                chrome.runtime.sendMessage({action:'launch_now',
                object:timer_overwrite[releurl]})
                    })})
                  }else{
                    chrome.windows.create({
                      url: 'timers.html',
                      type: 'popup',
                      width: 100,
                      height: 100,
                      left: 950, // Adjust the position to the bottom right
                      top: 520
                    },
                    (window)=>{
                      window1=window;
                      console.log('checking');
                running_url.push(releurl);
                chrome.storage.local.set({running:running_url})
                chrome.scripting.executeScript({
                  target: {tabId:window1.tabs[0].id, allFrames: true,},
                  files: ['timers.js'],
               },
               ()=>{
                chrome.runtime.sendMessage({action:'launch_now',
                object:timer_overwrite[releurl]})
               })
                    })

                  }
                  
                    })
           
           }
         }
        // })
    
}     })

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { 
               
    
        if(message.action==='timesup'){
          chrome.windows.remove(window1.id,()=>{
          chrome.windows.create(
            {
              url: 'timeout.html',
              type: 'popup',
              width: 100,
              height: 100,
              left: 950, // Adjust the position to the bottom right
              top: 520
            }
          )  
          })
          
          }
      
  })
      
let currenttabId;
async function querytabs(){
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    for (let i = 0; i < tabs.length; i++) {
      let curr_url = tabs[i].url;
      let tabId=tabs[i].id;
      const result = await getFromStorage(['urls','urltotimer','overwritten','visitedDomain']);
       urls = result.urls || [];
       visitedDomain=result.visitedDomain||[];
        urltotimer = result.urltotimer || {};
       overwritten = result.overwritten || {};
      let curr_domain=new URL(curr_url).hostname
      console.log(curr_domain);
        for(let i=0;i<urls.length;i++){
            if (curr_domain===urls[i]) { 
              
               addToArrayIfNotExists(visitedDomain,curr_domain);
               chrome.storage.local.set({visitedDomain:visitedDomain
                },
                 ()=>{console.log('nice to see')
                     console.log('Data stored in local storage.');
                    //  let popupURL = `timers.html?domainId=${curr_domain}`
                    if(window1){
                      chrome.windows.remove(window1.id,()=>{
                      running_url=[];
                      chrome.windows.create({
                        url: 'timers.html',
                        type: 'popup',
                        width: 100,
                        height: 100,
                        left: 950, // Adjust the position to the bottom right
                        top: 520
                      },
                      (window)=>{
                        window1=window;
                        console.log('checking');
                  running_url.push(releurl);
                  chrome.storage.local.set({running:running_url})
                  chrome.runtime.sendMessage({action:'launch_now',
                  object:timer_overwrite[releurl]})
                      })})
                    }else{
                      chrome.windows.create({
                        url: 'timers.html',
                        type: 'popup',
                        width: 100,
                        height: 100,
                        left: 950, // Adjust the position to the bottom right
                        top: 520
                      },
                      (window)=>{
                        window1=window;
                        console.log('checking');
                  running_url.push(releurl);
                  chrome.storage.local.set({running:running_url})
                  chrome.scripting.executeScript({
                    target: {tabId:window1.tabs[0].id, allFrames: true,},
                    files: ['timers.js'],
                 },
                 ()=>{
                  chrome.runtime.sendMessage({action:'launch_now',
                  object:timer_overwrite[releurl]})
                 })
                      })
  
                    }
                    
                      })
             
             }
           }
          // })
      
  }     })
}

chrome.tabs.onActivated.addListener((activeInfo)=>{
    currenttabId=activeInfo.tabId;
        console.log(currenttabId);
        // console.log(activeTabId);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
               activeTabId = tabs[0].id;
            console.log("Active tab ID:", activeTabId);
          
        // console.log(activeTabId);
        if(activeTabId===currenttabId)
        { chrome.tabs.get(currenttabId,(currentTab)=>{
            console.log(currentTab.url);
            console.log(currentTab);
            let currentdomain=new URL(currentTab.url).hostname;
            console.log(currentdomain);
          for (let i=0;i<urls.length;i++){
        if (currentdomain.includes(urls[i]))  {
                      releurl=urls[i]
                      console.log('yeahhh')
                      console.log('we here');
                      if (visitedDomain.includes(releurl)){
                        if (running_url.length>0){
                          if(running_url[0]===releurl){
                            chrome.runtime.sendMessage({action:'store_current_timer'},
                              ()=>{
                               
                                       
                                new_timer=response.object;
                              console.log(new_timer)
                              timer_overwrite[releurl]=new_timer;
                              console.log('currently here')
                              chrome.storage.local.set({overwritten:timer_overwrite,running:running_url},()=>{
                      // let popupURL=`timers.html`;
                      
                        chrome.windows.remove(window1.id,
                        ()=>{running_url=[];
                          console.log('removed')
                          chrome.windows.create({
                            url: 'timers.html',
                            type: 'popup',
                            width: 100,
                            height: 100,
                            left: 950, // Adjust the position to the bottom right
                            top: 520
                          },
                          (window)=>{
                            window1=window;
                            chrome.scripting.executeScript({
                              target: {tabId:window1.tabs[0].id, allFrames: true},
                              files: ['timers.js'],
                           },()=>{
                            console.log('checking');
                      running_url.push(releurl);
                      chrome.storage.local.set({running:running_url,
                        visitedDomain:visitedDomain})
                      chrome.runtime.sendMessage({action:'launch_now',object:timer_overwrite[releurl]})
                       })
                               })
                    }
                      )
                      
                    })
                                
                      
                      })
                    
                          }
                          else{
                             running_timer=timer_overwrite[running_url[0]];
            chrome.runtime.sendMessage({action:'pausetimer'},(response)=>{
                pausedtimer=response.object;
            running_timer=pausedtimer;
            chrome.storage.local.set({overwritten:timer_overwrite},()=>{
          chrome.windows.remove(window1.id,()=>{
            running_url=[];
            chrome.windows.create({
              url: 'timers.html',
              type: 'popup',
              width: 100,
              height: 100,
              left: 950, // Adjust the position to the bottom right
              top: 520
            },
            (window)=>{
              window1=window;
              chrome.scripting.executeScript({
                target: {tabId:window1.tabs[0].id, allFrames: true,},
                files: ['timers.js'],
             },()=>{
              console.log('checking');
        running_url.push(releurl);
        chrome.storage.local.set({running:running_url,
          visitedDomain:visitedDomain})
        chrome.runtime.sendMessage({action:'launch_now',object:timer_overwrite[releurl]})
         })}
          )
        }
          )})
              
            })
          }
                        }
                        else{
                          chrome.windows.create({
                            url: 'timers.html',
                            type: 'popup',
                            width: 100,
                            height: 100,
                            left: 950, // Adjust the position to the bottom right
                            top: 520
                          },
                          (window)=>{
                            window1=window;
                            chrome.scripting.executeScript({
                              target: {tabId:window1.tabs[0].id, allFrames: true,},
                              files: ['timers.js'],
                           },()=>{
                            console.log('checking');
                      running_url.push(releurl);
                      chrome.storage.local.set({running:running_url,
                        visitedDomain:visitedDomain})
                      chrome.runtime.sendMessage({action:'launch_now',object:timer_overwrite[releurl]})
                       }) }
                          )
                        }
                    
        }  else
        {if(running_url.length>0)
          
          {running_timer=timer_overwrite[running_url[0]];
           addToArrayIfNotExists(visitedDomain,releurl);
            chrome.runtime.sendMessage({action:'pausetimer'},(response)=>{
            pausedtimer=response.object;
            timer_overwrite[running_url[0]]=pausedtimer;
            chrome.storage.local.set({overwritten:timer_overwrite})
            chrome.windows.remove(window1.id,
            ()=>{
              running_url=[];
              chrome.windows.create({
                url: 'timers.html',
                type: 'popup',
                width: 100,
                height: 100,
                left: 950, // Adjust the position to the bottom right
                top: 520
              },
              (window)=>{
                window1=window;
                chrome.scripting.executeScript({
                  target: {tabId:window1.tabs[0].id, allFrames: true,},
                  files: ['timers.js'],
               },()=>{
                console.log('checking');
          running_url.push(releurl);
          chrome.storage.local.set({running:running_url,
            visitedDomain:visitedDomain})
          chrome.runtime.sendMessage({action:'launch_now',object:timer_overwrite[releurl]})
           })})
        }
          )
        })
            
        }else{
          addToArrayIfNotExists(visitedDomain,releurl)
          chrome.windows.create({
            url: 'timers.html',
            type: 'popup',
            width: 100,
            height: 100,
            left: 950, // Adjust the position to the bottom right
            top: 520
          },
          (window)=>{
            window1=window;
            console.log(window1.id);
            chrome.scripting.executeScript({
              target: {tabId:window1.tabs[0].id, allFrames: true,},
              files: ['timers.js'],
           },()=>{
            console.log('checking');
      running_url.push(releurl);
      chrome.storage.local.set({running:running_url,
        visitedDomain:visitedDomain})
      chrome.runtime.sendMessage({action:'launch_now',object:timer_overwrite[releurl]})
       }) }
          )
          }}
         }
          
    else{
        if (running_url.length>0){
          
          chrome.scripting.executeScript({
            target: {tabId:window1.tabs[0].id, allFrames: true,},
            files: ['timers.js'],
         },()=>{console.log('oh')
       console.log(running_url);
          
          running_timer=timer_overwrite[running_url[0]];
          chrome.runtime.sendMessage({action:'pausetimer'},(response)=>{
            pausedtimer=response.object;
            console.log(response);
            timer_overwrite[running_url[0]]=pausedtimer;
            console.log('check');
            chrome.storage.local.set({overwritten:timer_overwrite, running:running_url},()=>{
            })
            chrome.windows.remove(window1.id);
         running_url=[]; })
        ; 
        });
          
          
        } 
    } 
          }  }
    )
        } 
      }
    })
      }
 )
  

chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab)=>{
        if ((changeInfo.status==='complete')  )
        {   const taburl=tab.url;
            console.log(activeTabId);
            let currentdomain=new URL(taburl).hostname;
            console.log(currentdomain);
            console.log(tabId);
            console.log(taburl);
            chrome.tabs.query({active:true, currentWindow:true},(tabs)=>{
               activeTaburl=new URL(tabs[0].url).hostname
})
            if (urls.length>0){
              console.log('lets go')
              console.log(urls)
            for (let i=0;i<urls.length;i++)
            {
              if (currentdomain.includes(urls[i])){
                console.log(urls[i]);
                releurl=urls[i];
                console.log(visitedDomain);
                console.log(running_url);
                if(visitedDomain.includes(releurl)){
                  if(running_url.length>0){
                    if(releurl===running_url[0]){
                      chrome.runtime.sendMessage({action:'store_current_timer'},
                        (response)=>{new_timer=response.object;
                        console.log('received')
                        timer_overwrite[releurl]=new_timer;
                        chrome.windows.remove(window1.id,
                          ()=>{running_url=[];
                            chrome.windows.create({
                              url: 'timers.html',
                              type: 'popup',
                              width: 100,
                              height: 100,
                              left: 950, // Adjust the position to the bottom right
                              top: 520
                            },
                            (window)=>{
                              window1=window;
                              chrome.scripting.executeScript({
                                target: {tabId:window1.tabs[0].id, allFrames: true,},
                                files: ['timers.js'],
                             },()=>{
                              console.log('checking');
                        running_url.push(releurl);
                        chrome.storage.local.set({running:running_url,
                          visitedDomain:visitedDomain})
                        chrome.runtime.sendMessage({action:'launch_now',object:timer_overwrite[releurl]})
                         })
                            })
  
                        })
                
              
            })
            
                    }
                    else{
  
                       running_timer=timer_overwrite[running_url[0]];
            
                       chrome.runtime.sendMessage({action:'pausetimer',
            object:running_timer},(response)=>{
              pausedtimer=response.object;
              timer_overwrite[running_url[0]]=pausedtimer;
              chrome.storage.local.set({overwritten:timer_overwrite})})
              chrome.windows.remove(window1.id,
              ()=>{running_url=[]
                chrome.windows.create({
                  url: 'timers.html',
                  type: 'popup',
                  width: 100,
                  height: 100,
                  left: 950, // Adjust the position to the bottom right
                  top: 520
                },
                (window)=>{
                  window1=window;
                  chrome.scripting.executeScript({
                    target: {tabId:window1.tabs[0].id, allFrames: true,},
                    files: ['timers.js'],
                 },()=>{
                  console.log('checking');
            running_url.push(releurl);
            chrome.storage.local.set({running:running_url,
              visitedDomain:visitedDomain})
            chrome.runtime.sendMessage({action:'launch_now',object:timer_overwrite[releurl]})
             })
      })
          }
            )
                    }
                  }else{
                      
                            chrome.windows.create({
                              url: 'timers.html',
                              type: 'popup',
                              width: 100,
                              height: 100,
                              left: 950, // Adjust the position to the bottom right
                              top: 520
                            },
                            (window)=>{
                              window1=window;
                              chrome.scripting.executeScript({
                                target: {tabId:window1.tabs[0].id, allFrames: true,},
                                files: ['timers.js'],
                             },()=>{
                              console.log('checking');
                        running_url.push(releurl);
                        chrome.storage.local.set({running:running_url,
                          visitedDomain:visitedDomain})
                        chrome.runtime.sendMessage({action:'launch_now',object:timer_overwrite[releurl]})
                         })
                        })
                  }
                }
                else{
                  if(running_url.length>0)
                    {running_timer=timer_overwrite[running_url[0]];
                      console.log(timer_overwrite);
                      addToArrayIfNotExists(visitedDomain,releurl);
                      chrome.runtime.sendMessage({action:'pausetimer'},
                      (response)=>{
                        pausedtimer=response.object;
                        running_timer=pausedtimer;
                        // running_url=[];
                        chrome.storage.local.set({overwritten:timer_overwrite});
                      chrome.windows.remove(window1.id,
                      ()=>{
                        running_url=[];
                        chrome.windows.create({
                          url: 'timers.html',
                          type: 'popup',
                          width: 100,
                          height: 100,
                          left: 950, // Adjust the position to the bottom right
                          top: 520
                        },
                        (window)=>{
                          window1=window;
                          chrome.scripting.executeScript({
                            target: {tabId:window1.tabs[0].id, allFrames: true,},
                            files: ['timers.js'],
                         },()=>{
                          console.log('checking');
                    running_url.push(releurl);
                    chrome.storage.local.set({running:running_url,
                      visitedDomain:visitedDomain})
                    chrome.runtime.sendMessage({action:'launch_now',object:timer_overwrite[releurl]})
                     }) })
                  }
                    )
                  })
                    
                  }
                  else{
                    addToArrayIfNotExists(visitedDomain,releurl);
            console.log(timer_overwrite[releurl]);
            console.log(visitedDomain);
  
                  chrome.windows.create({
                    url: 'timers.html',
                    type: 'popup',
                    width: 100,
                    height: 100,
                    left: 950, // Adjust the position to the bottom right
                    top: 520
                  },
                  (window)=>{
                    window1=window;
                    chrome.scripting.executeScript({
                      target: {tabId:window1.tabs[0].id, allFrames: true,},
                      files: ['timers.js'],
                   },()=>{
                    console.log('checking');
              running_url.push(releurl);
              chrome.storage.local.set({running:running_url,
                visitedDomain:visitedDomain})
              chrome.runtime.sendMessage({action:'launch_now',object:timer_overwrite[releurl]})
               })})
            
                }
                    
                }
              
            }
              else {
                console.log(running_url);
                console.log(window1.id);
                if (running_url.length>0){
                running_timer=timer_overwrite[running_url[0]];
                chrome.scripting.executeScript({
                  target: {tabId:window1.tabs[0].id, allFrames: true,},
                  files: ['timers.js'],
               },()=>{console.log('oh')
             console.log(running_url);
                running_timer=timer_overwrite[running_url[0]];
                chrome.runtime.sendMessage({action:'pausetimer'},(response)=>{
                  console.log(response);
                  pausedtimer=response.object;
                  console.log(pausedtimer)
                  timer_overwrite[running_url[0]]=pausedtimer;
                  running_url=[];
                  console.log(running_url);
                  chrome.storage.local.set({overwritten:timer_overwrite, running:running_url},()=>{
                  })
                  chrome.windows.remove(window1.id);
                })
              ; 
              })
              }
            }
            }}
          } 
          

          }
          )
              