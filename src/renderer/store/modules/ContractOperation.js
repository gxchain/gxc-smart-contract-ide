import ut from '@/util/util.js'

const util = {
    formatFiles: function (files) {
        var id = ut.generateGuuId()
        return files.map(function (file) {
            file.title = file.title || id + '.cpp'
            file.id = file.id || id
            file.code = file.code || ''
            file.selected = file.selected || false

            return file
        })
    }
}

const exampleCode1 = `#include <gxblib/contract.hpp>
#include <gxblib/dispatcher.hpp>
#include <gxblib/print.hpp>
#include <gxblib/types.h>

using namespace graphene;

class hello : public contract
{
  public:
    hello(account_name n)
        : contract(n)
    {
    }

    /// @abi action
    void hi(account_name user)
    {
        for (int i = 0; i < 2; ++i) {
            print("hi, ", user, "\\n");
        }
    }
};

GXB_ABI(hello, (hi))
`

const exampleCode2 = `#include <gxblib/gxb.hpp>
`

const state = {
    files: [{
        title: 'hello.cpp',
        code: exampleCode1
    }, {
        title: 'hello.hpp',
        code: exampleCode2
    }],
    contracts: []
}

state.files = util.formatFiles(state.files)

const mutations = {
    APPEND_FILE(state, files) {
        files = util.formatFiles(files)
        state.files = state.files.concat(files)
    },
    REMOVE_FILE(state, id) {
        var idx = -1
        state.files.find(function (file, index) {
            if (file.id === id) {
                idx = index
            }
        })

        state.files.splice(idx, 1)
    },
    SELECT_FILE(state, id) {
        state.files.forEach(function (file) {
            if (file.id === id) {
                file.selected = true
            } else {
                file.selected = false
            }
        })
    },
    CHANGE_CONTENT(state, opts = {}) {
        state.files.find(function (file) {
            if (file.id === opts.id) {
                file.code = opts.content
            }
        })
    },
    CHANGE_FILE_TITLE(state, {id, title}) {
        state.files.find(function (file) {
            if (file.id === id) {
                file.title = title
            }
        })
    },
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
    }
}

const actions = {
    appendFile({commit}, files) {
        commit('APPEND_FILE', files)
    },
    removeFile({commit}, id) {
        commit('REMOVE_FILE', id)
    },
    selectFile({commit}, id) {
        commit('SELECT_FILE', id)
    },
    changeContent({commit}, opts = {}) {
        commit('CHANGE_CONTENT', opts)
    },
    changeFileTitle({commit}, opts = {}) {
        commit('CHANGE_FILE_TITLE', opts)
    },
    appendContract({commit}, contract) {
        commit('APPEND_CONTRACT', contract)
    },
    removeContract({commit}, id) {
        commit('REMOVE_CONTRACT', id)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    util
}
