//获取历史详细题目数据路由模块

const express =require('express');
const router =express.Router();
const db=require('../db');

// const{id}=require('../../scripts/quiz');//从前端获取要打开的详细题目集的id

router.post('/getDetailedQuizs',(req,res)=>{
    const id=req.body.id;
    const query=`SELECT *FROM quizs_${id+1}`;
    db.query(query,(err,result)=>{
        if(err){
            return res.status(500).json({message:`Error receiving data`});
        }
        const data=result.map(row=>({
            num1:row.num1,
            operation:row.operation,
            num2:row.num2,
            userAnswer:row.userAnswer,
            correctAnswer:row.correctAnswer,
        }))
        res.json(data);
    })
})

module.exports=router;