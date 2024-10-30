//前端主逻辑脚本


import { fetchQuestions,checkAnswer,calculateAnswer,displayQuestions,submitAnswer,endQuiz } from "./quiz.js";

const mode1=document.getElementById('mode1');
const mode2=document.getElementById('mode2');
//初始化应用
//模式1
mode1.addEventListener('click', async () => {
  const respone =await fetch(`http://localhost:9000/questions?count=${30}`,{
    method:'GET',
    headers:{
      'Content-Type':'application/json'
    }
  });
  // 初始化并获取问题
  const questions = (await respone.json()).questions; // 获取题目
  // 确保 questions 不为空
  if (questions.length > 0) {
    displayQuestions(questions); // 将问题传递给 displayQuestions 函数
  }
  submitAnswer(questions);
});

//模式2
mode2.addEventListener('click',async()=>{
  
  var count=0;
  while(1){
    const respone =await fetch(`http://localhost:9000/questions?count=${1}`,{
      method:'GET',
      headers:{
        'Content-Type':'application/json'
      }
    });
  const questions = (await respone.json()).questions; // 获取题目
    displayQuestions(questions)
  submitAnswer(questions);}
})
// 确保在页面加载时没有多余的初始化
document.addEventListener("DOMContentLoaded", () => {
  
});