const path = require('path')
const fs = require('fs')

function resolve (dir) {
    return path.join(__dirname, dir)
}

const packageData = fs.readFileSync(resolve('package.json'))
var packageJSON = JSON.parse(packageData)
module.exports = {
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "./src/assets/css/common.scss";`
            }
        }
    },
    lintOnSave: false,
    chainWebpack (config) {
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        // worker   配置
        config.module.rule("worker").test(/\.worker\.js$/)
            .use("worker-loader")
            .loader("worker-loader")
            .options({ filename: 'WorkerName.[hash].js', esModule: true, })
            .end();

        //加上几下参数 打包之后报错
        // config.output.globalObject('this');
        config.module.rule('js').exclude.add(/\.worker\.js$/);

    },
    pluginOptions: {
        electronBuilder: {
            chainWebpackMainProcess: (config) => {
                config.output.filename((file) => {
                    if (file.chunk.name === 'index') {
                        return 'background.js';
                    } else {
                        return '[name].js';
                    }
                });
            },
            parallel: false,  // worker  配置打包时报错
            // 预加载文件
            preload: 'src/preload.js',
            // 渲染进程也可以获取原生node包
            nodeIntegration: true,
            // 打包配置
            builderOptions: {
                // 发布者名称
                productName: packageJSON.appName,
                // 包名
                appId: packageJSON.appId,
                // 版权信息
                copyright: packageJSON.copyright,
                // 更新app的服务器地址
                publish: [
                    {
                        provider: 'generic',
                        url: 'http://127.0.0.1/app/'
                    }
                ],
                asar: false,
                // 不需要打包至asar中的文件如数据库文件
                extraResources: [
                    {
                        from: './data/',
                        to: '../data/',
                        filter: ['**/*']
                    },
                    {
                        from: './icons/',
                        to: '../icons/',
                        filter: ['**/*']
                    }],
                win: {
                    // 图标文件大小为 256*256
                    icon: './icons/logo_win.ico',
                    target: [
                        {
                            target: 'nsis',
                            arch: [
                                'x64'
                                // 'ia32'
                            ]
                        }
                    ],

                    // 打包权限 asInvoker | highestAvailable
                    requestedExecutionLevel: 'highestAvailable'
                },
                mac: {
                    // 图标文件大小为 512*512
                    icon: "./icons/logo_mac.ico", //图标路径
                },
                // 安装包名称，可自行配置
                artifactName: packageJSON.appName + '_Setup_${version}_${platform}.${ext}',
                // artifactName: '${productName}_Setup_${version}_${platform}.${ext}',
                nsis: {
                    // 一键安装，如果设为true，nsis设置就无意义请直接删除 nsis 配置
                    oneClick: false,
                    // true全用户安装【目录为：C:\Program Files (x86)】，false安装到当前用户
                    perMachine: true,
                    // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
                    allowElevation: true,
                    // 允许修改安装目录
                    allowToChangeInstallationDirectory: true,
                    // 创建桌面图标
                    createDesktopShortcut: true,
                    // 创建开始菜单图标
                    createStartMenuShortcut: true,
                    // 快捷方式的名称,默认为应用程序名称
                    shortcutName: packageJSON.appName,
                    // 安装图标
                    installerIcon: './icons/install.ico',
                    // 卸载图标
                    uninstallerIcon: './icons/uninstall.ico',
                    // 安装时头部图标
                    installerHeaderIcon: './icons/logo_win.ico',
                    // 配置 nsn 如修改默认安装目录
                    include: './installer.nsh'
                }
            }
        }
    }
}