import {fetch_account_balances, get_assets_by_ids} from '@/services/WalletService'

const actions = {}

actions.appendWallet = ({commit, state}, wallet) => {
    if (state.wallets.length === 0) {
        commit('SWITCH_CURRENT_WALLET', wallet)
    }
    commit('APPEND_WALLET', wallet)
}

actions.removeWallet = ({commit}, account) => {
    commit('REMOVE_WALLET', account)
}

actions.switchWallet = ({commit}, wallet) => {
    commit('SWITCH_CURRENT_WALLET', wallet)
}

actions.updateCurrentBalancesAndAssets = ({dispatch, state}) => {
    dispatch('updateCurrentBalances').then((balances) => {
        return dispatch('updateCurrentAssets', balances)
    }).catch(ex => {
        console.error(ex)
    })
}

actions.updateCurrentBalances = ({commit, state}) => {
    return fetch_account_balances(state.currentWallet.account).then((balances) => {
        commit('UPDATE_BALANCES', balances)
        return balances
    })
}

actions.updateCurrentAssets = ({commit, state}, balances) => {
    let asset_ids = balances.map(b => {
        return b.asset_id
    })

    return get_assets_by_ids(asset_ids).then((assets) => {
        commit('UPDATE_ASSETS', assets)
        return assets
    })
}

actions.updateApiServersLatency = ({commit, state}) => {

}

export default actions
