
const state = {
    pointArrData: [],
    lineArrData: [],
    shpData: []
}

const mutations = {
    changePoint: (state, pointArr) => {
        state.pointArrData = pointArr
    },
    changeLine: (state, lineArr) => {
        state.lineArrData = lineArr
    },
    changeShp: (state, shp)=> {
        state.shpData = shp
    }
}

const actions = {
    toggleDevice({ commit }, device) {
        commit('TOGGLE_DEVICE', device)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
