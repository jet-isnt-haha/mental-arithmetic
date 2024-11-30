




let buttons={};
export async function fetchHistoryQuizs() {
        const response = await fetch('http://localhost:9000/getData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const datas = await response.json();
        return datas; // 直接返回数组
}

function displayDetailedQuizs(e){
    
    const recordsContainer = document.getElementById('records-container');
    recordsContainer.innerHTML='';
    fetchDetailedQuizs(e).then((result)=>{
        result.forEach((quiz,index)=>{
            const quizElement=document.createElement('div');
            quizElement.id=`detail-quiz${index+1}`;
            quizElement.textContent=`${index+1}————${quiz.num1} ${quiz.operation} ${quiz.num2}=${quiz.userAnswer}————正确答案${quiz.correctAnswer}`;

            recordsContainer.appendChild(quizElement);
        });
    })
}
export function dislayHistoryQuizs(){
    const recordsContainer = document.getElementById('records-container');
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = ''; // 清空之前的题目
    recordsContainer.innerHTML='';
    fetchHistoryQuizs().then((result)=>{result.forEach((record,index)=>{
            const recordElement =document.createElement('div');
            const detailQuiz=document.createElement('button');
            detailQuiz.id=`detail${index}`;
            detailQuiz.className='detail-quiz';
            detailQuiz.textContent='详细题目记录';
            buttons[`detail${index}`]=index;
            recordElement.className='records';
            recordElement.id=`record${index+1}`;
            recordElement.textContent=`题目编号${index+1}————模式${record.mode}————得分${record.totalScore}————测试时间${record.datetime}`;
            recordsContainer.appendChild(recordElement);
            recordsContainer.appendChild(detailQuiz);
        });})

       //动态生成的button事件通过事件委托实现
       recordsContainer.addEventListener('click',(e)=>{
        if(e.target.classList.contains('detail-quiz')){
            displayDetailedQuizs(e);
        }
       })


}

export async function fetchDetailedQuizs(e){
    const element=e.target.id;
    const response =await fetch('http://localhost:9000/getDetailedQuizs',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify({ id: buttons[element] }),
    });
    const details = await response.json();

    return details; // 返回数组
}

