//获取历史记录数据路由模块

const express =require('express');
const router =express.Router();
const db=require('../db');
// const { totalScore } = require('../../scripts/quiz');

router.post('/getData',(req,res)=>{
    const query =`SELECT *FROM total_data`;
    db.query(query,(err,result)=>{
        if(err){
            return res.status(500).json({message:`Error receiving data`});
        }
        const data=result.map(row=>({
            mode:row.mode,
            totalScore:row.totalScore,
            datetime:row.datetime
        }))
        res.status(200).json(data);
    })
})

module.exports=router;