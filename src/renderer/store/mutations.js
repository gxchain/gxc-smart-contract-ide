const mutations = {}

mutations.SET_LANG = (state, lang) => {
    state.lang = lang
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

mutations.SWITCH_CURRENT_WALLET = (state, wallet) => {
    state.currentWallet = wallet
}

mutations.UPDATE_BALANCES = (state, balances) => {
    state.balances = balances
}

mutations.UPDATE_ASSETS = (state, assets) => {
    state.assets = assets
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

mutations.ADD_API_SERVER = (state, url) => {
    state.apiServers.push({
        url: url,
        location: '',
        latency: 0
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
