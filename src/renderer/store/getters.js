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
    state.assets.forEach((asset, i) => {
        var balance = state.balances[i]
        map[balance.id] = {
            symbol: asset.symbol,
            precision: asset.precision
        }
    })

    return map
}

export default getters
