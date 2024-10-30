//生成题目、检测答案的模块



//获取题目数据

let question =[];
let currentQuestionIndex=0;
let correctAnswerNum=0;

export async function fetchQuestions() {
    try{
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
  
    questions.forEach((question, index) => {
      const questionElement = document.createElement('div');
      const submitArea=document.createElement('input');
      submitArea.id=`${index}`;
      questionElement.textContent = `Question ${index + 1}: ${question.questionText}`;
      questionsContainer.appendChild(questionElement);
      questionsContainer.appendChild(submitArea);
    });
    const submitAnswer=document.createElement('button');
    submitAnswer.textContent=`提交答案`;
    submitAnswer.id=`btn`;
    questionsContainer.appendChild(submitAnswer);  
  };


  //提交答案
export function submitAnswer(questions){
    const submit=document.getElementById(`btn`);
    submit.addEventListener('click',()=>{      
        questions.forEach((question, index)=>{
        const userAnswerInput=document.getElementById(`${index}`);
        const userAnswer=parseFloat(userAnswerInput.value);
        const correctAnswer=calculateAnswer(questions[index]);
        if(checkAnswer(userAnswer,correctAnswer)){
        correctAnswerNum++;
        console.log("Correct");
    }else{
        console.log(`Incorrect! The correct answer was${correctAnswer},your answer is${userAnswer}`);
    }
    currentQuestionIndex++; 
if(currentQuestionIndex<questions.length){
    displayQuestion(currentQuestionIndex);//显示下一道题
}else{
    endQuiz(questions);
}});
})
//下一题

    
}
  
//结束测验
export function endQuiz(questions){
    const resultsContainer =document.getElementById("results-container");
    resultsContainer.innerHTML=`<p>Quiz complete! Your answer${correctAnswerNum} out of ${questions.length} correctly.</p>`;
}
