const timerContainer = document.getElementById('timerContainer');
const hourInput = document.getElementById('hourInput');
const minuteInput = document.getElementById('minuteInput');
const secondInput = document.getElementById('secondInput');
const timermap = {};
let urll;
// const addTimerButton = document.getElementById('addTimerButton');
let intervalID;

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

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
        if (message.action==='launch_now'){
            console.log('received');
            let timerObject = message.object;
            urll = message.url
            // JSON.parse(timerObject);
            // JSON.parse(timerObject);
            console.log(timerObject);
            console.log(timerObject.hourinput);
            createTimer(timerObject, urll);
            setTimer(timerObject);
        }
    })
function createTimer(timer, url) {
            initializeMessageListener();
            if (url in timermap){

                hourInput.readOnly=true
                hourInput.value=timermap[url].hourinput;
                
                minuteInput.readOnly=true
                minuteInput.value=timermap[url].minuteinput;
                secondInput.readOnly=true
                secondInput.value=timermap[url].secondinput;
                // setTimer(timer);
            }
            else{
                
                hourInput.readOnly=true
                hourInput.value=timer.hourinput;
                
                minuteInput.readOnly=true
                minuteInput.value=timer.minuteinput;
                secondInput.readOnly=true
                secondInput.value=timer.secondinput;
                timermap[url] = timer;
                // setTimer(timer);
            }

            
            
        }



    function setTimer(timer){
        
            // console.warn('Timer for this URL already exists:', url);
            
            console.log(' resuming')

            let hours = Number(hourInput.value);
            let minutes = Number(minuteInput.value);
            let seconds = Number(secondInput.value);
        
            let totalSeconds = hours * 3600 + minutes * 60 + seconds;
        
           timer.intervalId = setInterval(() => {
            hours = Math.floor(totalSeconds / 3600);
            minutes = Math.floor((totalSeconds % 3600) / 60);
            seconds = totalSeconds % 60;
            hourInput.value=hours;
            minuteInput.value=minutes;
            secondInput.value=seconds;
        
            if (totalSeconds <= 0) {
              clearInterval(timer.intervalId);
              //   let overwrite  = await getFromStorage()
              timer.hourinput = hourInput.value; // or whatever property holds the hours
              timer.minuteinput = minuteInput.value; // or whatever property holds the minutes
              timer.secondinput = secondInput.value; // or whatever property holds the seconds
              console.log(timer.intervalId);
              console.log(timer);
              chrome.runtime.sendMessage({action:'timesup',
                object:timer
              });
            }
            
            
        // chrome.runtime.sendMessage({action:'live_timer',object:timer})
            totalSeconds--;
          }, 1000);
        
}


  function messageListener(message, sender, sendResponse) {
    if (message.action === 'store_current_timer') {
        urll = message.url;
       let timer = timermap[urll]; 
      console.log('on it');
      clearInterval(timer.intervalId);
    //   let overwrite  = await getFromStorage()
    timer.hourinput = hourInput.value; // or whatever property holds the hours
    timer.minuteinput = minuteInput.value; // or whatever property holds the minutes
    timer.secondinput = secondInput.value; // or whatever property holds the seconds
    console.log(timer.intervalId);
    console.log(timer);
      sendResponse({ action: 'hereyougo', 
        object: timer });
      return; // No async operations, so no need to return true
    }
  
    if (message.action === 'pausetimer') {
      console.log('on it boss');
      console.log(message.url);
      urll = message.url;
       let timer = timermap[urll];
      clearInterval(timer.intervalId);
      timer.hourinput = hourInput.value; // or whatever property holds the hours
      timer.minuteinput = minuteInput.value; // or whatever property holds the minutes
      timer.secondinput = secondInput.value; // or whatever property holds the seconds
     console.log(timer.intervalId);
      console.log(timer);
      chrome.storage.local.set({ pausedtimer: timer }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error setting paused timer:', 
            chrome.runtime.lastError);
          sendResponse({ status: 'error',
             message: chrome.runtime.lastError.message });
        } else {
          sendResponse({ action: 'hereyougo', object: timer });
        }
      });
  
      return true; // Return true to indicate the response is sent asynchronously
    }   
  }

  function initializeMessageListener() {
    if (!chrome.runtime.onMessage.hasListener(messageListener)) {
      chrome.runtime.onMessage.addListener(messageListener);
    }
  }
  

    // addTimerButton.addEventListener('click', createTimer);