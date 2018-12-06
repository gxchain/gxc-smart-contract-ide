const getters = {}

getters.formatBalances = state => {
    return state.assets.map((asset, i) => {
        var balance = state.balances[i]
        return {
            amount: balance.amount / Math.pow(10, asset.precision),
            id: asset.id,
            symbol: asset.symbol,
            precision: asset.precision
        }
    })
}

getters.assetMap = state => {
    const map = {}
    state.assets.forEach((asset) => {
        map[asset.id] = {
            symbol: asset.symbol,
            precision: asset.precision
        }
    })

    return map
}

getters.walletsFromCurChain = state => {
    return state.wallets.filter(wallet => wallet.chainId === state.curChainId)
}

export default getters
