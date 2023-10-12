
const state = {
    inspectionRecordList: [], // 检验记录数据
}

const mutations = {
    /**
     * 为state项赋值
     * @param state
     * @param data
     */
    setStateItem(state, data) {
        state[data.key] = data.value;
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
