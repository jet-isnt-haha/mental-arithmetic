//生成题目、检测答案的模块
import { timeScore } from "./timer.js";

//得分标签
export const score =document.createElement('div');
//获取题目数据

let endTimeScore=0;
const submitAreas=[];
export let currentQuestionIndex=0;
export let correctAnswerNum=0;

//获取模式
const mode1=document.getElementById('mode1');
const mode2=document.getElementById('mode2');
//模式标识
export let flag=0;
//提交按钮
let submit=null;
//总数据
let totalData=[];
//最终题目数据
let quizs=[];
export function getTotalData(){
    return totalData;
}
export function getSubmit(){
    return submit;
}

export async function fetchQuestions(count) {
    try{
        flag=count;
        const respone =await fetch('http://localhost:9000/questions');//请求后端题目接口
        const data=await respone.json();
        return data.questions;//返回题目数组
    }
    catch(error)
    {
        console.error("Error fetching questions:",error);
    }
}

//检查答案是否正确
export function checkAnswer(userAnswer,correctAnswer){
    return userAnswer===correctAnswer;
}

//生成题目的正确答案
export function calculateAnswer(question){
    const {num1,num2,operation}=question;
    switch(operation)
    {
        case '+':
            return num1+num2;
        case '-':
            return num1-num2;
        case '*':
             return num1*num2;
        case '/':
            return num1/num2;
       default:
        return null;
    }
}
export  function displayQuestions(questions){

    const recordsContainer = document.getElementById('records-container');
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = ''; // 清空之前的题目
    recordsContainer.innerHTML='';
    if(flag===1)
    {
    questions.forEach((question, index) => {
      const questionElement = document.createElement('div');
      const submitArea=document.createElement('input');
      questionElement.className='quizs';
      submitArea.id=`${index}`;
      submitArea.className='submit-area';
      submitAreas.push(submitArea);
      inputCheck(submitArea);
      questionElement.textContent = `${index + 1}: ${question.questionText}`;
      questionsContainer.appendChild(questionElement);
      questionsContainer.appendChild(submitArea);
    });}
    else if(flag===0){
        const questionElement = document.createElement('div');
        const submitArea=document.createElement('input');
        questionElement.className='quizs';
        submitArea.id=`${currentQuestionIndex}`;
        inputCheck(submitArea);
        questionElement.textContent = `${currentQuestionIndex + 1}: ${questions[currentQuestionIndex].questionText}`;
        questionsContainer.appendChild(questionElement);
        questionsContainer.appendChild(submitArea);
    }
    const submitAnswer=document.createElement('button');
    submitAnswer.textContent=`提交答案`;
    submitAnswer.id=`btn${currentQuestionIndex}`;
    submitAnswer.className='submit-btn';
    questionsContainer.appendChild(submitAnswer);
    buttonCheck(submitAnswer,submitAreas);
  };
//获取测试的日期时间
function testDataTime()
{

    //将Date对象转换为YYYY-MM-DD HH:MM:SS并将UTC时间转换为北京时间
    const now =new Date();
    now.setHours(now.getHours()+8);
    const testDataTime=now.toISOString().slice(0,19).replace('T',' ');
    return testDataTime;
}
// 添加单次测验数据到总数据
export function addQuizDataToTotal() {

    // 将 quizs 和其他信息作为单个测验记录存入 totalData
    totalData.push({
        mode :flag,
        datetime:testDataTime(),
        totalScore: totalScore(),
        quizs: [...quizs] // 深拷贝 quizs 以保存当前状态
    });

    totalData.forEach((record, index) => {
        // console.log(`记录 ${index + 1}:  总分 - ${record.totalScore()} 测试时间 - ${record.datetime}  模式 - ${record.mode}`);
        
        // 遍历 quizs 内的每一道题目
        // record.quizs.forEach((quiz, quizIndex) => {
        //   console.log(`  题目 ${quizIndex + 1}: ${quiz.num1} ${quiz.operation} ${quiz.num2}`);
        //   console.log(`  用户答案: ${quiz.userAnswer}, 正确答案: ${quiz.correctAnswer}`);
        // });
      });
      
    //清空 quizs 以便进行下一次测验
    quizs = [];

}

export async function sendTotalData(data){
    try{
        const response =await fetch('http://localhost:9000/submitAnswer',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        });
        if(response.ok)
        {
            const result= await response.json();
            console.log("服务器响应:",result.message);
        }else{
            console.error("数据发送失败",response.status);
        }
    }catch(error){
        console.error("发送数据时出错：",error);
    }
}

