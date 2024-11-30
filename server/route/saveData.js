//提交题目数据路由模块

const express =require('express');
const router =express.Router();
const db =require('../db');//导入数据库连接


router.post('/submitAnswer',(req,res)=>{
    // const{mode,datetime,totalScore}=req.body;
    const{mode,totalScore,datetime,quizs}=req.body;
    console.log(req.body);
   
    const quizs_id=null;
    const totalQuery=`INSERT INTO total_data(mode,totalScore,datetime,quizs_id)VALUES(?,?,?,NULL)`;
    db.query(totalQuery,[mode,totalScore,datetime,quizs_id],(err,result)=>{
        if(err){
            console.error('Error inserting totalData:',err.message);
            return res.status(500).send('Failed to save totalData');
        }
        const totalDataId= result.insertId;

        const quizsTableName =`quizs_${totalDataId}`;
        const createTableQuery=`
        CREATE TABLE\`${quizsTableName}\`(
        id INT AUTO_INCREMENT PRIMARY KEY,
        num1 INT NOT NULL,
        operation VARCHAR(10) NOT NULL,
        num2 INT NOT NULL,
        userAnswer INT NOT NULL,
        correctAnswer INT NOT NULL
        )
        `;
        db.query(createTableQuery);
// Step 3: 插入 quizs 数据
const quizQuery = `
INSERT INTO \`${quizsTableName}\` (num1, operation, num2, userAnswer, correctAnswer)
VALUES (?, ?, ?, ?, ?)
`;

// 使用 Promise.all 批量插入数据
const insertPromises = quizs.map((quiz) => {
return new Promise((resolve, reject) => {
    db.query(
        quizQuery,
        [quiz.num1, quiz.operation, quiz.num2, quiz.userAnswer, quiz.correctAnswer],
        (err, result) => {
            if (err) reject(err);
            else resolve(result);
        }
    );
});
});

Promise.all(insertPromises)
.then(() => {
    //使用!res.headersSent检查响应状态，避免多次调用
    if(!res.headersSent){
    res.status(200).json({ message: 'Data received and table created successfully' });
    }
})
.catch((err) => {
    console.error('Error inserting quiz data:', err.message);
    if(!res.headersSent){
    res.status(500).send('Failed to save quiz data');
    };
});
        res.status(200).json({message:"totalData receive successfully"});
    });
});

module.exports=router;