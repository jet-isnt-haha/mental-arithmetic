//计时功能模块

//倒计时
export function countDown(requiredTime){
let totalTime=requiredTime*60;
const time =document.createElement('div');
time.id='time';
function updateTime(){
    let minutes=Math.floor(totalTime/60);

    let seconds =totalTime%60;

    minutes= minutes<10?'0'+minutes:minutes;

    seconds =seconds<10?'0'+seconds:seconds;

    time.innerText=`${minutes}:${seconds}`;

    if(totalTime<=0){
        clearInterval(interval);
        alert("倒计时结束答题时间已到")
    }
    else{
        totalTime--;
    }
    document.body.appendChild(time);
}

let interval=setInterval(updateTime,1000);

document.addEventListener('DOMContentLoaded',(e)=>{
    updateTime();
})
}
