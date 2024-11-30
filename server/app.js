//主后端文件，处理路由和服务

const express = require('express'); //引入express模块

const cors=require("cors");//引入CORS中间件 

const app=express();//创建express应用实例

const port=9000; //端口号

app.use(cors());//启用CORS

//使用json中间件解析json数据
app.use(express.json());



//获取历史详细题目集路由
const getHistoryQuizs=require('./route/getDetailedQuizs');
app.use('/',getHistoryQuizs);

//获取历史记录路由
const getRoute=require('./route/getData');
app.use('/',getRoute)

//引入并挂载处理提交路由
const dataRoutes =require('./route/saveData');
app.use('/',dataRoutes);

//引入并挂载题目路由
const quizRoutes=require("./route/questions");
app.use("/",quizRoutes);

app.listen(port,()=>{
  console.log(`Server listening on port port${port}`);
})