export  function handleSubmit(questions) {
    if (flag === 1) {
        questions.forEach((question,index) => {
            const userAnswerInput = document.getElementById(`${index}`);
            const userAnswer = parseFloat(userAnswerInput.value);
            const correctAnswer = calculateAnswer(questions[index]);
            quizs.push({
                id:index+1,
                num1:question.num1,
                operation:question.operation,
                num2:question.num2,
                userAnswer:userAnswer,
                correctAnswer:correctAnswer
            })
            if (checkAnswer(userAnswer, correctAnswer)) {
                correctAnswerNum++;
                console.log("Correct");
            } else {
                console.log(`Incorrect! The correct answer was ${correctAnswer}, your answer is ${userAnswer}`);
            }
            endQuiz(questions);
        });
        //点击提交后暂停计算并计算时间得分
        endTimeScore=timeScore();
        submit.removeEventListener('click', () => handleSubmit(questions)); // 移除监听器
        let finalScore=totalScore();
         // 将当前测验数据添加到总数据数组
         addQuizDataToTotal();
         sendTotalData(totalData[totalData.length - 1]);//发送最新添加记录
        score.innerHTML=`${finalScore}`;
    } else if (flag === 0) {
        const userAnswerInput = document.getElementById(`${currentQuestionIndex}`);
        const userAnswer = parseFloat(userAnswerInput.value);
        const correctAnswer = calculateAnswer(questions[currentQuestionIndex]);
        if (checkAnswer(userAnswer, correctAnswer)) {
            correctAnswerNum++;
            console.log("Correct");
        } else {
            console.log(`Incorrect! The correct answer was ${correctAnswer}, your answer is ${userAnswer}`);
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            quizs.push({
                id:currentQuestionIndex+1,
                num1:questions[currentQuestionIndex].num1,
                operation:questions[currentQuestionIndex].operation,
                num2:questions[currentQuestionIndex].num2,
                userAnswer:userAnswer,
                correctAnswer:correctAnswer
            })
            displayQuestions(questions); // 显示下一道题
            submitAnswer(questions);
        } else {
            endQuiz(questions);
            addQuizDataToTotal();
            sendTotalData(totalData[totalData.length - 1]);
            submit.removeEventListener('click', () => handleSubmit(questions)); // 移除监听器
        }
    }
}
//提交答案
  export function submitAnswer(questions) {
    submit = document.getElementById(`btn${currentQuestionIndex}`);
    document.body.appendChild(score);
    submit.addEventListener('click', () => handleSubmit(questions)); // 绑定事件监听器
    // 将处理逻辑提取为具名函数
}
//输入框检验(无法输入数字意外的字符)
function inputCheck(submitArea){
    submitArea.addEventListener('input', (e) => {
        let value = e.target.value;
    
        // 如果用户输入仅是一个负号，则直接允许
        if (value === '-') {
            e.target.value = value;
            return;
        }
    
        // 正则匹配非数字和负号字符，如果有则删除
        value = value.replace(/[^0-9-]/g, '');
    
        // 输入为0开头的情况（除非是单独的0）
        if (value[0] === '0' && value.length > 1) {
            value = '0';
        }
    
        // 输入负数的情况，确保负号只能在开头
        if (value.startsWith('-')) {
            value = '-' + value.slice(1).replace(/-/g, ''); // 保留第一个负号，删除其他负号
        }
    
        // 更新输入框的值
        e.target.value = value;
    });}
//提交按钮检验(当输入为空时无法提交答案和答题结束时无法提交答案)
function buttonCheck(submitAnswer,submitAreas){
submitAnswer.disabled=true;
if(flag===1)
{   
     function checkInputs() {
    const allFilled=submitAreas.every(submitArea=>submitArea.value!==''&&submitArea.value!=='-');
    submitAnswer.disabled=!allFilled;    
}
submitAreas.forEach(submitArea=>submitArea.addEventListener('input',checkInputs));
}
else if(flag===0){
    const submitArea=document.getElementById(`${currentQuestionIndex}`);
    submitArea.addEventListener('input',()=>{
        if(submitArea.value!==''&&submitArea.value!=='-'){
            submitAnswer.disabled=false;
        }
        else{
            submitAnswer.disabled=true;
        }
    })}
}
//结束测验
export function endQuiz(questions){
    if(flag===1){
    submitAreas.forEach(submitArea=>submitArea.disabled=true);
}
if(flag===0){
    const submitArea=document.getElementById(`${currentQuestionIndex}`);
    submitArea.disabled=true;
}
    const submit=document.getElementById(`btn${currentQuestionIndex}`);
    submit.disabled=true;
    const resultsContainer =document.getElementById("results-container");
    resultsContainer.innerHTML=`<p>Quiz complete! Your answer${correctAnswerNum} out of ${questions.length} correctly.</p>`;
}

//清空题目
export function clearQuiz(){
    const questionsContainer = document.getElementById('questions-container');
    const resultsContainer =document.getElementById("results-container");
    if(questionsContainer)
        questionsContainer.innerHTML = '';
    if(resultsContainer)
        resultsContainer.innerHTML='';
    if(score)
        score.innerHTML='';
    correctAnswerNum=0;
    currentQuestionIndex=0;
}

//结算成绩
export function totalScore(){
 if(flag===1)
 {
    const result=parseFloat(timeScore()+correctAnswerNum/30*100).toFixed(2);
    return result
 }
 else if(flag===0){
    if(currentQuestionIndex!=0)
    {
        const result=parseFloat(1.0*correctAnswerNum*correctAnswerNum/currentQuestionIndex).toFixed(2);
    return result;
    }
    else
    return 0;
 }
}
