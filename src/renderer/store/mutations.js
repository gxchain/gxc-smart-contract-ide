const mutations = {}

mutations.UPDATE_CURRENT_CHAIN_ID = (state, chainId) => {
    state.curChainId = chainId
}

mutations.APPEND_WALLET = (state, wallet) => {
    state.wallets.push(Object.assign({
        account: ''
    }, wallet))
}

mutations.REMOVE_WALLET = (state, account) => {
    var idx = -1

    state.wallets.find((wallet, i) => {
        if (wallet.account === account) {
            idx = i
            return true
        }
    })

    state.wallets.splice(idx, 1)
}

mutations.CHANGE_WALLET = (state, account) => {
    var flag = false
    state.wallets.find((wallet) => {
        if (wallet.account === account) {
            state.currentWallet = wallet
            flag = true
        }
    })
    if (!flag) {
        state.currentWallet = {}
    }
}

mutations.UPDATE_BALANCES = (state, balances) => {
    state.balances = balances
}

mutations.UPDATE_ASSETS = (state, assets) => {
    state.assets = assets
}

mutations.CHANGE_CURRENT_APISERVER_STATUS = (state, status) => {
    state.currentApiServerStatus = status
}

mutations.UPDATE_API_SERVERS_LATENCY = (state, latencies) => {
    state.apiServers.forEach((node) => {
        const latency = latencies[node.url]
        if (!!latency) {
            node.latency = latency
        }
    })
}

mutations.CHANGE_CURRENT_API_SERVER = (state, currentApiServer) => {
    state.currentApiServer = currentApiServer
}

mutations.UPDATE_API_SERVER_CHAIN_ID = (state, {url, chainId}) => {
    const node = state.apiServers.find(node => node.url === url)
    node.chainId = chainId
}

mutations.ADD_API_SERVER = (state, {url}) => {
    state.apiServers.push({
        url,
        location: '',
        latency: '?',
        chainId: ''
    })
}

mutations.REMOVE_API_SERVER = (state, url) => {
    var idx = -1

    state.apiServers.find((node, i) => {
        if (node.url === url) {
            idx = i
            return true
        }
    })

    state.apiServers.splice(idx, 1)
}

mutations.CHANGE_CURRENT_COMPILE_SERVER = (state, currentCompileServer) => {
    state.currentCompileServer = currentCompileServer
}

mutations.ADD_COMPILE_SERVER = (state, url) => {
    state.compileServers.push({
        url: url
    })
}

mutations.REMOVE_COMPILE_SERVER = (state, url) => {
    var idx = -1

    state.compileServers.find((node, i) => {
        if (node.url === url) {
            idx = i
            return true
        }
    })

    state.compileServers.splice(idx, 1)
}

export default mutations
