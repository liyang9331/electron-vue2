const kJexamineData = [
    {
        testName: '空间要素缺失',
        testExplain: '检验资产是否缺失必要的空间定位信息，或空间要素类型不合规',
        configParams: '',
        computationalFunction: 'spatialPart',
        computationalData: 'spatialPartData',
        type: 1
    },
    {
        testName: '管线长度检验',
        testExplain: '检验管网中的全部管线是否都处在合规的长度区间内，不短于最小长度，也不长于最大长度',
        configParams: '2',
        configParamsInfor: [
            {
                key: '管线长度最大值（单位：米）',
                value: 'maxNum'
            },
            {
                key: '管线长度最小值（单位：米）',
                value: 'minNum'
            }
        ],
        computationalFunction: 'lengthInspection',
        computationalData: 'lengthInspectionData',
        type: 1
    },
    {
        testName: '管线碰撞',
        testExplain: '检验管网中是否有管线发生地理位置上的交叉',
        configParams: '',
        computationalFunction: 'intersectCheck',
        computationalData: 'intersectData',
        type: 1
    },
]

const gWexamineData = [
    {
        testName: '未连接的井点',
        testExplain: '检验管网中是否有井点（或其他端点设施如排口）未连接任何管道',
        configParams: '',
        computationalFunction: 'notConnectedPoint',
        computationalData: 'notConnectedPointData',
        type: 2
    },
    {
        testName: '多点坐标重合或过近',
        testExplain: '检验管网中是否有井点或排口等点位设施地理位置重合（或距离过近）',
        configParams: '',
        computationalFunction: 'coincidence',
        computationalData: 'coincidenceData',
        type: 2
    },
    {
        testName: '未连接井的管线',
        testExplain: '检验管网中是否有管线未连接任何端点设施',
        configParams: '',
        computationalFunction: 'notConnectedLine',
        computationalData: 'notConnectedLineData',
        type: 2
    },
    {
        testName: '管坐标与所连井坐标不一致',
        testExplain: '管自身的起止点坐标与两端端点设施自身的坐标不一致',
        configParams: '1',
        configParamsInfor: [
            {
                key: '端点之间的误差范围（单位：米）',
                value: 'misTake'
            }
        ],
        computationalFunction: 'inconsistentCoordinates',
        computationalData: 'inconsistentCoordinatesData',
        type: 2
    },
    {
        testName: '两井之间有多条管',
        testExplain: '两端点之间有多条管道连接，即多条管道的起止端点一致',
        configParams: '',
        computationalFunction: 'multipleTubes',
        computationalData: 'multipleTubesData',
        type: 2
    },
]

const gWHJexamineData = [
    {
        testName: '井是否同时连接雨水管、污水管',
        testExplain: '管网中是否有雨水管、污水管同时连接到同一井点',
        configParams: '',
        computationalFunction: 'collision',
        computationalData: 'collisionData',
        type: 3
    },
    // {
    //     testName: '管线反向',
    //     testExplain: '管线反向说明：',
    //     configParams: '',
    //     computationalFunction: 'pipelineReverse',
    //     computationalData: 'pipelineReverseData',
    //     type: 3
    // },
    {
        testName: '管线逆坡',
        testExplain: '',
        configParams: '1',
        configParamsInfor: [
            {
                key: '管线逆坡程度（单位：米）',
                value: 'adverseSlope'
            }
        ],
        computationalFunction: 'pipelineAdverseSlope',
        computationalData: 'pipelineAdverseSlopeData',
        type: 3
    }
]

const gKJGXSCData = [
    {
        testName: '空间关系生成',
        testExplain: '管点管线空间关系生成',
        configParams: '',
        computationalFunction: 'generateRelationship',
        computationalData: 'generateRelationshipData',
        type: 4
    }, {
        testName: '空间坐标转换',
        testExplain: '所选坐标系转换为4326/4490',
        configParams: '',
        computationalFunction: 'epsgTransform',
        computationalData: 'epsgTransformData',
        type: 4,
        //已经在开始出完成处理  需要配置字典表数据
        // configParamsInfor: [
        //     {
        //         key: 'x偏移',
        //         value: 'dist_x'
        //     }, {
        //         key: 'y偏移',
        //         value: 'dist_y'
        //     }
        // ],
    }
]
// 数据规格检验
const dataSpecificationVerification = [
    {
        testName: '选项合规检验',
        testExplain: '检验资产选项是否合规',
        configParams: '',
        computationalFunction: 'dataSpecificationVerification',
        computationalData: 'dataSpecificationVerificationData',
        type: 5
    },
]



