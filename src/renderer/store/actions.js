import {fetch_account_balances, get_assets_by_ids} from '@/services/WalletService'
import {Manager} from 'gxbjs-ws'
import {reconnect} from '@/services/connect'

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

actions.updateApiServers = ({dispatch, state}) => {
    // TODO 过滤（根据latency排序）
    // 更新latency
    return dispatch('updateApiServersLatency')
}

actions.updateApiServersLatency = ({commit, state}) => {
    const manager = new Manager({
        url: state.currentApiServer.url,
        urls: state.apiServers.map(node => {
            return node.url
        })
    })
    return manager.checkConnections().then((resp) => {
        commit('UPDATE_API_SERVERS_LATENCY', resp)
        return resp
    }).catch(ex => {
        console.errror(ex)
    })
}

actions.changeCurrentApiServer = ({commit, state}, url) => {
    const node = state.apiServers.filter(node => {
        if (url === node.url) {
            return true
        }
    })

    if (!!node) {
        commit('CHANGE_CURRENT_API_SERVER', node[0])
        reconnect(true)
    }
}

actions.addApiServer = ({commit, state}, url) => {
    commit('ADD_API_SERVER', url)
}

actions.removeApiServer = ({commit, dispatch, state}, url) => {
    if (state.apiServers.length === 1) {
        return
    }
    commit('REMOVE_API_SERVER', url)
    if (url === state.currentApiServer.url) {
        dispatch('changeCurrentApiServer', state.apiServers[0].url)
    }
}

actions.changeCurrentCompileServer = ({commit, state}, url) => {
    const node = state.compileServers.filter(node => {
        if (url === node.url) {
            return true
        }
    })

    if (!!node) {
        commit('CHANGE_CURRENT_COMPILE_SERVER', node[0])
    }
}

actions.addCompileServer = ({commit, state}, url) => {
    commit('ADD_COMPILE_SERVER', url)
}

actions.removeCompileServer = ({commit, dispatch, state}, url) => {
    if (state.compileServers.length === 1) {
        return
    }
    commit('REMOVE_COMPILE_SERVER', url)
    if (url === state.currentCompileServer.url) {
        dispatch('changeCurrentCompileServer', state.compileServers[0].url)
    }
}

export default actions
