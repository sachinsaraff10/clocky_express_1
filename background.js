  let testset=new Set();
  let activeTaburl;
  let releurl;
  let pausedtimer;
  let window1 = null;
  let new_timer;
  let reconnectInterval = 1000; 
  let previousTabId = null;
  let windowID;
  let responsetimer;
  let updatedtimer
  let urls = new Set();
  const popup_id = 'bdnkfkcdglljacbjaagbhmdoppfcadmb';
let timers_url = {};
let urltimer = {};
let visitedDomain = [];
let running_url = [];
let timer_overwrite = {};
let ws;
let taburl;
let username;
function extractDomainFromTabId(tabId) {
  chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          return;
      }

      const url = new URL(tab.url);
      const domain = url.hostname;
      console.log(`Domain for tabId ${tabId}: ${domain}`);
  });
}

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
    
      username= result.username;
    
      if (username) {
        console.log('Username exists:', username);
        // Continue with your logic
        message = JSON.stringify({
          action: "username delivered"  ,
          username:username
        }
      )
        ws.send(message);
        console.log(message);
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
    username= chrome.storage.local.get('username');
    
    if (!username) {
      console.error('No username found in localStorage');
      return null;
    }
  
    console.log('Username:', username);
    return username;
  }

  // Function to send the username over WebSocket
function sendUsername() {
  username= getUsername();
  if (username && ws.readyState === WebSocket.OPEN) {
    // username= chrome.storage.local.get('username');
    // message = {credentials:username};
    ws.send(username);
    console.log('Username sent:', message);
  } else {
    console.error('WebSocket is not open or username is not available');
  }
}

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  // Ensure we have a valid windowId
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    try {
      // Retrieve window details
      const window = await new Promise((resolve, reject) => {
        chrome.windows.get(windowId, (win) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError));
          } else {
            resolve(win);
          }
        });
      });

      // Check if the window is a popup
      if (window.type === 'popup') {
        // Query all tabs or perform any tasks when focus changes to a non-popup window
        return;
      }
    } catch (error) {
      console.error('Error fetching window details:', error);
    }
  }
});

async function windowtypegetter(windowId){
  return new Promise((resolve, reject) => {
    chrome.windows.get(windowId, (win) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        resolve(win);
      }
    });
  })
}

