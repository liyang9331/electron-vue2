import settings from "@/store/modules/settings";

/**
 * Created by supervisor on 2021/03/15
 */
const http  = require('http');
// const httpServer = require('http-server')
var url = require( 'url' );
import store from "@/store/index";

const util = require('util');
const querystring = require('querystring');

class HttpServerLocal {
  constructor() {
    this.historyDbLink = null;
    this.getDbServer();
    this.initServer();
    this.titleType=store.getters.titleType;
    this.initParms()
  }
  //加密部分
  initParms(){
    this.encryptionArr= store.getters.encryptionArr;
    this.encryptionIndexArr=store.getters.encryptionValue;
  }

  initServer() {
    let that=this;
// 客户端IP地址
    http.createServer(function (req, res) {
      if(req.method === 'GET') {
        that.toGet(req, res);
      }else if(req.method === 'POST') {
        that.toPost(req, res);
      }

    }).listen(8089,function(){
      console.log('服务器启动成功，可以通过 http://127.0.0.1:8089/ 来进行访问')

    })
// 监听请求事件
//     server.on('request',function(req,res){
//       // 设置跨域权限
//       res.setHeader("Access-Control-Allow-Origin","*")
//       // res.setHeader("Access-Control-Allow-Private-Network",true)
//     })
    // server.listen(8089,function(){
    //   console.log('服务器启动成功，可以通过 http://127.0.0.1:8089/ 来进行访问')
    //
    // })
  }


  toGet(req, res){
    // let urlData = 'GET请求内容：\n' + util.inspect(url.parse(req.url));
    let urlData =  url.parse(req.url)
    let  pathname=urlData.pathname;
    let pathArr=pathname.split('/')
    this.gotoRouter(pathArr,req, res);
  }

  toPost(req, res){

  }
  //第一个是服务名称
  //目前都是get
  gotoRouter(pathArr,req, res){
    //服务名称
    //0是空串
    let serverName=pathArr[1];
    let dbOpenApi=this.historyDbLink[serverName]
    if(dbOpenApi){
      //服务存在
      let type=dbOpenApi.type;
      switch(type) {
        case  this.titleType.zxy:
          //zxy 格式瓦片数  目前只有zxy模式的
          this.getZxyTitle(dbOpenApi,pathArr,req, res)
          break;
        case  this.titleType.terrain:
          //zxy 格式瓦片数
          break;
        case  this.titleType.arcgis:
          //arcgis
          break;
        case  this.titleType.tduTile:
          //tduTile
          break;
        case  this.titleType.TMS:
          //TMS
          break;
        default:
          res.end();
          return ;
      }

    }else{
      res.end();
    }
  }




  getZxyTitle(dbOpenApi,pathArr,req, response){
    let length=pathArr.length
    let z=pathArr[length-3];
    let x=pathArr[length-2];
    let y=pathArr[length-1];
    let that=this
    let sqlStr = `select * from image where z=${z} and x=${x}  and y=${y} ;`
    if(dbOpenApi.fileIndexArr.length==1&&dbOpenApi.lastDb){
      //说明只有一个 则直接拿缓存的 一个来进行进行读取
      let startT=(new Date()).getTime()
      dbOpenApi.lastDb.selectOne(sqlStr).then((res) => {
        console.log((new Date()).getTime()-startT)
        if(res){
          this.getDataFile(response,res.img)
        }else{
          this.readErr(response)
        }
        console.log((new Date()).getTime()-startT)
        response.end();
      }, (err) => {
        console.log('error：', err)
        response.end();
      })
      // response.end();

    }else{
      //有多个
      //需要用key 来确定对应的数据库
      if(dbOpenApi.dbServerObj){
      }
      this.readErr(response)
    }
  }


  //数据加密  后续再加
  decrypt(dataArr){
    //j解密的时候 需要减去一些数据
    if(!this.encryptionArr||!this.encryptionIndexArr||!dataArr){
      return
    }
    let indexArr=this.encryptionArr
    for(let i=0;i<indexArr.length;i++){
      dataArr[indexArr[i]]= dataArr[indexArr[i]] - this.encryptionIndexArr[i];
    }
    return dataArr
  }

  readErr(response){
    response.writeHead(404, { 'Content-Type' : 'text/plain; charset=utf-8' });
    response.end();
  }

  //获取文件之后进行转换
  getDataFile(response,fileData){
    // 从文件系统中读取请求的文件内容
    // response.setHeader( 'content-type', {"png": "image/png","jpg": "image/jpeg"} )
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.writeHead(200, { 'Content-Type' :  'image/png;image/jpeg' });
    this.decrypt(fileData)
    response.write(fileData);
    response.end();
  }

  //初始化获取db 文件链接
  getDbServer() {
    let hostoryData = store.getters.historyDbLink
    this.historyDbLink = hostoryData

  }


  //更新数据库缓存数据
  updateDbServer() {
    let that=this;
    store.watch(
        (state) => state.settings.historyDbLink,
        (val) => {
          // console.log('CHANGE: ', val);
          that.historyDbLink = val
        }, {
          deep: true
        }
    );
  }

  getImageTitle() {


  }
}


export  {HttpServerLocal}
