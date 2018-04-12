let http=require('http');
let fs=require('fs');
let querystring=require('querystring');
let urlLib=require('url');

let sql={};  // {username:password,username2:password2}

//搭建服务器
http.createServer((req,res)=>{
  if(req.url!='/favicon.ico'){
    let str='';
    req.on('data',(chunk)=>{
      str+=chunk;
    });
    req.on('end',()=>{
      let path = urlLib.parse(req.url).pathname;
      let post = querystring.parse(str);
      let get = urlLib.parse(req.url,true).query;
      //判断form请求，文件请求，ajax接口
      if(path=='/form'){
        checkForm(path,req,res,post,get)
      }else if(path=='/user'){
        checkAjax(path,req,res,post,get);
      }else if(path=='jsonp'){
        //.....数据库都一圈拿到数据data
        // res.write(show(data));
      }else{
        staticWWW(path,req,res);
      }
    });
  }
}).listen(8001);
function checkAjax(path,req,res,post,get){
  let data = get.act?get:post; // json  判断post/get  拿出数据来
  // data.act == login /reg
  switch (data.act){
    case 'login':
      console.log('处理登录');
      if(sql[data.username]){
        if(sql[data.username]==data.password){
          res.write('{"error":"0",msg:"登录成功"}');
          //..去数据库里面拿用户信息...
        }else{
          res.write('{"error":"1",msg:"用户名或者密码有误"}');
        }
      }else{
        res.write('{"error":"1",msg:"用户不存在"}');
      }
      break;
    case 'reg':
      console.log('处理注册');
      if(sql[data.username]){
        res.write('{"error":"1",msg:"用户已已已已存在"}');
      }else{
        sql[data.username]=data.password;
        res.write('{"error":"1",msg:"注册成功"}');
      }
      break;
    default:
      res.write('错误的ACT');
  }
  res.end();
  console.log(sql);
}
function staticWWW(path,req,res){
  path=path=='/'?'/index.html':path;
  fs.readFile('./www'+path,(err,data)=>{
    if(err){
      res.write('404');
    }else{
      res.write(data);
    }
    res.end();
  });
}
function checkForm(path,req,res,post,get){
  //处理，简单打印
  console.log(`收到的post数据${post.user}/${post.content}`);
  console.log(`收到的get数据${get.user}/${get.content}`);
  res.end();
}
