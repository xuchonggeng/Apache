/**
 *  仿apache的静态资源服务器
 *  
 *  1.引入相关的模块
 * 2.开启服务
 * 3.监听
 * 4.拼接一个根目录
 * 5.把相对路径转换成绝对路径
 * 6.判断是否有这个文件,如果有就继续,没有就提示用户并改变状态
 * 7.判断这个文件是文件夹还是文件,如果是文件就直接读取并展示
 * 如果是文件夹就要判断是否有首页,有首页就读取首页,没有就把所有的文件展示出来
 * 8.点击文件夹,拼接a里面的href,即可进入文件夹继续访问
 * 
 * 
 * 
 */
//引入http
let http = require('http');
//引入fs
let fs = require('fs');
//引入path
let path = require('path');
//引入mime模块
let mime = require('mime');
//引入querystring
let querystring = require('querystring');

// 拼接一个网站根目录
let rootPath = path.join(__dirname,'www');

//开启服务
http.createServer((request,response)=>{

    //把相对路径转换成绝对路径
    let filePath = path.join(rootPath,querystring.unescape(request.url));
    console.log(filePath);
    //判断是否存在这个文件
    let isExists = fs.existsSync(filePath);
    if(isExists){
        //如果存在这个文件,就继续走,生成文件列表,如果不是文件夹就会出错
        fs.readdir(filePath,(err,files)=>{
            if(err){
                //进入这里说明是文件,那就读取文件并返回读取的文件
                fs.readFile(filePath,(err,data)=>{
                    if(err){

                    } else {
                        response.writeHead(200,{
                            'content-type': mime.getType(filePath)
                        });
                        response.end(data);
                    }
                })

            } else {
                //进入这里说明是文件夹,那就返回文件目录
                //先判断有没有首页,如果有首页直接读取首页
                if(files.indexOf('index.html')!=-1) {
                    //进入这里说明有首页
                    fs.readFile(path.join(filePath,'index.html'),(err,data)=>{
                        if(err){

                        } else {
                            response.end(data);
                        }
                    })
                } else {
                    //没有首页
                    let backData = '';
                    for(let i = 0;i < files.length; i++) {
                        //默认拼接的都是./ 只能访问根目录
                        //根据请求的url 进行判断 拼接上一级目录的地址
                        backData += `<h2><a href="${request.url=='/'?'':request.url}/${files[i]}">${files[i]}</a></h2>`
                    }
                    // console.log(files);
                    response.writeHead(200,{
                        'content-type': 'text/html;charset=utf-8'
                    });
                    response.end(backData);
                }
            }
        })

    } else {
        //如果文件不存在,提示用户并改变状态
        response.writeHead(404,{
            'content-type':'text/html;charset=utf-8'
        })
        response.end(`<h2>not found 404</h2>`);
    }




}).listen(80,'127.0.0.1',()=>{
    console.log('开启监听');
})