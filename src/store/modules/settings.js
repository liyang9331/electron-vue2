
const state = {
  historyDbLink:{},
  titleType:{
    zxy:"zxy",
    terrain:"terrain",
    arcgis:"arcgis",
    tduTile:"tduTile",
    TMS:"TMS"
  },
  encryptionArr:[20 ,35 , 88 ,146 , 188 ,207 ],
  encryptionValue:[15,20,33,24,55,67 ],
  wpId:null
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
     if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },

  SET_WPID: (state, value) => {
    state.wpId = value
  },
  SET_HISTORYDBLINK: (state, value) => {
    state.historyDbLink = value
  },

  SET_ENCRYPTIONARR : (state, value) => {
    state.encryptionArr = value
  },

  SET_ENCRYPTION_VALUE : (state, value) => {
    state.encryptionValue = value
  }
}

const actions = {

  historyDbLinkSetting({ commit }, data) {
    commit('SET_HISTORYDBLINK', data)
  },

  encryptionArrSetting({ commit }, data) {
    commit('SET_ENCRYPTIONARR', data)
  },
  encryptionValueSetting({ commit }, data) {
    commit('encryptionValue', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

