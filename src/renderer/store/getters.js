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

export default getters
