//生成题目、检测答案的模块



//获取题目数据

let question =[];
let currentQuestionIndex=0;
let correctAnswerNum=0;
let isSubmitButtonCreated = false;//状态变量用来跟踪提交按钮是否已创建

//获取模式
const mode1=document.getElementById('mode1');
const mode2=document.getElementById('mode2');
let flag=0;
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


  //提交答案
  export function submitAnswer(questions) {
    const submit = document.getElementById(`btn${currentQuestionIndex}`);
    // 将处理逻辑提取为具名函数
    function handleSubmit() {
        if (flag === 1) {

            questions.forEach((question, index) => {
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
            submit.removeEventListener('click', handleSubmit); // 移除监听器
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
                submit.removeEventListener('click', handleSubmit); // 移除监听器
            }
        }
    }
    submit.addEventListener('click', handleSubmit); // 绑定事件监听器
}

//结束测验
export function endQuiz(questions){
    const resultsContainer =document.getElementById("results-container");
    resultsContainer.innerHTML=`<p>Quiz complete! Your answer${correctAnswerNum} out of ${questions.length} correctly.</p>`;
}
