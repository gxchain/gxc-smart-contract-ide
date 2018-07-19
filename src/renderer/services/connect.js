import {Apis, Manager} from 'gxbjs-ws'
import store from '@/store'
import Vue from 'vue'
// import va from '@/util/vue-agency'

let errCount = 0
let tempVue = new Vue()

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
    Apis.reset(store.state.currentApiServer.url, true)
}

// websocket 状态处理
// 如果处于'error'的连接状态，过一段时间会自动调用回调
Apis.setRpcConnectionStatusCallback(function (status) {
    console.log('Witness status:', status)

    if (status == 'open') {
        errCount = 0
        tempVue.$eventBus.$emit('connect:open')
    }

    if (status == 'error') { // 出错重连
        errCount++
        if (errCount <= 1) {
            tempVue.$eventBus.$emit('connect:error')
            reconnect()
        } else {
            tempVue.$eventBus.$emit('connect:reconnectFail')
        }
    }
    if (status === 'closed') {
        tempVue.$eventBus.$emit('connect:closed')
    }
})

export {
    connect,
    reconnect
}
