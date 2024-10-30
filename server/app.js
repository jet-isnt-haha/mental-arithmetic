//主后端文件，处理路由和服务

const express = require('express'); //引入express模块

const cors=require("cors");//引入CORS中间件 

const app=express();//创建express应用实例

const port=9000; //端口号

app.use(cors());//启用CORS


//引入并挂载题目路由
const quizRoutes=require("./route/questions");
app.use("/questions",quizRoutes);

app.listen(port,()=>{
  console.log(`Server listening on port port${port}`);
})