const TESTNET_CHAIN_ID = 'c2af30ef9340ff81fd61654295e98a1ff04b23189748f86727d0b26b40bb0ff4'
const ONLINE_CHAIN_ID = '4f7d07969c446f8342033acb3ab2ae5044cbe0fde93db02de75bd17fa8fd84b8'

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
    state.curChainId = TESTNET_CHAIN_ID
    state.apiServers.push({
        url: 'wss://testnet.gxchain.org',
        location: '',
        latency: '?',
        chainId: TESTNET_CHAIN_ID
    })
    state.compileServers.push({
        url: 'http://192.168.1.118:3000'
    })
} else {
    state.curChainId = ONLINE_CHAIN_ID
    state.apiServers = [{
        url: 'wss://node1.gxb.io',
        location: '',
        latency: '?',
        chainId: ONLINE_CHAIN_ID
    }, {
        url: 'wss://testnet.gxchain.org',
        location: '',
        latency: '?',
        chainId: TESTNET_CHAIN_ID
    }]
    state.compileServers.push({
        url: 'https://testnet.gxx.gxchain.org'
    })
}

state.currentApiServer = state.apiServers[0]
state.currentCompileServer = state.compileServers[0]

export default state
