import {fetch_account_balances, get_assets_by_ids} from '@/services/WalletService'
import {Manager} from 'gxbjs-ws'
import {reconnect} from '@/services/connect'

const actions = {}

actions.appendWallet = ({dispatch, commit, state}, wallet) => {
    commit('APPEND_WALLET', wallet)
    if (state.wallets.length === 1) {
        dispatch('changeWallet', wallet.account)
    }
}

actions.removeWallet = ({state, dispatch, commit}, account) => {
    commit('REMOVE_WALLET', account)
    if (account === state.currentWallet.account) {
        dispatch('changeWallet', state.wallets[0] && state.wallets[0].account)
    }
}

actions.changeWallet = ({commit, dispatch}, account) => {
    commit('CHANGE_WALLET', account)
    dispatch('updateCurrentBalancesAndAssets')
}

actions.updateCurrentBalancesAndAssets = ({dispatch, state}) => {
    dispatch('updateCurrentBalances').then((balances) => {
        return dispatch('updateCurrentAssets', balances)
    }).catch(ex => {
        console.error(ex)
    })
}

actions.updateCurrentBalances = ({commit, state}) => {
    if (state.currentWallet.account) {
        return fetch_account_balances(state.currentWallet.account).then((balances) => {
            commit('UPDATE_BALANCES', balances)
            return balances
        })
    }
}

actions.updateCurrentAssets = ({commit, state}, balances) => {
    if (!!balances) {
        let asset_ids = balances.map(b => {
            return b.asset_id
        })

        return get_assets_by_ids(asset_ids).then((assets) => {
            commit('UPDATE_ASSETS', assets)
            return assets
        })
    }
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
    // TODO 目前，如果输入错误接入点，控制台会报错，原因是 checkConnections 中 `var conn = new _ChainWebSocket2.default(url, function () {})` 这句
    return manager.checkConnections().then((resp) => {
        commit('UPDATE_API_SERVERS_LATENCY', resp)
        return resp
    })
}

actions.changeCurrentApiServer = ({dispatch, commit, state}, url) => {
    const node = state.apiServers.filter(node => {
        if (url === node.url) {
            return true
        }
    })

    if (!!node) {
        commit('CHANGE_CURRENT_API_SERVER', node[0])
        reconnect()
        dispatch('updateApiServers')
    }
}

actions.addApiServer = ({dispatch, commit, state}, url) => {
    // 是否url已存在
    let flag = false
    state.apiServers.find(node => {
        if (url === node.url) {
            flag = true
        }
    })
    if (flag) {
        return flag
    } else {
        commit('ADD_API_SERVER', url)
        dispatch('updateApiServers')
        return flag
    }
}

actions.removeApiServer = ({commit, dispatch, state}, url) => {
    if (state.apiServers.length === 1) {
        return
    }
    commit('REMOVE_API_SERVER', url)
    if (url === state.currentApiServer.url) {
        dispatch('changeCurrentApiServer', state.apiServers[0].url)
    } else {
        dispatch('updateApiServers')
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
    // 是否url已存在
    let flag = false
    state.compileServers.find(node => {
        if (url === node.url) {
            flag = true
        }
    })
    if (flag) {
        return flag
    } else {
        commit('ADD_COMPILE_SERVER', url)
        return flag
    }
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
