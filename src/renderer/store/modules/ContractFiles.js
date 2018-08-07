import ut from '@/util/util.js'
import TreeModel from 'tree-model'
import {cloneDeep} from 'lodash'

const util = {
    // 这里的files一定是一个object
    formatFiles: function (files) {
        files = util.formatFile(files)
        if (files.children) {
            files.children = files.children.map(function (file) {
                file = util.formatFile(file)
                file = util.formatFiles(file)
                return file
            })
        }
        return files
    },
    formatFile: function (file = {}) {
        var id = ut.generateGuuId()
        file.title = file.title || id + '.cpp'
        file.id = file.id || id
        file.isDirectory = file.isDirectory || false
        if (file.children) {
            file.isDirectory = true
        }
        if (!file.isDirectory) {
            file.content = file.content || ''
            file.opened = file.opened || false
        } else {
            file.expand = file.expand || true
        }
        return file
    }
}
let filesTreeModel

const state = {
    currentSelectedFile: {},
    currentOpenedFile: {},
    files: {
        id: 1,
        isRoot: true,
        isDirectory: true,
        title: 'root',
        children: []
    }
}

const getters = {
    projects(state) {
        return state.files.children
    }
}

state.files = util.formatFiles(state.files)

const mutations = {
    REFRESH_FILES(state) {
        state.files = cloneDeep(filesTreeModel.model)
    },
    SELECT_FILE(state, file) {
        state.currentSelectedFile = file
    },
    OPEN_FILE(state, file) {
        state.currentOpenedFile = file
    },
    CHANGE_CURRENT_OPENED_FILE_CONTENT(state, content) {
        state.currentOpenedFile.content = content
    }
}

function idEq(id) {
    return function (node) {
        return node.model.id === id
    }
}

const actions = {
    addProject({commit}, project) {
        let tempNode = new TreeModel()
        tempNode = tempNode.parse(util.formatFiles(project))
        filesTreeModel.addChild(tempNode)
        commit('REFRESH_FILES')
    },
    appendFile({commit}, {target, opts = {}}) {
        let tempNode = new TreeModel()
        tempNode = tempNode.parse(util.formatFile(opts))
        if (target.isDirectory) {
            filesTreeModel.first(idEq(target.id)).addChild(tempNode)
        } else {
            filesTreeModel.first(idEq(target.id)).parent.addChild(tempNode)
        }
        // must use deepClone, otherwise the model will tainted
        // by vue store which will throw error after call this function again
        commit('REFRESH_FILES')
    },
    changeFileStatus({commit}, {node, opts}) {
        var model = filesTreeModel.first(idEq(node.id)).model
        Object.assign(model, opts)
        commit('REFRESH_FILES')
    },
    removeFile({state, commit}, node) {
        filesTreeModel.first(idEq(node.id)).drop()
        commit('REFRESH_FILES')

        if (node.id === state.currentOpenedFile.id) {
            commit('OPEN_FILE', {})
        }
    },
    selectFile({commit}, node) {
        const file = filesTreeModel.first(idEq(node.id)).model
        commit('SELECT_FILE', cloneDeep(file))
    },
    changeFileContent({commit, dispatch}, {target, content} = {}) {
        commit('CHANGE_CURRENT_OPENED_FILE_CONTENT', content)
        dispatch('changeFileStatus', {node: target, opts: {content}})
    },
    changeFileTitle({commit}, opts = {}) {
        commit('CHANGE_FILE_TITLE', opts)
    },
    openFile({commit, dispatch}, node) {
        if (node.isDirectory) {
            dispatch('changeFileStatus', {node, opts: {expand: !node.expand}})
        } else {
            const file = filesTreeModel.first(idEq(node.id)).model
            commit('OPEN_FILE', cloneDeep(file))
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
    util,
    afterInit(store) {
        // filesTreeModel wanna use data after plugin handled,and can not directly access files by `state.files`,
        // because it's a pure object which wouldn't change by plugin
        filesTreeModel = new TreeModel()
        filesTreeModel = filesTreeModel.parse(cloneDeep(store.state.ContractFiles.files))
    }
}
