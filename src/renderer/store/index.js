console.log('store load')
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state.js'
import mutations from './mutations.js'
import getters from './getters.js'
import actions from './actions.js'
import modules from './modules'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    plugins: [createPersistedState()],
    modules,
    strict: process.env.NODE_ENV !== 'production'
})