function checkUsernameExists(callback) {
  chrome.storage.local.get('username', (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving username:', chrome.runtime.lastError);
      callback(false);
      return;
    }

    username= result.username;

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
        urls = result.urls || new Set();
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
        urls = result.urls || new Set();
        console.log(urls);
        timers_url = result.timers || {};
        urltimer = result.urltotimer || {};
        visitedDomain = [];
        running_url = [];
        timer_overwrite = result.overwritten || {};
      }
    )}
  });

  async function pauseTimer(running_timer) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({action: 'pausetimer', 
        object: running_timer}, (response) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        
        resolve(response.object);
      });
    });
  }
 
  async function server_receiver(Message){
return new Promise((resolve,reject)=>{
ws.send(Message);
ws.onmessage = (event)=>{
  const parsed = JSON.parse(event.data);

}
}
)
  }
  
  ws.onmessage = async (event) => {
    console.log(event);
    const data = JSON.parse(event.data);
    if (data.message === 'here are the user websites') {
      console.log('Received user websites data');
      // Handle the user websites data here
      console.log('Websites:', data.sites);
  
      try {
        const result = await getFromStorage(['urls','urltotimer',
          'overwritten',
          'running','timers'
        ]);
        urls = new Set();
        urltimer = {};
        timer_overwrite = {};
        running_url = [];

        for (let i=0;i<data.sites.length;i++){
          console.log(data.sites[i]);
          urls.add(data.sites[i].website);
          let  timer = {
                  
            hourinput: data.sites[i].hours,
            minuteinput: data.sites[i].minutes,
            secondinput: data.sites[i].seconds,
            urlId:null,
            intervalId:null
          };
            urltimer[data.sites[i].website]=timer;
            timer_overwrite[data.sites[i].website] = timer;
            console.log(timer_overwrite);
    
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



  async function getFromStorage(key) {
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
  
    async function settoStorage(pairs){
      return new Promise((resolve, reject) => {
        chrome.storage.local.set(pairs, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    }
 

  function server_sender(temp_map,username){
const message = JSON.stringify(
  {
    message : "paused timer from old tab",
    username: username,
    timers: temp_map
  }
)
ws.send(message);
console.log("Serialized message:", message);
  }


  chrome.action.onClicked.addListener(() => {
    // if (ws.readyState === WebSocket.OPEN) {
    //   chrome.storage.local.get('username', (result) => {
    //     if (chrome.runtime.lastError) {
    //       // An error occurred during the storage operation
    //       console.error('Error retrieving username:', 
    //         chrome.runtime.lastError.message);
    //       return;
    //     }
      
    //     username= result.username;
      
    //     if (username) {
    //       console.log('Username exists:', username);
    //       // Continue with your logic
    //     //   message = JSON.stringify({
    //     //     action: "username delivered"  ,
    //     //     username:username
    //     //   }
    //     // )
    //     //   ws.send(message);


    //     } else {
    //       console.log('No username found in chrome.storage.local');
    //       // Handle the absence of the username
    //     }
    //   })
  
    // } else {
    //   console.error('WebSocket is not open');
    // }
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
// 


function queryer(ID) {
  return new Promise((resolve, reject) => {
    function checkStatus() {
      chrome.tabs.get(ID, (tab) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        if (tab.status === 'complete') {
          console.log(`Activated tab ${ID} has finished loading`);
          resolve(tab);
        } else {
          console.log(`Activated tab ${ID} is still loading`);
          reject(new Error('Tab is still loading'));
        }
      });
    }
    checkStatus();
  });
}

chrome.tabs.onActivated.addListener(async(activeInfo)=>{

  
  
  try {
    const tab = await queryer(activeInfo.tabId);
    // Proceed with the logic for the activated tab

    taburl=tab.url;
    console.log(activeTabId);
    let currentdomain=new URL(taburl).hostname;
    currentdomain = currentdomain.replace(/^www\./, '');

    // const newdomain = new URL(tab.url).hostname;

    
    console.log(currentdomain);
    
    // console.log(tabId);
    console.log(taburl);

    if (urls.size>0){
      console.log('lets go');
      console.log(urls);
        if (urls.has(currentdomain)){
        releurl=currentdomain;
        console.log(typeof releurl); // Should be 'string'
        console.log(visitedDomain);
        console.log(timer_overwrite);
        console.log(releurl);
        console.log(running_url);
        if(visitedDomain.includes(releurl)){
          if(running_url.length>0){
            if(releurl===running_url[0]){

    responsetimer = await timerupdate({action:'store_current_timer',
      url:running_url
    });
    new_timer = responsetimer.object;
    console.log(new_timer);
    console.log('received');
    timer_overwrite[releurl]=new_timer;
    await removeWindow(window1.id);
    console.log(`Window ID: ${window1.id} removed successfully`);
    running_url = [];
    window1 = await createWindow();
    console.log(window1.tabs[0].id);
    await executeScript(window1.tabs[0].id);
    running_url.push(releurl);
    updatedtimer = await timerupdate({action:'launch_now',
      url:running_url,
      object:timer_overwrite[releurl]})
    
            }
            else{

        running_timer=timer_overwrite[running_url[0]];
        responsetimer = await timerupdate({action:'pausetimer', 
          url:running_url,
          object:running_timer});
        pausedtimer=responsetimer.object;
        timer_overwrite[running_url[0]]=pausedtimer;
        await removeWindow(window1.id);
        console.log(`Window ID: ${window1.id} removed successfully`);
        running_url = [];
        window1 = await createWindow();
        console.log(window1.tabs[0].id);
        await executeScript(window1.tabs[0].id);
        running_url.push(releurl);
        updatedtimer = await timerupdate({action:'launch_now',
          url:running_url,
        object:timer_overwrite[releurl]})

            }
          }
          else{
            if (window1.id){
              await removeWindow(window1.id);
              console.log(`Window ID: ${window1.id} removed successfully`);
            }
            window1 = await createWindow();
            console.log(window1.tabs[0].id);
            await executeScript(window1.tabs[0].id);
            running_url.push(releurl);
            updatedtimer = await timerupdate({action:'launch_now',
              url:running_url,
            object:timer_overwrite[releurl]})
          }
        }
        else{
          if(running_url.length>0)
            {
              running_timer=timer_overwrite[running_url[0]];
              console.log(timer_overwrite);
              addToArrayIfNotExists(visitedDomain,releurl);
              responsetimer = await timerupdate({action:'pausetimer',url:running_url,
                object:running_timer});
              pausedtimer=responsetimer.object;
              timer_overwrite[running_url[0]]=pausedtimer;
              await removeWindow(window1.id);
              console.log(`Window ID: ${window1.id} removed successfully`);
              running_url = [];
              window1 = await createWindow();
              console.log(window1.tabs[0].id);
              await executeScript(window1.tabs[0].id);
              running_url.push(releurl);
              updatedtimer = await timerupdate({action:'launch_now',
                url:running_url,
              object:timer_overwrite[releurl]})
}
          else{
      addToArrayIfNotExists(visitedDomain,releurl);
    
    console.log(timer_overwrite[releurl]);
    console.log(visitedDomain);
  window1 = await createWindow();
  console.log(window1.tabs[0].id);
  await executeScript(window1.tabs[0].id);
  running_url.push(releurl);
  timer_overwrite[releurl] = urltimer[releurl]; 
  updatedtimer = await timerupdate({action:'launch_now',
    url:running_url,
  object:timer_overwrite[releurl]})
        
    
        }
        }
      
      
    }
      
      else {
        console.log(currentdomain.includes(releurl));
        console.log(currentdomain);
        console.log(running_url);
        console.log(window1);
        console.log(tab.url);
        if (currentdomain === popup_id){
          return;
        }
        if (running_url.length>0){
        running_timer=timer_overwrite[running_url[0]];
        await executeScript(window1.tabs[0].id);
        console.log('executed');
        pausedtimer = await timerupdate({action:'pausetimer', url:running_url});
        console.log(pausedtimer.object);
        timer_overwrite[running_url[0]] = pausedtimer.object;
        await removeWindow(window1.id);
        console.log(`Window ID: ${window1.id} removed successfully`);
        // const Username_1 = await getFromStorage('username');
        server_sender(timer_overwrite,username);
        console.log('sent to server');
        running_url=[];

        console.log(`Window ID: ${window1.id} removed successfully`);
      }
    }
    
  }
  
  } catch (error) {
    console.error(`Error getting tab status: ${error}`);
    return;
  }

})

let tabUrls = {};

async function URLgetter(tabbb){

  return new Promise ((resolve,reject)=>{
    chrome.tabs.get(tabbb,(tab)=>{
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      else{
        const url_1 = tab.url;
        return resolve(new URL(url_1).hostname);
      }
    })
  })
}

async function windowStatus(tab) {
  return new Promise((resolve, reject) => {
    chrome.windows.get(tab.windowId, { populate: false }, (window) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
        return;
      }

      if (window.type === 'popup') {
        console.log(`Popup window triggered the onUpdated handler for tab ${tab.id}`);
        reject('Popup window');
      } else {
        resolve('Regular tab');
      }
    });
  });
}

async function timerupdate(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        console.warn('Non-critical error during script execution:', 
          chrome.runtime.lastError);
        // reject(new Error(chrome.runtime.lastError));
          resolve()
      } else {
        resolve(response);
      }
    });
  });
}

async function removeWindow(windowId) {
  return new Promise((resolve, reject) => {
    chrome.windows.remove(windowId, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        // windowId = null;
        resolve();
      }
    });
  });
}

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === window1.id) {
    // Handle cleanup when the popup window is closed
    console.log('Popup window closed');
    window1.id = null; // Clear the reference
    running_url = [];
  }
});

