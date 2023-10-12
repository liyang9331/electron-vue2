

const getDefaultState = () => {
    return {
        dataList: [], // 管点数据
        fileInfor: {
            filePath: '',
            fileName: '',
            fileType: '',
            title_index: '',// 表头和数据的行数
            data_index: '',
            fieldDescription: {}, // 字段描述
            fileHeaderList: [], // 文件表头
            fileDataList: [], // 文件数据
            dataType: '', // 数据类型
        },
        uploadedFilesList: [], // 已上传的文件
        checkItemData: [], // 选中的需要检查的项
        testResultInfor: {}, // 检测完成的结果
        configAccident: {
            minNum: 0.1,
            maxNum: 300,
            //空间转换时候的偏移量 针对原始数据的

        }, // 配置最大最小值

        epsgTransform:{
            dist_x:0,
            dist_y:0,
        },
        pipeLineData: [], // 管线数据
        pipePointData: [], // 管点数据
        testResultShow: false, // 是否展示已经计算的列表
        gxxjList: [],
        shpData: []
    }
}
const state = getDefaultState()

const mutations = {
    /**
     * 为state项赋值
     * @param state
     * @param data
     */
    setStateItem(state, data) {
        state[data.key] = data.value;
    },
    resetState(state) {
        Object.assign(state, getDefaultState())
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
