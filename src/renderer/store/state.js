const state = {
    lang: 'en-US',
    wallets: [],
    currentWallet: {},
    balances: [],
    assets: [],
    apiServers: [{
        url: 'ws://192.168.1.126:28099',
        location: '',
        latency: 0
    }],
    currentApiServer: {},
    compileServers: [{
        url: 'http://192.168.1.118:3000/upload'
    }],
    currentCompileServer: {}
}

state.currentApiServer = state.apiServers[0]
state.currentCompileServer = state.compileServers[0]

export default state
