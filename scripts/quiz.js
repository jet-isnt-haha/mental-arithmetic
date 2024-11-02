//生成题目、检测答案的模块
import { timeScore } from "./timer.js";

//得分标签
export const score =document.createElement('div');
//获取题目数据

let endTimeScore=0;
let question =[];
export let currentQuestionIndex=0;
export let correctAnswerNum=0;

//获取模式
const mode1=document.getElementById('mode1');
const mode2=document.getElementById('mode2');
export let flag=0;
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

//显示题目
export  function displayQuestions(questions){
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = ''; // 清空之前的题目
    if(flag==1)
    {
    questions.forEach((question, index) => {
      const questionElement = document.createElement('div');
      const submitArea=document.createElement('input');
      submitArea.id=`${index}`;
      questionElement.textContent = `Question ${index + 1}: ${question.questionText}`;
      questionsContainer.appendChild(questionElement);
      questionsContainer.appendChild(submitArea);
    });}
    else if(flag==0){
        const questionElement = document.createElement('div');
        const submitArea=document.createElement('input');
        submitArea.id=`${currentQuestionIndex}`;
        questionElement.textContent = `Question ${currentQuestionIndex + 1}: ${questions[currentQuestionIndex].questionText}`;
        questionsContainer.appendChild(questionElement);
        questionsContainer.appendChild(submitArea);
    }
    const submitAnswer=document.createElement('button');
    submitAnswer.textContent=`提交答案`;
    submitAnswer.id=`btn${currentQuestionIndex}`;
    questionsContainer.appendChild(submitAnswer);
  };
let submit=null;
export  function handleSubmit(questions) {
    if (flag === 1) {
        questions.forEach((question,index) => {
            const userAnswerInput = document.getElementById(`${index}`);
            const userAnswer = parseFloat(userAnswerInput.value);
            const correctAnswer = calculateAnswer(questions[index]);
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
            displayQuestions(questions); // 显示下一道题
            submitAnswer(questions);
        } else {
            endQuiz(questions);
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

//结束测验
export function endQuiz(questions){
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
    return timeScore()+correctAnswerNum/30*100;
 }
 else if(flag===0){
    return correctAnswerNum*correctAnswerNum/currentQuestionIndex;
 }
}