const testTypeObj = {
    1: '空间要素检验',
    2: '管网拓扑检验',
    3: '管网混接检验',
    4: '空间数据处理',
    5: "数据规格检验",
}


const fieldPointList = [
    {
        name: "X坐标",
        key: "xCoordinate",
        required: true,
    },
    {
        name: "Y坐标",
        key: "yCoordinate",
        required: true,
    },
    {
        name: "标识码",
        key: "assetsId",
        required: true,
    },
    {
        name: "高程",
        key: "altitude",
        required: false,
    },
    {
        name: "占地面积",
        key: "areaCovered",
        required: false,
    },
    {
        name: "长度",
        key: "extent",
        required: false,
    },
    {
        name: "型号",
        key: "model",
        required: false,
    },

]


const fieldLineList = [
    {
        name: "起始X坐标",
        key: "xCoordinate",
        required: true,
    },
    {
        name: "起始Y坐标",
        key: "yCoordinate",
        required: true,
    },
    {
        name: "终止X坐标",
        key: "xCoordinate2",
        required: true,
    },
    {
        name: "终止Y坐标",
        key: "yCoordinate2",
        required: true,
    },
    {
        name: "起始节点标识码",
        key: "assetsId",
        required: true,
    },
    {
        name: "终止节点标识码",
        key: "assetsId2",
        required: true,
    },
    {
        name: "高程",
        key: "altitude",
        required: false,
    },
    {
        name: "占地面积",
        key: "areaCovered",
        required: false,
    },
    {
        name: "长度",
        key: "extent",
        required: false,
    },
    {
        name: "型号",
        key: "model",
        required: false,
    },

]

