import {Apis, Manager} from 'gxbjs-ws'
import store from '@/store'
// import Vue from 'vue'

// let tempVue = new Vue()

let connect = function (callback = function () {
}, witnesses) {
    witnesses = store.state.apiServers.map((node) => {
        return node.url
    })
    const connectionManager = new Manager({url: store.state.currentApiServer.url, urls: witnesses})
    connectionManager.connectWithFallback(true).then((resp) => {
        callback(resp)
    })
    return connectionManager
}

let reconnect = function () {
    connect()
}

// websocket 状态处理
// 如果处于'error'的连接状态，过一段时间会自动调用回调
Apis.setRpcConnectionStatusCallback(function (status) {
    console.log('Witness status:', status)
    store.commit('CHANGE_CURRENT_APISERVER_STATUS', status)

    // TODO solve multi trigger bug
    // if (status == 'open') {
    //     tempVue.$eventBus.$emit('connect:open')
    // }
    // if (status == 'error') {
    //     tempVue.$eventBus.$emit('connect:error')
    // }
    //
    // if (status === 'closed') {
    //     tempVue.$eventBus.$emit('connect:closed')
    // }
})

export {
    connect,
    reconnect
}
