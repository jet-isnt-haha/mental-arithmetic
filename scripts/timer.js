//计时功能模块
import { flag,totalScore,correctAnswerNum,currentQuestionIndex,score, handleSubmit } from "./quiz.js";
import { questions } from "./main.js";

let intervalId = null;
let totalTime =0;
let minutes=0;
let seconds =0;
let time=0;
//倒计时
export function countDown(requiredTime){
 totalTime=requiredTime*60;
time =document.createElement('div');
time.id='time';
updateTime();
    document.body.appendChild(time);
intervalId=setInterval(updateTime,100);
document.addEventListener('DOMContentLoaded',(e)=>{
    updateTime();
})
}
function updateTime(){
    minutes=Math.floor(totalTime/60);
    seconds =totalTime%60;
   minutes= minutes<10?'0'+minutes:minutes;
   seconds =seconds<10?'0'+seconds:seconds;
   if(totalTime<=0){//做到超时暂停倒计时且结算分数
       clearInterval(intervalId);
       if(flag===1)
       handleSubmit(questions);
        let finalScore=totalScore();    
        score.innerHTML=`${finalScore}`;
        document.body.appendChild(score);
       alert("倒计时结束答题时间已到");
   }
   else{
       totalTime--;
   }
   time.innerText=`${minutes}:${seconds}`;
}
//清除计时器
export  function clearTime(){
    const time =document.getElementById('time');
    if(time)
        time.remove();
    if(intervalId)
        clearInterval(intervalId);
    if(score)
        score.innerHTML='';
}

//计算模式1的结算分数

export function timeScore(){
    clearInterval(intervalId);
    return minutes+0.01*seconds;
}