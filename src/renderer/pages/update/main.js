import Vue from 'vue'
import axios from 'axios'
import {webFrame} from 'electron'

import App from './App'

// disable pinch
webFrame.setVisualZoomLevelLimits(1, 1)
webFrame.setLayoutZoomLevelLimits(0, 0)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    components: {App},
    template: '<App/>'
}).$mount('#app')
