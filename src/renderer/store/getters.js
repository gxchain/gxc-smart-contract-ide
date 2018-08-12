const getters = {}

getters.formatBalances = state => {
    return state.balances.map((balance, i) => {
        var asset = state.assets[i]
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
    state.balances.forEach((balance, i) => {
        var asset = state.assets[i]
        map[asset.id] = {
            symbol: asset.symbol,
            precision: asset.precision
        }
    })

    return map
}

export default getters
