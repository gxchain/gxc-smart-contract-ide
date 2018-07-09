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

export default actions
