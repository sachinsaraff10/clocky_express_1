const timerContainer = document.getElementById('timerContainer');
   
// const addTimerButton = document.getElementById('addTimerButton');
      let intervalID;
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
        if (message.action==='launch_now'){
            console.log('received');
            let timerObject = message.object;
            console.log(timerObject);
            console.log(timerObject.hourinput);
            createTimer(timerObject);
            setTimer(timerObject);
            if(timerObject.intervalId)
            {
                sendResponse({action:"good_to_go"})
        }
        }
    })
         function createTimer(timer) {

            const hourInput = document.getElementById('hourInput');
            hourInput.readOnly=true
            hourInput.value=timer.hourinput;
            

            const minuteInput = document.getElementById('minuteInput');
            minuteInput.readOnly=true
            minuteInput.value=timer.minuteinput;
            const secondInput = document.getElementById('secondInput');
            secondInput.readOnly=true
            secondInput.value=timer.secondinput;
            
            
        }

        // function handleTimerClick(timer) {
        //     let hours = Number(timer.hourInput.value);
        //     let minutes = Number(timer.minuteInput.value);
        //     let seconds = Number(timer.secondInput.value);

        //     if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        //         console.log('Invalid, enter a number');
        //         return;
        //     }

        //     if (minutes >= 60 || seconds >= 60) {
        //         console.log('Invalid, enter number below 60');
        //         return;
        //     }

        //     if (timer.button.textContent === 'Play') {
        //         timer.button.textContent = 'Pause';
        //         timer.hourInput.readOnly = true;
        //         timer.minuteInput.readOnly = true;
        //         timer.secondInput.readOnly = true;

        //         timer.intervalId = setTimer(hours, minutes, seconds, timer)
        //     } else {
        //         timer.button.textContent = 'Play';
        //         clearInterval(intervalId);
        //         timer.hourInput.readOnly = false;
        //         timer.minuteInput.readOnly = false;
        //         timer.secondInput.readOnly = false;
        //     }
        // }
        // function handletabstatus(timer) {
        //     let hours = Number(timer.hourInput.value);
        //     let minutes = Number(timer.minuteInput.value);
        //     let seconds = Number(timer.secondInput.value);

        //     if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        //         console.log('Invalid, enter a number');
        //         return;
        //     }

        //     if (minutes >= 60 || seconds >= 60) {
        //         console.log('Invalid, enter number below 60');
        //         return;
        //     }
        //     chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{if (
        //         !changeInfo.url
        //     ){
        //         timer.hourInput.readOnly = true;
        //         timer.minuteInput.readOnly = true;
        //         timer.secondInput.readOnly = true;

        //         timer.intervalId = setTimer(timer);
                
        //     }else{
        //         clearInterval(intervalId);
        //         timer.hourInput.readOnly = true;
        //         timer.minuteInput.readOnly = true;
        //         timer.secondInput.readOnly = true;
   
        //     }

        //     })}

        // function pauser(timer){
        //     clearInterval(timer.intervalId);

        // }
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
            let hours = Number(timer.hourinput);
            let minutes = Number(timer.minuteinput);
            let seconds = Number(timer.secondinput);

            let totalSeconds = hours * 3600 + minutes * 60 + seconds;

   timer.intervalId = setInterval(() => {
    hours = Math.floor(totalSeconds / 3600);
    minutes = Math.floor((totalSeconds % 3600) / 60);
    seconds = totalSeconds % 60;
    timer.hourinput=hours;
    timer.minuteinput=minutes;
    timer.secondinput=seconds;

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
    // addTimerButton.addEventListener('click', createTimer);