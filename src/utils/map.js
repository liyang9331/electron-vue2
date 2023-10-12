import * as maptalks from 'maptalks'



//一个图层只能有一个 map ，如果用静态对象来定义的话 第一次添加之后map就初始化到图层中 ，再次添加的时候 conigObj已经是被使用的 导致基础底图无法加载
function getMapConfig(){
    const conigObj = {
        center: [119.13776415835099, 33.48521865376525],
        zoom: 16,
        baseLayer:
            new maptalks.GroupTileLayer('base', [
                new maptalks.TileLayer('tdtbase', {
                    urlTemplate: 'http://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=32b1112891d9b5217de23abe5a353672',
                    subdomains: [1, 2, 3, 4, 5,6,7],
                }),
                new maptalks.TileLayer('tdtbz', {
                    'urlTemplate': 'http://t{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=32b1112891d9b5217de23abe5a353672',
                    subdomains: [1, 2, 3, 4, 5,6,7],
                })
            ])
        //     new maptalks.TileLayer("tile", {
        //     crossOrigin: "Anonymous",
        //     urlTemplate:
        //         "http://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=32b1112891d9b5217de23abe5a353672",
        //     subdomains: [1, 2, 3, 4, 5],
        // }),
    }
    return conigObj;

}






//跑出去的是一个静态对象   重复使用是 其内部结构属性会发生变化
export {
    getMapConfig
}
