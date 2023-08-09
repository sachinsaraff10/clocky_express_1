const timerContainer = document.getElementById('timerContainer');
        const addTimerButton = document.getElementById('addTimerButton');
      let intervalID;
        let timers = [];
      // let intervalID;
      const urlParams = new URLSearchParams(window.location.search);
let timerId = urlParams.get('timerId');
chrome.runtime.sendMessage({ action: 'timer_please', timerId }, (response) => {
    // Response contains the timer object, use it as needed
    let timerObject = response.timer;
    // Use the timerObject in your popup window
    setTimer(timerObject);
    })
         function createTimer() {
            const timerDiv = document.createElement('div');
            timerDiv.classList.add('container');

            const hourInput = document.createElement('input');
            hourInput.type = 'text';
            hourInput.placeholder='hours';
            hourInput.classList.add('hours');

            const minuteInput = document.createElement('input');
            minuteInput.type = 'text';
            minuteInput.placeholder='minutes';
            minuteInput.classList.add('minutes');

            const secondInput = document.createElement('input');
            secondInput.type = 'text';
            secondInput.placeholder='seconds';
            secondInput.classList.add('seconds');

            const playButton = document.createElement('button');
            playButton.textContent = 'Play';
            playButton.classList.add('paused');

            timerDiv.appendChild(hourInput);
            timerDiv.appendChild(document.createTextNode(':'));
            timerDiv.appendChild(minuteInput);
            timerDiv.appendChild(document.createTextNode(':'));
            timerDiv.appendChild(secondInput);
            timerContainer.appendChild(timerDiv);
            timerContainer.appendChild(playButton);

            const timer = {
                button: playButton,
                hourInput: hourInput,
                minuteInput: minuteInput,
                secondInput: secondInput,
                intervalId: null
            };

            timers.push(timer);

            playButton.addEventListener('click', () => {
                handleTimerClick(timer);
            });
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

                timer.intervalId = setTimer(hours, minutes, 
                    seconds, timer);
                
            }else{
                clearInterval(intervalId);
                timer.hourInput.readOnly = true;
                timer.minuteInput.readOnly = true;
                timer.secondInput.readOnly = true;
   
            }

            })}
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
            let hours = Number(timer.hourInput.value);
            let minutes = Number(timer.minuteInput.value);
            let seconds = Number(timer.secondInput.value);

            let totalSeconds = hours * 3600 + minutes * 60 + seconds;

   timer.intervalId = setInterval(() => {
    hours = Math.floor(totalSeconds / 3600);
    minutes = Math.floor((totalSeconds % 3600) / 60);
    seconds = totalSeconds % 60;
    timer.hourInput.value=hours;
    timer.minuteInput.value=minutes;
    timer.secondInput.value=seconds;

    if (totalSeconds <= 0) {
      clearInterval(intervalId);
    }

    totalSeconds--;
  }, 1000);

  
}
    addTimerButton.addEventListener('click', createTimer);