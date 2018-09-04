import Vue from 'vue'
import Vuex from 'vuex'
import state from './state.js'
import mutations from './mutations.js'
import getters from './getters.js'
import actions from './actions.js'
import modules from './modules'
import createPersistedState from 'vuex-persistedstate/index'
import ElectronStore from 'electron-store'
import isElectron from 'is-electron'

Vue.use(Vuex)

const STORAGE_KEY = 'vuex'
const electronStore = new ElectronStore()
let presistPlugin

if (isElectron()) {
    presistPlugin = createPersistedState({
        key: STORAGE_KEY,
        storage: {
            getItem: key => electronStore.get(key),
            setItem: (key, value) => {
                electronStore.set(key, value)
            },
            removeItem: key => electronStore.delete(key)
        }
    })
} else {
    presistPlugin = createPersistedState({
        key: STORAGE_KEY
    })
}
export const storage = isElectron() ? electronStore : localStorage

const store = new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    plugins: [presistPlugin],
    modules,
    strict: process.env.NODE_ENV !== 'production'
})

for (let key in modules) {
    modules[key].afterInit && modules[key].afterInit(store)
}

export default store