// 数据的选项类型
const dataOptionType = {
    "设施状态": ["在建", "已建", "运营", "待废", "已废", "其他"],
    "所处位置": ["机动车道", "非机动车道", "人行道", "绿化带", "停车区", "河道", "街巷", "建筑小区", "公园广场", "农耕区域", "其他"],
    "地区类型": ["快速路、中心商业、附近具有甲类民用建筑工程的区域", "交通干道、附近具有乙类民用建筑工程的区域", "次干路、附近具有丙类民用建筑工程的区域", "支路", "乡间小路、废弃道路", "所有其他区域"],
    "管渠类型": ["干管", "支管", "连接管"],
    "特殊管渠类型": ["非特殊管渠", "倒虹管", "盖板沟", "明渠", "其他，并注明"],
    "排水管网敷设形式": ["地下埋管", "驳岸挂管", "河道内顺河敷设", "河道内跨河敷设", "其他，并注明"],
    "管渠断面形状": ["圆形", "梯形", "三角形", "椭圆形", "矩形", "马蹄形", "其他，并注明"],
    "管渠材质": ["混凝土管", "钢筋混凝土管", "砖石管", "陶土管", "PE（聚乙烯）管", "HDPE（高密度聚乙烯）管", "UPVC管", "球墨铸铁管", "玻璃钢夹砂管", "钢管", "镀锌钢管", "石棉水泥管", "其他，并注明"],
    "管渠衬里材质": ["水泥砂浆", "环氧树脂", "PE", "PVC", "不锈钢", "其他，并注明"],
    "接头型式": ["平口", "企口", "承插口", "焊接", "T型", "其他，并注明"],
    "连接方式": ["刚性", "柔性", "热熔连接", "其他，并注明"],
    "敷设方式": ["开槽埋管", "顶管", "盾构", "自承式平直形架空", "沉管施工弹性敷设法", "其他，并注明"],
    "土质": ["粉砂层", "湿陷性黄土IV级", "湿陷性黄土III级", "湿陷性黄土I级或II级", "强膨胀土", "中膨胀土", "弱膨胀土", "淤泥", "淤泥质土", "红粘土", "一般土层"],
    "排水系统类型": ["雨水", "污水", "合流", "其他，并注明"],
    "池（井）体横向截面形状": ["圆形", "矩形", "多边形", "其他，并注明"],
    "主体材质": ["玻璃钢", "碳钢", "混凝土", "钢筋混凝土", "沥青混凝土", "砖砌", "石砌", "PE", "HDPE", "PP", "PVC-U", "其他，并注明"],
    "检查井类型": ["检查井", "接户井", "溢流井", "倒虹井", "检测井", "跌水井", "透气井", "压力井", "阀门井", "拍门井", "水封井", "截流井", "其他，并注明"],
    "管理归属": ["市政", "户线", "其他，并注明"],
    "检查井等级": ["主井", "附井", "其他"],
    "连通形式": ["一通", "二通直", "二通转", "三通", "四通", "五通", "五通以上"],
    "检查井结构形式": ["成品", "非成品"],
    "井底形式": ["平底", "流槽", "落底", "其他"],
    "井盖/盖板形状": ["圆形", "矩形", "三角形", "其他，并注明"],
    "井盖/盖板材质": ["灰口铸铁", "球墨铸铁", "铸钢", "轧制钢", "聚合物", "填充增强材料", "钢纤维混凝土", "碳钢", "其他"],
    "是否为重型井盖": ["否", "是，并在技术信息中注明载重负荷（kN）"],
    "是否为双层井盖": ["否", "是"],
    "是否为智能井盖": ["否", "是"],
    "是否装备链条或锁具": ["否", "是"],
    "舱室数量": ["1个", "2个"],
    "排水口类型": ["污水直排口", "雨水直排口", "混接雨水直排口", "混接截流溢流排水口", "合流直排口", "合流截留溢流排水口", "泵站排水口", "居民排水口", "应急排水口", "排污企业排水口", "污水处理厂排放口", "水产养殖排放口", "其他，并注明"],
    "排水口位置": ["左岸", "右岸", "其他，并注明"],
    "排水口形式": ["排水管", "排水箱涵", "排水渠", "其他，并注明"],
    "出流形式": ["自由出流", "常水位淹没", "常水位半淹没", "潮汐影响"],
    "挡墙形式": ["重力式", "衡重式", "悬臂式", "扶壁式", "其他，并注明"],
    "雨水口型式": ["平篦式", "立篦式", "联合式", "偏沟式", "其他，并注明"],
    "雨水篦材质": ["球墨铸铁", "灰口铸铁", "钢格板", "其他，并注明"],
    "截面形状": ["矩形", "圆形", "拱形", "其他，并注明"],
    "输送介质": ["市政供水", "再生水", "河湖水", "地下水", "其他，并注明"],
    "给水管网敷设形式": ["明敷", "暗管", "架空", "其他，并注明"],
    "管渠基础": ["混凝土", "天然弧形", "砂基础", "其他，并注明"],
    "外防腐材质": ["熔结环氧粉末", "挤压聚乙烯", "聚乙烯胶带及煤焦油瓷漆", "高分子涂料", "沥青防腐漆", "其他，并注明"],
    "排气阀类型": ["单口", "双口"],
    "给水用途": ["农业灌溉", "公共供水", "工业", "服务业", "河道补水", "其他，并注明"],
    "是否热水管": ["否", "是"],
    "消防给水压力类型": ["高压", "临时高压", "低压"],
    "阀门井操作形式": ["地面操作式", "井下操作式"],
    "是否有阀门套筒": ["否", "是"],
    "消防井类别": ["地下消防井", "楼房消防井", "其他"],
    "取水口布置形式": ["沉井式", "重力箱式", "复合式", "悬臂式", "底槽式", "其他，并注明"],
    "水源井深度等级": ["浅井", "中深井", "深井", "超深井"],
    "水源井抽水形式": ["自流井", "深机井", "下卧机井", "真空井", "其他，并注明"],
    "排泥方式": ["自流", "泵抽", "人工清理", "其他，并注明"],
    "结构安全等级": ["一级", "二级", "三级"],
    "耐火等级": ["6度", "7度", "8度", "9度", "不设防"],
    "抗震设防烈度": ["一级", "二级", "三级", "四级"],
    "防水等级": ["I级", "II级", "III级", "IV级"],

}


export {
    kJexamineData,
    gWexamineData,
    gWHJexamineData,
    gKJGXSCData,
    fieldLineList,
    fieldPointList,
    testTypeObj,
    dataSpecificationVerification,
    dataOptionType
}
