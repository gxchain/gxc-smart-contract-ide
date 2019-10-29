import '@/storage/'
import Vue from 'vue'
import App from './App'

import axios from 'axios'
import router from './router'
import store from './store'
import locales from '@/locales'
import filters from '@/filters'
import iviewLocales from 'iview/dist/locale/en-US'
import {connect} from './services/connect'
import {webFrame} from 'electron'
import logUtil from '@/util/logUtil'
import preventDragMixin from '@/mixin'

import iView from 'iview'

import '@/assets/icons' // alibaba icon-font
import 'iview/dist/styles/iview.css'
import '@styles/base.scss'
import '@styles/entryAnimation.scss'

import eventBus from '@/plugins/eventBus'

import TreeView from 'vue-json-tree-view'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$logUtil = logUtil

var iviewOptions = {}
if (localStorage.getItem('lang') === 'en-US') {
    iviewOptions.locale = iviewLocales
}

Vue.use(iView, iviewOptions)
Vue.use(TreeView)
Vue.use(eventBus)
Vue.mixin({filters})
Vue.mixin(preventDragMixin)

/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    i18n: locales,
    template: '<App/>'
}).$mount('#app')

// disable pinch
webFrame.setVisualZoomLevelLimits(1, 1)
webFrame.setLayoutZoomLevelLimits(0, 0)

// build rpc connection
connect(() => {
    store.dispatch('updateApiServers')
    store.dispatch('updateCurrentBalancesAndAssets')
})
