// 引入http
let http = require('http');
// 引入fs
let fs = require('fs');
// 引入path
let path = require('path');
// 引入mime
let mime = require('mime');

//拼接一个根目录
let rootPath = path.join(__dirname,'www');
// 开启服务
http.createServer((request,response)=>{
    // 根据请求的url,生成静态资源服务器的绝对路径
    let filePath = path.join(rootPath,request.url);
    // console.log(filePath);
    // 判断有没有有这个文件
    let isExist = fs.existsSync(filePath);
    if(isExist) {
        //如果有
        //生成文件列表
        fs.readdir(filePath,(err,files)=>{
            // console.log(files);
           if(err) {
               //进入这里说明是文件,读取并返回文件
               fs.readFile(filePath,(err,data)=>{
                   if(err) {

                   } else {
                       //直接返回
                       response.writeHead(200,{
                           'content-type':mime.getType(filePath)
                       });
                       response.end(data);
                   }
               })
           } else{
               //进入这里说明是文件夹
                if(files.indexOf('index.html')!=-1){
                    //进入这里说明有首页
                    fs.readFile(path.join(filePath,'index.html'),(err,data)=>{
                        if(err){

                        } else {
                            response.end(data);
                        }
                    });
                } else {
                    //进入这里说明没首页
                    let backData = '';
                    for(let i = 0;i < files.length; i++) {
                        backData += `
                            <h2><a style="text-decoration: none;" href="${request.url=='/'?'':request.url}/${files[i]}">${files[i]}</a></h2>
                        `;
                    }
                    response.writeHead(200,{
                        'content-type':'text/html;charset=utf-8'
                    });
                    response.end(backData);
                }
           }
        })
    } else {
       //如果没有,提示用户并改变状态
        response.writeHead(404,{
            'content-type':'text/html;charset=utf-8'
        });
        response.end(`
        <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
        <html><head>
        <title>404 Not Found</title>
        </head><body>
        <h1>Not Found</h1>
        <p>The requested URL /index.hththt was not found on this server.</p>
        </body></html>
        `);
    }


    
}).listen(80,'127.0.0.1',()=>{
    console.log('开启监听');
})