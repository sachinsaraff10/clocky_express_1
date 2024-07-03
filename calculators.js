
<body><div style="display:flex; justify-content:center; flex-direction:column">
  <div class="container1" style="display:flex; justify-content:center; ">
    <input id='entry' type='text'></input></div>
  <div style="display:flex; justify-content:center; margin-top=10px">
    <button id="one">1</button>
    <button id="two">2</button>
    <button id="three">3</button>
  </div>
  <div style="display:flex; justify-content:center; margin-top=10px">
    <button id="four">4</button>
    <button id="five">5</button>
    <button id="six">6</button>
  </div>
  <div style="display:flex; justify-content:center; margin-top=10px">
    <button id='seven'>7</button>
    <button id='eight'>8</button>
    <button id='nine'>9</button>
  </div>
  <div style="display:flex; justify-content:center; margin-top=10px">
    <button id='zero'>0</button>
    <button id='plus'>+</button>
    <button id='minus'>-</button>
  </div>
  <div style="display:flex; justify-content:center; margin-top=10px">
    <button id='by'>/</button>
    <button id='into'>*</button>
    <button id='equals'>=</button>
   
  </div>
  <script>
    let x=0;
  let operators=[];
  let operands =[];
    const one=document.getElementById("one");
const two=document.getElementById("two");
const three=document.getElementById("three");
const four=document.getElementById("four");
const five=document.getElementById("five");
const six=document.getElementById('six');
const seven=document.getElementById('seven');
const eight=document.getElementById('eight');
const nine=document.getElementById('nine');
const zero=document.getElementById('zero');
const inpp=document.getElementById('entry');
const plus=document.getElementById('plus');
const minus=document.getElementById('minus');
const into=document.getElementById('into')
const
equal=document.getElementById('equal');
function operation(operand1,operand2,operator){
    if(operator===plus){
        return (operand1 + operand2);
    }elif (operator===minus){
        return (operand1-operand2);
    }elif(operator===into){
        return(operand1*operand2)
    }
    else{
        return(operand1/operand2)
    }
    }

one.addEventListener('click',()=>{
  
  } 

)





    
    
  </script>
  </div>
  
  
</body>