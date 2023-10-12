import {ipcMain, ipcRenderer} from "electron";
import {SaveImageToDb} from "@/js/SaveImageToDbExe";
const log = require('electron-log')

class DbEvent{
    constructor(win) {
        this.init()
    }
    init(){
        let that =this
        ipcMain.on('startInitData',(event,value )=> {
            let data=JSON.parse(value)
            let saveImageToDb =new SaveImageToDb(data);
            saveImageToDb.setCallbask(function(obj){
                that.callbackText(that,obj)
            })
            saveImageToDb.init();
        })
    }
    setCallbakcFunc(func1){
        this.callback=func1
    }
    callbackText(that,obj){
        log.warn(obj.toString())
         if(that.callback){
            that.callback(obj)
        }
    }
}
export {DbEvent}
