const mutations = {}

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

export default mutations
