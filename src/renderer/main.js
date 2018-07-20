import Vue from 'vue'
import axios from 'axios'

import router from './router'
import store from './store'
import locales from '@/locales'
import '@/assets/icons'
import {connect} from './services/connect'

import App from './App'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '@/assets/scss/base.scss'

import eventBus from '@/plugins/eventBus'

import TreeView from 'vue-json-tree-view'

// 建立rpc连接
store.dispatch('updateApiServers').then(() => {
    connect(() => {
        store.dispatch('updateCurrentBalancesAndAssets')
    })
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(iView)
Vue.use(TreeView)
Vue.use(eventBus)

/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    i18n: locales,
    template: '<App/>'
}).$mount('#app')
