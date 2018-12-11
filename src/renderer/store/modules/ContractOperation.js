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
    UPDATE_CONTRACT(state, {chainId, id, abi}) {
        const node = state.contracts.filter(contract => contract.chainId === chainId).find(contract => contract.id === id)
        if (!!node) {
            node.abi = abi
        }
    },
    CHANGE_SPLITVAL(state, val) {
        state.splitval = val
    }
}

const getters = {
    contractsFromCurChain: (state, getters, rootState) => {
        return state.contracts.filter(contract => contract.chainId === rootState.curChainId)
    }
}

const actions = {
    appendContract({commit}, contract) {
        commit('APPEND_CONTRACT', contract)
    },
    removeContract({commit}, id) {
        commit('REMOVE_CONTRACT', id)
    },
    updateContract({commit, getters}, {chainId, id, abi}) {
        commit('UPDATE_CONTRACT', {chainId, id, abi})
    },
    changeSplitval({commit}, val) {
        commit('CHANGE_SPLITVAL', val)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
