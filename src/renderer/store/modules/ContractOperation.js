const state = {
    contracts: [],
    splitval: '240px'
}

const mutations = {
    APPEND_CONTRACT(state, contract) {
        state.contracts.push(Object.assign({
            abi: '',
            from: '',
            contractName: '',
            contractId: '',
            fee: {}
        }, contract))
    },
    REMOVE_CONTRACT(state, id) {
        var idx = -1
        state.contracts.find(function (contract, index) {
            if (contract.contractId === id) {
                idx = index
            }
        })

        state.contracts.splice(idx, 1)
    },
    CHANGE_SPLITVAL(state, val) {
        state.splitval = val
    }
}

const actions = {
    appendContract({commit}, contract) {
        commit('APPEND_CONTRACT', contract)
    },
    removeContract({commit}, id) {
        commit('REMOVE_CONTRACT', id)
    },
    changeSplitval({commit}, val) {
        commit('CHANGE_SPLITVAL', val)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
