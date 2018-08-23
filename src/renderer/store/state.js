const state = {
    wallets: [],
    currentWallet: {},
    balances: [],
    assets: [],
    apiServers: [],
    currentApiServer: {},
    currentApiServerStatus: 'closed',
    compileServers: [],
    currentCompileServer: {}
}

if (process.env.NODE_ENV === 'development') {
    state.apiServers.push({
        url: 'ws://192.168.1.118:28090',
        location: '',
        latency: '?'
    })
    state.compileServers.push({
        url: 'http://192.168.1.118:3000'
    })
} else {
    state.apiServers.push({
        url: 'wss://testnet.gxchain.org',
        location: '',
        latency: '?'
    })
    state.compileServers.push({
        url: 'https://testnet.gxx.gxchain.org'
    })
}

state.currentApiServer = state.apiServers[0]
state.currentCompileServer = state.compileServers[0]

export default state