async function createWindow() {
  return new Promise((resolve, reject) => {
    chrome.windows.create({
      url: 'timers.html',
      type: 'popup',
      width: 100,
      height: 100,
      left: 950,
      top: 520
    }, (window) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        resolve(window);
      }
    });
  });
}



async function executeScript(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript({
      target: { tabId: tabId, allFrames: true },
      files: ['timers.js']
    }, () => {
    
      if (chrome.runtime.lastError) {
        // reject(new Error(chrome.runtime.lastError));
        // console.log('failure');
        console.warn('Non-critical error during script execution:', chrome.runtime.lastError);
          // Continue processing instead of rejecting
          resolve();
      } else {
        resolve();
      }
    });
  });
}

chrome.tabs.onUpdated.addListener(async(tabId,changeInfo,tab)=>{
      
        if ((changeInfo.status==='complete')){
          try{
            // const status = await windowStatus(tab);
              taburl=tab.url;
              console.log(activeTabId);
              let currentdomain=new URL(taburl).hostname;
              
              currentdomain = currentdomain.replace(/^www\./, '');
              // stored = await getFromStorage('visitedDomain');
              // visitedDomain = stored
              // const newdomain = new URL(tab.url).hostname;
  
              tabUrls[tabId] = currentdomain;
              console.log(currentdomain);
              
              console.log(tabId);
              console.log(taburl);

              if (urls.size>0){
                console.log('lets go');
                console.log(urls);
              
                if (urls.has(currentdomain)){
                  releurl=currentdomain;
                  console.log(typeof releurl); // Should be 'string'
                  console.log(visitedDomain);
                  console.log(timer_overwrite);
                  console.log(releurl);
                  console.log(running_url);
                  if(visitedDomain.includes(releurl))
                    {
                    if(running_url.length>0){
                      if(releurl===running_url[0]){

              responsetimer = await timerupdate({action:'store_current_timer',
                url:running_url
              });
              new_timer = responsetimer.object;
              console.log('received');
              console.log(new_timer);
              timer_overwrite[releurl]=new_timer;
              await removeWindow(window1.id);
              console.log(`Window ID: ${window1.id} removed successfully`);
              running_url = [];
              window1 = await createWindow();
              console.log(window1.tabs[0].id);
              await executeScript(window1.tabs[0].id);
              running_url.push(releurl);
              updatedtimer = await timerupdate({action:'launch_now',
                url:running_url,
                object:timer_overwrite[releurl]})
              
                      }
                      else{
    
                  running_timer=timer_overwrite[running_url[0]];
                  responsetimer = await timerupdate({action:'pausetimer', 
                    url:running_url,
                    object:running_timer});
                  pausedtimer=responsetimer.object;
                  timer_overwrite[running_url[0]]=pausedtimer;
                  await removeWindow(window1.id);
                  console.log(`Window ID: ${window1.id} removed successfully`);
                  running_url = [];
                  window1 = await createWindow();
                  console.log(window1.tabs[0].id);
                  await executeScript(window1.tabs[0].id);
                  running_url.push(releurl);
                  updatedtimer = await timerupdate({action:'launch_now',
                    url:running_url,
                  object:timer_overwrite[releurl]})
      
                      }
                    }
                    else{
                      if (window1.id){
                        await removeWindow(window1.id);
                        console.log(`Window ID: ${window1.id} removed successfully`);
                      }
                      window1 = await createWindow();
                      console.log(window1.tabs[0].id);
                      await executeScript(window1.tabs[0].id);
                      running_url.push(releurl);
                      updatedtimer = await timerupdate({action:'launch_now',
                        url:running_url,
                      object:timer_overwrite[releurl]})
                    }
                  }
                  else{
                    if(running_url.length>0)
                      {
                        running_timer=timer_overwrite[running_url[0]];
                        console.log(timer_overwrite);
                        addToArrayIfNotExists(visitedDomain,releurl);
                        responsetimer = await timerupdate({action:'pausetimer',
                          url:running_url,
                          object:running_timer});
                        pausedtimer=responsetimer.object;
                        timer_overwrite[running_url[0]]=pausedtimer;
                        await removeWindow(window1.id);
                        console.log(`Window ID: ${window1.id} removed successfully`);
                        running_url = [];
                        window1 = await createWindow();
                        console.log(window1.tabs[0].id);
                        await executeScript(window1.tabs[0].id);
                        running_url.push(releurl);
                        updatedtimer = await timerupdate({action:'launch_now',
                          url:running_url,
                        object:timer_overwrite[releurl]})
      }
                    else{
                addToArrayIfNotExists(visitedDomain,releurl);
              
              console.log(timer_overwrite[releurl]);
              console.log(visitedDomain);
            window1 = await createWindow();
            console.log(window1.tabs[0].id);
            await executeScript(window1.tabs[0].id);
            running_url.push(releurl);
            timer_overwrite[releurl] = urltimer[releurl]; 
            updatedtimer = await timerupdate({action:'launch_now',
              url:running_url,
            object:timer_overwrite[releurl]})
                  
              
                  }
                  }
                
                }
                
                else {
                  console.log(currentdomain);
                  console.log(running_url);
                  console.log(window1);
                  console.log(tab.url);
                  if (currentdomain === popup_id){
                    return;
                  }
                  if (running_url.length>0){
                  
                  running_timer=timer_overwrite[running_url[0]];
                  await executeScript(window1.tabs[0].id);
                  console.log('executed');
                  pausedtimer = await timerupdate({action:'pausetimer', 
                    url:running_url});
                  console.log(pausedtimer.object);
                  timer_overwrite[running_url[0]] = pausedtimer.object;
                  await removeWindow(window1.id);
                  console.log(`Window ID: ${window1.id} removed successfully`);
               
                  // const Username_1 = await getFromStorage('username');
                  server_sender(timer_overwrite,username);
                  console.log('sent to server');
                  running_url=[];
                }
              }
              
            }
             
          
        } 
        catch (error) {
          console.warn('Exiting handler due to:', error); 
        }
        }  
   
      } )
              