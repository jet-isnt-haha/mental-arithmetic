//数据库管理模块

const mysql =require('mysql2');


//配置连接的数据库
const connection =mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"",
    password:"",
    database:"",
});

//连接数据库

connection.connect((err)=>{
    if(err){
        console.error('Error connecting to the database:',err.message);
        return;
    }
    console.log('Connected to the MySQL database');
});

module.exports=connection;