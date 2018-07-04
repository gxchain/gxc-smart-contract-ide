import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'landing-page',
            component: require('@/components/LandingPage').default
        },
        {
            path: '/setting',
            name: 'setting-page',
            component: require('@/components/SettingPage').default,
            redirect: '/setting/import-recover',
            children: [{
                path: '/setting/import-recover',
                name: 'import-recover',
                component: require('@/components/SettingPage/ImportRecover').default
            }]
        }
    ]
})
