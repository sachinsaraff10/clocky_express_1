const timerContainer = document.getElementById('timerContainer');
   
const addTimerButton = document.getElementById('addTimerButton');
      let intervalID;
      chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
        if (message.action==='launch_now'){
            console.log('received');
            let timerObject = message.object;
    // Use the timerObject in your popup window
    createTimer(timerObject);
    // setTimer(timerObject);
        sendResponse({action:"good_to_go"})}
        
        // if (message.action==='chopchop'){
        //     let running_timer=message.object;
        //     setTimer(running_timer)
        // }
    })
         function createTimer(timer) {
            const timerDiv = document.createElement('div');
            timerDiv.classList.add('container');

            const hourInput = document.createElement('input');
            hourInput.type = 'text';
            hourInput.readOnly=true
            hourInput.value=timer.hourInput
            hourInput.classList.add('hours');

            const minuteInput = document.createElement('input');
            minuteInput.type = 'text';
            minuteInput.readOnly=true
            minuteInput.value=timer.minuteInput
            const secondInput = document.createElement('input');
            secondInput.type = 'text';
            secondInput.readOnly=true
            secondInput.value=timer.secondInput;
            secondInput.classList.add('seconds');

            timerDiv.appendChild(hourInput);
            timerDiv.appendChild(document.createTextNode(':'));
            timerDiv.appendChild(minuteInput);
            timerDiv.appendChild(document.createTextNode(':'));
            timerDiv.appendChild(secondInput);
            timerContainer.appendChild(timerDiv);
            setTimer(timer);
        }

        function handleTimerClick(timer) {
            let hours = Number(timer.hourInput.value);
            let minutes = Number(timer.minuteInput.value);
            let seconds = Number(timer.secondInput.value);

            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
                console.log('Invalid, enter a number');
                return;
            }

            if (minutes >= 60 || seconds >= 60) {
                console.log('Invalid, enter number below 60');
                return;
            }

            if (timer.button.textContent === 'Play') {
                timer.button.textContent = 'Pause';
                timer.hourInput.readOnly = true;
                timer.minuteInput.readOnly = true;
                timer.secondInput.readOnly = true;

                timer.intervalId = setTimer(hours, minutes, seconds, timer)
            } else {
                timer.button.textContent = 'Play';
                clearInterval(intervalId);
                timer.hourInput.readOnly = false;
                timer.minuteInput.readOnly = false;
                timer.secondInput.readOnly = false;
            }
        }
        function handletabstatus(timer) {
            let hours = Number(timer.hourInput.value);
            let minutes = Number(timer.minuteInput.value);
            let seconds = Number(timer.secondInput.value);

            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
                console.log('Invalid, enter a number');
                return;
            }

            if (minutes >= 60 || seconds >= 60) {
                console.log('Invalid, enter number below 60');
                return;
            }
            chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{if (
                !changeInfo.url
            ){
                timer.hourInput.readOnly = true;
                timer.minuteInput.readOnly = true;
                timer.secondInput.readOnly = true;

                timer.intervalId = setTimer(timer);
                
            }else{
                clearInterval(intervalId);
                timer.hourInput.readOnly = true;
                timer.minuteInput.readOnly = true;
                timer.secondInput.readOnly = true;
   
            }

            })}

        function pauser(timer){
            clearInterval(timer.intervalId);

        }
            // if (timer.button.textContent === 'Play') {
            //     timer.button.textContent = 'Pause';
                // timer.hourInput.readOnly = true;
                // timer.minuteInput.readOnly = true;
                // timer.secondInput.readOnly = true;

                // timer.intervalId = setTimer(hours, minutes, seconds, timer)
            // else {
            //     timer.button.textContent = 'Play';
            //     clearInterval(intervalId);
            //     timer.hourInput.readOnly = false;
            //     timer.minuteInput.readOnly = false;
            //     timer.secondInput.readOnly = false;
            // }
        


        function setTimer(timer){
            let hours = Number(timer.hourInput);
            let minutes = Number(timer.minuteInput);
            let seconds = Number(timer.secondInput);

            let totalSeconds = hours * 3600 + minutes * 60 + seconds;

   timer.intervalId = setInterval(() => {
    hours = Math.floor(totalSeconds / 3600);
    minutes = Math.floor((totalSeconds % 3600) / 60);
    seconds = totalSeconds % 60;
    timer.hourInput=hours;
    timer.minuteInput=minutes;
    timer.secondInput=seconds;

    if (totalSeconds <= 0) {
      clearInterval(timer.intervalId);
    }
    chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>
    {
        if(message.action==='store_current_timer'){
            chrome.storage.local.set({updatedtimer:timer},()=>{
                sendResponse({action:'returned_timer',object:timer})
            })

        
        if(message.action==='pausetimer'){
            
            clearInterval(timer.intervalId)
            chrome.storage.local.set({pausedtimer:timer},()=>{
                sendResponse({action:'returned_timer',object:timer})
            })
    } }})
    
chrome.runtime.sendMessage({action:'live_timer',object:timer})
    totalSeconds--;
  }, 1000)

  
}
    addTimerButton.addEventListener('click', createTimer);