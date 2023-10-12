import Vue from 'vue';
import Vuex from "vuex"
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import tagsView from './modules/tagsView'
import check from './modules/check'
import fileUpload from './modules/fileUpload'
import dataInspection from './modules/dataInspection'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    tagsView,
    check,
    fileUpload,
    dataInspection
  },
  getters
})

export default store
