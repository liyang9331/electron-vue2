/**
 * Created by supervisor on 2021/03/15
 */
import {DbSaveData} from '@/js/dbSaveData.js'



const fs = require('fs')
const path = require('path')

class SaveImageToDb{
  constructor(data) {
    this.rowData=data
    this.dbpath;
    this.tableName="image"
    this.indexTable="indexTable"


    this.fileArr=[]
    this.threadIndex=1000;
    this.callbackFunc=null;
    this.saveIndex=0;
    this.indexDbPath;
    this.wjdq=0;
  }

  init(){
    this.saveIndex=0;
    this.fileArr=[];
    this.dbpath= this.rowData.savePath+"/"+this.rowData.dbname+".cpData"
    this.indexDbPath= this.rowData.savePath+"/"+this.rowData.dbname+".index"

    //判断文件是否存在 如果不存在则创建对应的数据库
    try {
      let exist =this.dbIsExist();
      if(exist){
        this.setCallbackData({open:false,data:""})
        return ;
      }
      this.dbServer=new DbSaveData(this.dbpath);
      //创建数据表
      this.dbServer.tableInit();

      //创建数据表 创建索引数据库
      this.dbIndexServer=new DbSaveData(this.indexDbPath);
      this.dbIndexServer.tableInitIndex();
      //读取图片文件
      this.getAllFilePath()
    }catch (e){
      // ElMessage.error(e.toString())
      this.closDb()
    }
  }


  //创建索引
  createIndex(){
    let that=this;
    let text="数据入库完成正在创建索引"
    this.setCallbackData({open:true,data:text})
    this.dbServer.createIndex().then((res) => {
      let text="数据库创建成功！"
      this.setCallbackData({open:false,data:text})
      that.closDb()
    }, (err) => {
      let text="创建索引失败，可通过数据库链接工具手动创建!"
      this.setCallbackData({open:false,data:text})
      // ElMessage.error('创建索引失败!'+err.toString())
    });
  }

  closDb(){
    if(this.dbServer){
      this.dbServer.close()
    }
    if(this.dbServer){
      this.dbIndexServer.close()
    }
    this.setCallbackData({open:false,data:""})
  }


  //判断数据库是否存在 如果不存在则新建一个db文件
  dbIsExist(){
    let that=this;
    var checkDir = fs.existsSync(this.dbpath);
    var indexCheckDir = fs.existsSync(this.indexDbPath);

    if(!checkDir&&!indexCheckDir){
      fs.open(that.dbpath, "w", function (err, fd) {
      });
      fs.open(that.indexDbPath, "w", function (err, fd) {
      });
      return false;
    }else{
      // ElMessage.error('文件已存在，请检查!')
      return true
    }
  }

  setCallbackData(data){
    if(this.callbackFunc){
      this.callbackFunc(data)
    }
  }

  //获取所有图片的路径
  getAllFilePath(){
    let that=this;
    let filepath=this.rowData.filePath
    //遍历文件需要时间 目前写的是一个异步的方法
    let text="正在遍历文件路径"
    this.setCallbackData({open:true,data:text})
    this.preParellDeep(filepath).then((res) => {
      that.readImageData();
    }, (err) => {
      // ElMessage.error("遍历文件失败!")
    });
    // setTimeout(function(){
    //
    // },10000)
  }

  readImageData(){
    //已经读取完所有文件的路径
    let that =this;
    let tempFileArr=[]
    let text="文件总数:"+this.fileArr.length
    this.setCallbackData({open:true,data:text})
    //显示提示框
    setTimeout(function(){
      for(let i=0;i<that.fileArr.length;i++){
        tempFileArr.push(that.fileArr[i])
        if(i% that.threadIndex ==0){
          //执行写入
          that.saveAllPic(tempFileArr)
          //写入完成 清除数组
          tempFileArr=[]
        }
        //把剩余的写入数据库
        if(i==(that.fileArr.length-1)&&tempFileArr.length!=0){
          that.saveAllPic(tempFileArr)
          //写入完成 清除数组
          tempFileArr=[]
        }
      }
    },500)

  }

  //启动10个现成来读取文件i+1
  getFileData(item,fileArr,indexArr) {
    return new Promise(function(resolve, reject) {
      // item是个path  获取xyz
      let z ,x,y;
      //zxy 投影数据
      let pathArr = item.split("\\");
      if(pathArr.length>3){
        y=pathArr[pathArr.length-1];
        let imageArr=y.split(".");
        y=imageArr[0];
        x=pathArr[pathArr.length-2];;
        z=pathArr[pathArr.length-3];;
      }
      var data = fs.readFileSync(item)
      let insertData=[z,x,y,data];
      fileArr.push(insertData)
      indexArr.push([z,x,y])
      resolve(true);
      //不能使用异步  同时打开的文件太多
      // fs.readFile(item, function (err, data) {
      //   if (err) {
      //   } else {
      //     let insertData=[z,x,y,data];
      //     fileArr.push(insertData)
      //     indexArr.push([z,x,y])
      //   }
      //   resolve(true);
      // });
    });
  }
  //async
  // 多线程上传
  saveAllPic(files) {
    let tempFiles=JSON.parse(JSON.stringify(files))
    let that=this;
    var tasks = [];
    var tempFilsArr=[]
    var indexArr=[]
    tempFiles.forEach(o => {
      tasks.push(that.getFileData(o,tempFilsArr,indexArr));
    });
    // Promise.all(tasks).then((res) => {
    this.wjdq+=tempFiles.length;
    let text="开始读文件:"+this.wjdq+"/"+this.fileArr.length
    this.setCallbackData({open:true,data:text})
    //开始执行写入
    this.insertDataPl(tempFilsArr)
    this.insertDataIndexPl(indexArr)
    // }, (err) => {
    // });
  }
  //遍历文件数据
  preParellDeep(dir) {
    let that=this



    return new Promise((resolve, reject) => {
      fs.stat(dir, function (err, statObj) {
        if (statObj.isFile()) {
          that.fileArr.push(dir)
          resolve(true)

        } else {
          fs.readdir(dir, function (err, dirs) {
            var tasks = [];
            dirs.map(item =>
                tasks.push( that.preParellDeep(path.join(dir, item)))
            )
            Promise.all(tasks).then((res) => {

              let text="正在遍历文件路径:"+that.fileArr.length;
              that.setCallbackData({open:true,data:text})

              resolve(true)
            }, (err) => {
              resolve(true)
            });
          })
        }
      })
    })
  }


  insertDataDb(insertData,fields,fieldsZWF){
    this.addMoreData(insertData)
  }

  insertDataPl(dataArr){
    let parmsurl=`INSERT INTO    ${this.tableName}(z,x,y,img) VALUES (?,?,?,?)`
    this.dbServer.insertWork(parmsurl,dataArr).then((res) => {
      this.saveIndex+=dataArr.length;
      let text="已存储:"+this.saveIndex+"/"+this.fileArr.length
      this.setCallbackData({open:true,data:text})
      if(this.saveIndex>=this.fileArr.length){
        //创建索引
        this.createIndex()
      }
      // dataArr=null
    }, (err) => {
      console.log(err, 1)
    });
  }

  insertDataIndexPl(dataArr){
    let parmsurl=`INSERT INTO    ${this.indexTable}(z,x,y) VALUES (?,?,?)`
    this.dbIndexServer.insertWork(parmsurl,dataArr).then((res) => {
      // dataArr=null
    }, (err) => {
      console.log(err, 1)
    });
  }
  setCallbask(callbackFunc){
    this.callbackFunc=callbackFunc
  }


}
export {SaveImageToDb}
