import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import connect from './services/connect'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

// import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

import TreeView from 'vue-json-tree-view'
// import CopyBtn from '@/components/common/CopyBtn.vue'

// 建立rpc连接
connect()

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(iView)
Vue.use(TreeView)
// Vue.use(VueCodemirror)

/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    template: '<App/>'
}).$mount('#app')

console.log('currentwalllll', store.state.currentWallet)
