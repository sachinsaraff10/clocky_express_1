let lst=[];

        // let x=0;
const urlParams = new URLSearchParams(window.location.search);
let domains = urlParams.get('domainId');

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
if (message.action==='getready'){
  sendResponse({action:'storageplease'})}
if(message.action==='hereyougo'){
  let domains=message.object;
  chrome.storage.local.get(['urltotimer'],(result)=>{
  let urltimer=result.urltotimer;
  for (let i=0;i<domains.length;i++){
      presetok(domains[i],container3,urltimer[domains[i]])
  }
  })}

})
const body=document.querySelector('body');
body.style.display='flex';
        const maincontainer=document.getElementById('maincontainer')
  maincontainer.style.display='flex';
  maincontainer.style.flexDirection='column';

  const container2=document.getElementById('container2');
  container2.style.marginBottom='25px';
  const container3=document.getElementById('container3');
  container3.style.display='flex';
  container3.style.flexDirection='column';
  container3.style.marginLeft='10px';
  container3.style.gap='10px';
  container2.style.flexGrow='.2';       
        function remover(parent,child){
         parent.removeChild(child);
          }
 
  let inpp=document.getElementById('urlId');
     // inpp.type='text';
     inpp.placeholder='www.example.com';
     // inpp.id='urlID';
     // dbox.appendChild(inpp);
      const okbtn=document.getElementById('okbutton');
     // okbtn.textContent="okay";
      okbtn.disabled=true;
      inpp.addEventListener('input', () => {
        const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)?[a-z0-9-]+\.[a-z]{2,}\/?.*$/i;
        const urlInput = inpp.value.trim();
        if (urlPattern.test(urlInput)) {
          okbtn.disabled = lst.includes(urlInput);
        } else {
          okbtn.disabled = true;
        }})
        
      // });
      // const cancelbtn=document.createElement('button');
     // cancelbtn.textContent=`cancel`;
      // cancelbtn.addEventListener('click',()=>{disappear(dbox)});
     // dbox.appendChild(okbtn);
     // dbox.appendChild(cancelbtn);
      
      okbtn.addEventListener('click',()=>{setok(okbtn,inpp,container3);
        
        let url=inpp.value;        
        chrome.runtime.sendMessage({ action: 'set-timer',url:url});
    });
      function setok(button,input,div){
        // const listcontainer=document.getElementById('listcontainer');
    const label=document.createElement('label');
    const radiocontainer=document.createElement('div');
    const maincontainer=document.createElement('div');
    // listcontainer.classList.add('listbox');
    maincontainer.style.height='fit-content';
    maincontainer.style.width='fit-content';
    maincontainer.style.display='flex';
    maincontainer.style.flexDirection='column';
    radiocontainer.style.height='fit-content';
     radiocontainer.style.width='fit-content';
     radiocontainer.style.display='flex';
     radiocontainer.style.justifyContent='space-even';
     const radio=document.createElement('input');
     radio.type='radio';
        radio.name = 'radioGroup';
      radio.value=input.value;
     label.setAttribute('for','radio');   
     
    label.textContent=radio.value;
    let unique=label.textContent;
    
    if (lst.includes(unique)){
      button.disabled=true;
    }else{lst.push(unique);
      // ipcRenderer.send('url-added',unique);
      button.disabled=false;
    }   
        radiocontainer.appendChild(radio);
        radiocontainer.appendChild(label);
   radio.addEventListener('click', () => {
      if (radio.checked) {
        radio.focus(); 
        // Ensure the radio button has focus after being checked
      // radio.addEventListener('click',()=>{radio.checked=false;})}
      }})
  
    // Event listener for the keydown event on the document
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Delete' && radio.checked) {
        const selectedText = radiocontainer.querySelector('input:checked + label').textContent;
    lst = lst.filter((item) => item !== selectedText);
        maincontainer.remove();
      }})
  let timercontainer=addtimer();
  maincontainer.appendChild(radiocontainer);
  maincontainer.appendChild(timercontainer);
   div.appendChild(maincontainer);     
      }
      function presetok(input,div,timer){
        const label=document.createElement('label');
        const radiocontainer=document.createElement('div');
        
        radiocontainer.style.height='fit-content';
         radiocontainer.style.width='fit-content';
         radiocontainer.style.display='flex';
         radiocontainer.style.justifyContent='space-even';
         const radio=document.createElement('input');
         radio.type='radio';
            radio.name = 'radioGroup';
          radio.value=input;
         label.setAttribute('for','radio');   
         
        label.textContent=radio.value;
        let unique=label.textContent;
        
        radiocontainer.appendChild(radio);
        radiocontainer.appendChild(label);
        storedtimer(timer);
   radio.addEventListener('click', () => {
      if (radio.checked) {
        radio.focus(); 
              }})
  
    // Event listener for the keydown event on the document
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Delete' && radio.checked) {
        const selectedText = radiocontainer.querySelector('input:checked + label').textContent;
    lst = lst.filter((item) => item !== selectedText);
        maincontainer.remove();
        
      }})
   div.appendChild(radiocontainer);     
    
      }
      function addtimer(){
      const timerDiv = document.createElement('div');
            timerDiv.classList.add('container');
            const okayButton=document.createElement('button');
            okayButton.textContent='Okay';
            okayButton.disabled=true;
            const hourInput = document.createElement('input');
            hourInput.type = 'text';
            hourInput.addEventListener('input',()=>{
              let hours = Number(minuteInput.value);
              let minutes = Number(minuteInput.value);
  let seconds = Number(secondInput.value);
              if (isNaN(hours)|| isNaN(minutes) || isNaN(seconds) || minutes >= 60 || seconds >= 60){
                okayButton.disabled=true;
              }
              else{
                okayButton.disabled=false;
              }
            })
            hourInput.placeholder='hours';
            hourInput.classList.add('hours');
            

            const minuteInput = document.createElement('input');
            minuteInput.type = 'text';
            minuteInput.placeholder='minutes';
            minuteInput.addEventListener('input',()=>{
              let hours = Number(minuteInput.value);
              let minutes = Number(minuteInput.value);
              let seconds = Number(secondInput.value);

              if (isNaN(hours)|| isNaN(minutes) || isNaN(seconds) || minutes >= 60 || seconds >= 60){
                okayButton.disabled=true;
              }
              else{
                okayButton.disabled=false;
              }
              
            })
            minuteInput.classList.add('minutes');

            const secondInput = document.createElement('input');
            secondInput.type = 'text';
            secondInput.placeholder='seconds';
            secondInput.addEventListener('input',()=>{
              let hours = Number(minuteInput.value);
              let minutes = Number(minuteInput.value);              
              let seconds = Number(secondInput.value);
              if (isNaN(hours)|| isNaN(minutes) || isNaN(seconds) || minutes >= 60 || seconds >= 60){
                okayButton.disabled=true;
              }
              else{
                okayButton.disabled=false;
              }
            })
            secondInput.classList.add('seconds');
            timerDiv.appendChild(hourInput);
            timerDiv.appendChild(document.createTextNode(':'));
            timerDiv.appendChild(minuteInput);
            timerDiv.appendChild(document.createTextNode(':'));
            timerDiv.appendChild(secondInput);
            // timerContainer.appendChild(timerDiv);
            timerDiv.appendChild(okayButton);
            
            function handlesettimer(message, sender, sendResponse)
            {
              if (message.action==="set-timer"){
                let url=message.url;
                chrome.storage.local.set({url:url})
                chrome.runtimer.onMessage.removeListener(handlesettimer); 
              }}
            chrome.runtime.onMessage.addListener(handlesettimer);
            okayButton.addEventListener('click',
                ()=>{
                  let timer = {
                
                    hourInput: hourInput.value,
                    minuteInput: minuteInput.value,
                    secondInput: secondInput.value,
                    urlId:null,
                    intervalId:null};
                  timer=JSON.stringify(timer);
                  chrome.storage.local.get(['url'],(result)=>{
                    let url=result.url;
                    chrome.runtime.sendMessage({action:"monitorURL",
                    timer:timer,url:url})
                    okayButton.disabled=true;
                  })
                     })
                  
   return timerDiv;     }


        function storedtimer(timer){
          const timerDiv = document.createElement('div');
                timerDiv.classList.add('container');
                
                const hourInput = document.createElement('input');
                hourInput.type = 'text';
                hourInput.classList.add('hours');
                hourInput.value=timer.hourInput;
                const minuteInput = document.createElement('input');
                minuteInput.type = 'text';
                minuteInput.value=timer.minuteInput;
                minuteInput.classList.add('minutes');
    
                const secondInput = document.createElement('input');
                secondInput.type = 'text';
                secondInput.value=timer.secondInput;
                secondInput.classList.add('seconds');
    
                // const playButton = document.createElement('button');
                // playButton.textContent = 'Play';
                // playButton.classList.add('paused');
                timerDiv.appendChild(hourInput);
                timerDiv.appendChild(document.createTextNode(':'));
                timerDiv.appendChild(minuteInput);
                timerDiv.appendChild(document.createTextNode(':'));
                timerDiv.appendChild(secondInput);
               
                container3.appendChild(timerDiv)
    
                
            }