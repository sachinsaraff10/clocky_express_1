const timerContainer = document.getElementById('timerContainer');
const hourInput = document.getElementById('hourInput');
const minuteInput = document.getElementById('minuteInput');
const secondInput = document.getElementById('secondInput');
const timermap = {};
let urll;
// const addTimerButton = document.getElementById('addTimerButton');
      let intervalID;
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
        if (message.action==='launch_now'){
            console.log('received');
            let timerObject = message.object;
            // JSON.parse(timerObject);
            // JSON.parse(timerObject);
            console.log(timerObject);
            console.log(timerObject.hourinput);
            createTimer(timerObject);
            setTimer(timerObject);
        }
    })
         function createTimer(timer) {

            hourInput.readOnly=true
            hourInput.value=timer.hourinput;
            
            minuteInput.readOnly=true
            minuteInput.value=timer.minuteinput;
            secondInput.readOnly=true
            secondInput.value=timer.secondinput;
            // setTimer(timer);
            
            
        }



    function setTimer(timer,url){
        if (url in timermap) {
            console.warn('Timer for this URL already exists:', url);
            return; // Optionally, handle updating or ignoring
          }
        console.log('now running')

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
      chrome.runtime.sendMessage({action:'timesup'});
    }
    
    
// chrome.runtime.sendMessage({action:'live_timer',object:timer})
    totalSeconds--;
  }, 1000);

  timermap[url] = timer

}
  function messageListener(message, sender, sendResponse) {
    if (message.action === 'store_current_timer') {
        urll = message.url;
       let timer = timermap[url]; 
      console.log('on it');
      clearInterval(timer.intervalId);
      console.log(timer.intervalId);
      console.log(timer);
      sendResponse({ action: 'hereyougo', object: timer });
      return; // No async operations, so no need to return true
    }
  
    if (message.action === 'pausetimer') {
      console.log('on it boss');
      urll = message.url;
       let timer = timermap[url];
      clearInterval(timer.intervalId);
      console.log(timer.intervalId);
      console.log(timer);
  
      chrome.storage.local.set({ pausedtimer: timer }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error setting paused timer:', 
            chrome.runtime.lastError);
          sendResponse({ status: 'error', message: chrome.runtime.lastError.message });
        } else {
          sendResponse({ action: 'hereyougo', object: timer });
        }
      });
  
      return true; // Return true to indicate the response is sent asynchronously
    }   
  }

  

    // addTimerButton.addEventListener('click', createTimer);