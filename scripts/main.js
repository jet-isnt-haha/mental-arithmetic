//前端主逻辑脚本


import { fetchQuestions,checkAnswer,calculateAnswer,displayQuestions,submitAnswer,endQuiz } from "./quiz.js";
import { countDown } from "./timer.js";


const mode1=document.getElementById('mode1');
const mode2=document.getElementById('mode2');
//初始化应用
//模式1
mode1.addEventListener('click', modeOne);
async function modeOne(){
  const questions = await fetchQuestions(1); // 获取题目
  // 确保 questions 不为空
  countDown(25);
  if (questions.length > 0) {
    displayQuestions(questions); // 将问题传递给 displayQuestions 函数
  }
  submitAnswer(questions);
}


//模式2
mode2.addEventListener('click',modeTwo);
async function modeTwo(){
  const questions = await fetchQuestions(0); // 获取题目
  countDown(3);
  if (questions.length > 0) {
    displayQuestions(questions);
  }
  submitAnswer(questions);
}

// 确保在页面加载时没有多余的初始化
document.addEventListener("DOMContentLoaded", () => {
});