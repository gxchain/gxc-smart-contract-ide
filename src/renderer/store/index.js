import Vue from 'vue'
import Vuex from 'vuex'
import state from './state.js'
import mutations from './mutations.js'
import getters from './getters.js'
import actions from './actions.js'
import modules from './modules'
import createPersistedState from 'vuex-persistedstate/index'

Vue.use(Vuex)

const store = new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    plugins: [createPersistedState()],
    modules,
    strict: process.env.NODE_ENV !== 'production'
})

for (let key in modules) {
    modules[key].afterInit && modules[key].afterInit(store)
}

export default store
