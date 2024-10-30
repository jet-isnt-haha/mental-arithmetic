//题目和错题本管理控制器

const generationQuestion=()=>{
const operations =['+','-','*','/'];
const operation =operations[Math.floor(Math.random()*operations.length)];

let num1=Math.floor(Math.random()*100);
let num2 =Math.floor(Math.random()*100);

//确保除法可以整除
if(operation==='/'&&num2!==0){
    num1=num1-(num1%num2);//使num1能够被num2整除
}

const question={
    num1,
    num2,
    operation,
    questionText:`${num1} ${operation} ${num2}`,
};
console.log("Generated question:", question); // 打印生成的题目
return question;
}
const getQuestions=(req,res)=>{
    console.log("Received a request for questions");
    try {
      const countNum =parseInt(req.query.count,10)||1;//默认生成1道
      if (isNaN(countNum)) {
    return res.status(400).json({ error: "请提供有效的题目数量" });
}
      const questions = [];
      for (let i = 0; i < 30; i++) {
        questions.push(generationQuestion());
      }
      console.log("Generated questions:", questions); // 打印所有生成的题目
      res.json({ questions });
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(500).json({ error: "Failed to generate questions" });
    }
};

module.exports={getQuestions};