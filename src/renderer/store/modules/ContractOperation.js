import ut from '@/util/util.js'

const state = {
    files: [],
    contracts: []
}

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
    }
}

const util = {
    formatFiles: function (files) {
        return files.map(function (file) {
            file.title = file.title || ''
            file.id = file.id || ut.generateGuuId()
            file.code = file.code || ''
            file.selected = file.selected || false

            return file
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    util
}
