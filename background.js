let urls=[];
  console.log(urls.length);
  let timers_url={};
  let urltimer={};
  let running_timer;
  let visitedDomain=[];
  let timer_overwrite={};
  let running_url=[];
  let testset=new Set();
  let activeTaburl;
  let releurl;
  let window1;
  chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed or updated!');
    if(details.reason==='install')
    {chrome.storage.local.get(
      ['urls', 'overwritten', 'visitedDomain', 'running', 'timers', 'urltotimer'],
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
              top: 70},()=>{
                chrome.scripting.executeScript({
                  target: {tabId:activeTabId, allFrames: true,},
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
    
chrome.storage.local.set({urls:urls,timers:timers_url,
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
      console.log(timer_overwrite)
      chrome.storage.local.set({urls:urls,timers:timers_url,
        urltotimer:urltimer,visitedDomain:visitedDomain,
        overwritten:timer_overwrite,
         running:running_url,},()=>{
        console.log('Data stored in local storage.')
          })
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            for (let i = 0; i < tabs.length; i++) {
              let curr_url = tabs[i].url;
              let tabId=tabs[i].id;
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
                                top: 520,
                                focused:false
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
                                top: 520,
                                focused:false
                              },
                              (window)=>{
                                window1=window;
                                console.log('checking');
                          running_url.push(releurl);
                          chrome.storage.local.set({running:running_url})
                          chrome.scripting.executeScript({
                            target: {tabId:tabId, allFrames: true,},
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
      
  })
      
let currenttabId;

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
                      console.log('were here');
                      if (visitedDomain.includes(releurl)){
                        if (running_url.length>0){
                          if(running_url[0]===releurl){
                            chrome.runtime.sendMessage(
                              {action:'store_current_timer'},(response)=>{
                              let new_timer=response.object;
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
                            top: 520,
                            focused:false
                          },
                          (window)=>{
                            window1=window;
                            chrome.scripting.executeScript({
                              target: {tabId:activeTabId, allFrames: true,},
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
            let pausedtimer=response.object;
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
              top: 520,
              focused:false
            },
            (window)=>{
              window1=window;
              chrome.scripting.executeScript({
                target: {tabId:activeTabId, allFrames: true,},
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
          )})})
        
                          }
                        }
                        else{
                          chrome.windows.create({
                            url: 'timers.html',
                            type: 'popup',
                            width: 100,
                            height: 100,
                            left: 950, // Adjust the position to the bottom right
                            top: 520,
                            focused:false
                          },
                          (window)=>{
                            window1=window;
                            chrome.scripting.executeScript({
                              target: {tabId:activeTabId, allFrames: true,},
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
            let pausedtimer=response.object;
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
                top: 520,
                focused:false
              },
              (window)=>{
                window1=window;
                chrome.scripting.executeScript({
                  target: {tabId:activeTabId, allFrames: true,},
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
            top: 520,
            focused:false
          },
          (window)=>{
            window1=window;
            console.log(window1.id);
            chrome.scripting.executeScript({
              target: {tabId:activeTabId, allFrames: true,},
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
            target: {tabId:activeTabId, allFrames: true,},
            files: ['timers.js'],
         },()=>{console.log('oh')
       console.log(running_url);
          
          running_timer=timer_overwrite[running_url[0]];
          chrome.runtime.sendMessage({action:'pausetimer'},(response)=>{
            let pausedtimer=response.object;
            timer_overwrite[running_url[0]]=pausedtimer;
            running_url=[];
            chrome.storage.local.set({overwritten:timer_overwrite, running:running_url},()=>{
            })
            chrome.windows.remove(window1.id);
          })
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
        if ((changeInfo.status==='complete' && tabId===activeTabId)  )
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
                      chrome.runtime.sendMessage(
                        {action:'store_current_timer'},(response)=>{
                        
                        let new_timer=response.object;
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
                              top: 520,
                              focused:false
                            },
                            (window)=>{
                              window1=window;
                              chrome.scripting.executeScript({
                                target: {tabId:activeTabId, allFrames: true,},
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
              let pausedtimer=response.object;
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
                  top: 520,
                  focused:false
                },
                (window)=>{
                  window1=window;
                  chrome.scripting.executeScript({
                    target: {tabId:activeTabId, allFrames: true,},
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
                              top: 520,
                              focused:false
                            },
                            (window)=>{
                              window1=window;
                              chrome.scripting.executeScript({
                                target: {tabId:activeTabId, allFrames: true,},
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
                        let pausedtimer=response.object;
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
                          top: 520,
                          focused:false
                        },
                        (window)=>{
                          window1=window;
                          chrome.scripting.executeScript({
                            target: {tabId:activeTabId, allFrames: true,},
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
                    top: 520,
                    focused:false
                  },
                  (window)=>{
                    window1=window;
                    chrome.scripting.executeScript({
                      target: {tabId:activeTabId, allFrames: true,},
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
                  target: {tabId:activeTabId, allFrames: true,},
                  files: ['timers.js'],
               },()=>{console.log('oh')
             console.log(running_url);
                running_timer=timer_overwrite[running_url[0]];
                chrome.runtime.sendMessage({action:'pausetimer'},(response)=>{
                  let pausedtimer=response.object;
                  timer_overwrite[running_url[0]]=pausedtimer;
                  running_url=[];
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
              