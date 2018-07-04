const actions = {}

actions.appendWallet = ({commit}, wallet) => {
    commit('APPEND_WALLET', wallet)
}

actions.removeWallet = ({commit}, account) => {
    commit('REMOVE_WALLET', account)
}

export default actions
