import {Apis, Manager} from 'gxbjs-ws'
import store from '@/store/index'

// 先取store，再配置，再更新latency
// let witnesses = ['ws://192.168.1.126:28099', 'wss://node1.gxb.io', 'wss://node5.gxb.io', 'wss://node16.gxb.io'] // TODO 待配置

let connect = function (callback = function () {
}, witnesses) {
    witnesses = store.state.apiServers.map((node) => {
        return node.url
    })
    // witnesses = ['ws://192.168.1.126:28099', 'wss://node1.gxb.io', 'wss://node5.gxb.io', 'wss://node16.gxb.io']
    console.log(store.state.currentApiServer)
    const connectionManager = new Manager({url: store.state.currentApiServer.url, urls: witnesses})
    connectionManager.connectWithFallback(true).then((resp) => {
        callback(resp)
    })
    return connectionManager
}

// 当链接改变时重连，apis.reset()，然后connect
let reconnect = function (flag) {
    Apis.reset(store.state.currentApiServer.url, true)
}

// websocket 状态处理
Apis.setRpcConnectionStatusCallback(function (status) {
    console.log('Witness status:', status)

    if (status == 'error') { // 出错重连
        // TODO 该节点连不上，正在尝试重连
        reconnect()
        console.log('Connection failed,try another connection')
    }
})

export {
    connect,
    reconnect
}
