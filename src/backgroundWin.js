'use strict'

import {app, protocol, BrowserWindow, Menu, dialog, ipcMain, Tray} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

const { autoUpdater } = require('electron-updater')
const path = require('path')
const log = require('electron-log')
const isDevelopment = process.env.NODE_ENV !== 'production'
const fs = require('fs')
var packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')))

// 设置当前应用程序的名字
// 注意： 此函数会覆盖Electron内部使用的名称；它不会影响操作系统使用的名称。
app.setName(packageJSON.appName)
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true }}
])

log.info('启用日志')

const appPath = app.getAppPath()
var rootPath = ''
if (process.env.WEBPACK_DEV_SERVER_URL) {
  // 开发模式中的
  rootPath = path.join(appPath, '../')
} else {
  rootPath = path.dirname(app.getPath('exe'))
}
function createWindow() {
  Menu.setApplicationMenu(null)
  // Create the browser window.
  win = new BrowserWindow({
    width: 1400,
    height: 800,
    minHeight: 700,
    minWidth: 900,
    show: false, // 先不显示
    backgroundColor: '#2e2c29',
    // icon: new Tray(path.join(rootPath, '/icons/icon.ico')),
    // 隐藏标题栏
    // titleBarStyle: 'hidden',
    // 无边框
    // frame: false,
    // 叠加一层按钮（包含最小化、最大化、关机按钮），为true时是显示，为对象时可以控制字体颜色
    // titleBarOverlay: true,
    // titleBarOverlay: {
    //   color: '#f90',
    //   symbolColor: '#fff'
    // },
    webPreferences: {
      contextIsolation: false,
      enableRemoteModule: true, // 取消 Remote 模块警告
      // 禁用同源策略,跨域http请求
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      // 启用 Chromium 的实验功能。 默认值为 false.
      experimentalFeatures: false
      // enableBlinkFeatures: String(可选) - 以逗号分隔的需要启用的特性列表，譬如CSSVariables,KeyboardEventKey 在 https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/renderer/platform/runtime_enabled_features.json5;l=70文件中查看被支持的所有特性.
      // enableBlinkFeatures: "CSSVariables,KeyboardEventKey"
      // disableBlinkFeatures: String (可选) - 以 ,分隔的禁用特性列表, 如 CSSVariables,KeyboardEventKey. 在https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/renderer/platform/runtime_enabled_features.json5;l=70 文件中查看被支持的所有特性.
    }
  })
  require('@electron/remote/main').initialize()
  require('@electron/remote/main').enable(win.webContents)

  // 开发者工具
  // win.webContents.openDevTools()
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    autoUpdater.checkForUpdates()

    // autoUpdater.checkForUpdatesAndNotify()
  }
  //目前在软件开发调试中 都打开开发者测试工具 ，等系统稳定之后发布时去掉该部分
  // win.webContents.openDevTools()
  win.on('ready-to-show', () => {
    // 等初始化完成后再显示
    win.maximize()
    win.show()
  })

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async() => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}


//通过事件修改数据信息
ipcMain.on('changTitleData',(event,data )=> {
//title 需要是字符串数据
  win.setTitle(data.toString())
})




//提供一个监听打开 文件夹选择
ipcMain.on('openDialog',(event,data )=> {
  dialog.showOpenDialog({
    properties: ['openDirectory'],
  }).then(result => {
    // console.log(result);        //输出结果
    // result.filePaths.length > 0 && ipcRenderer.send(result.filePaths);
    //打开后把对应的消息传递给 vue操作页面
    result.type=data.type
    event.sender.send('selectedItem', result)
  })
})




//提供一个监听打开 文件夹选择
ipcMain.on('openSelectFile',(event,data )=> {
  dialog.showOpenDialog().then(result => {
    // console.log(result);        //输出结果
    // result.filePaths.length > 0 && ipcRenderer.send(result.filePaths);
    //打开后把对应的消息传递给 vue操作页面
    result.type=data.type
    event.sender.send('openSelectFileSelect', result)
  })
})



// 重启应用
ipcMain.on('relaunch_app', (event, arg) => {
  // console.log(arg) // prints "ping"
  app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
  app.exit(0)
  // event.reply('asynchronous-reply', 'pong')
})

// ======================================================================
// 更新模块
// ======================================================================
if (!process.env.WEBPACK_DEV_SERVER_URL) {
  autoUpdater.autoDownload = false

  autoUpdater.signals.updateDownloaded(() => {})
  autoUpdater.on('error', (error) => {
    log.warn('检查更新失败: ' + error == null ? 'unknown' : (error.stack || error).toString())
    // dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString())
  })

  autoUpdater.on('update-available', (info) => {
    log.warn(info)
    // var appInfo = {
    //   info: info.version,
    //   files: info.files,
    //   path: info.path,
    //   sha512: info.sha512,
    //   releaseDate: info.releaseDate
    // }
    dialog.showMessageBox({
      type: 'info',
      title: '更新提示',
      message: '软件需要更新，您是否立即更新？',
      buttons: ['推迟', '立即更新']
    }).then((res) => {
      log.warn('index:' + res.response)
      if (res.response === 1) {
        log.warn('选择升级')
        autoUpdater.downloadUpdate()
      } else {
        log.warn('选择不升级:')
      }
    })
  })

  // 检查更新时触发
  autoUpdater.on('update-available', (res) => {
    log.warn('检查更新时触发')
    log.warn(res)
    // dialog.showMessageBox({
    //   title: '检查更新',
    //   message: '正在检查更新'
    // })
  })

  // 没有可用更新
  autoUpdater.on('update-not-available', () => {
    log.warn('没有可用更新')
    // dialog.showMessageBox({
    //   title: '已是最新版',
    //   message: '当前版本是最新版本。'
    // })
  })

  // 安装更新
  autoUpdater.on('update-downloaded', (res) => {
    log.warn(res)
    log.warn('下载完毕！提示安装更新')
    dialog.showMessageBox({
      title: '升级提示！',
      message: '已自动升级为最新版，请重启应用！'
    }, () => {
      log.warn('确认安装')
      setImmediate(() => autoUpdater.quitAndInstall(true, true))
    })
  })

  // 下载进度
  // autoUpdater.on('download-progress', (event) => {
  //   dialog.showMessageBox({
  //     title: '安装更新',
  //     message: event.percent
  //   })
  // })
}
