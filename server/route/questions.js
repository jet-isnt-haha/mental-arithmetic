//题目生成路由模块


const express= require('express');

const router = express.Router();//创建路由对象 

const {getQuestions}=require("../controllers/quizController");

//定义获取题目的路由

router.get("/",getQuestions);

module.exports=router;