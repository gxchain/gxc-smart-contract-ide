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
            file.children = file.children || []
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
    },
    files(state) {
        return state.files
    }
}

state.files = util.formatFiles(state.files)

const mutations = {
    REFRESH_FILES(state) {
        // must use deepClone, otherwise the model will tainted
        // by vue store which will throw error after call this function again
        state.files = cloneDeep(filesTreeModel.model)
    },
    APPEND_FILE(state, {target, opts = {}}) {
        let tempNode = new TreeModel()
        tempNode = tempNode.parse(util.formatFile(opts))
        if (target.isDirectory) {
            filesTreeModel.first(idEq(target.id)).addChild(tempNode)
        } else {
            filesTreeModel.first(idEq(target.id)).parent.addChild(tempNode)
        }
    },
    CHANGE_FILE_STATUS(state, {node, opts}) {
        var model = filesTreeModel.first(idEq(node.id)).model
        Object.assign(model, opts)
    },
    REMOVE_FILE(state, node) {
        filesTreeModel.first(idEq(node.id)).drop()
    },
    SELECT_FILE(state, node) {
        state.currentSelectedFile = filesTreeModel.first(idEq(node.id)).model || {}
    },
    OPEN_FILE(state, node) {
        state.currentOpenedFile = filesTreeModel.first(idEq(node.id)).model
    },
    CHANGE_CURRENT_OPENED_FILE_CONTENT(state, content) {
        state.currentOpenedFile.content = content
    },
    ADD_PROJECT(state, project) {
        let tempNode = new TreeModel()
        tempNode = tempNode.parse(util.formatFiles(project))
        filesTreeModel.addChild(tempNode)
    }
}

function idEq(id) {
    return function (node) {
        return node.model.id === id
    }
}

const actions = {
    addProject({commit}, project) {
        commit('ADD_PROJECT', project)
    },
    appendFile({commit}, payload) {
        commit('APPEND_FILE', payload)
    },
    changeFileStatus({commit}, payload) {
        commit('CHANGE_FILE_STATUS', payload)
    },
    removeFile({state, commit}, node) {
        commit('REMOVE_FILE', node)

        if (node.id === state.currentOpenedFile.id) {
            commit('OPEN_FILE', {})
        }
    },
    selectFile({commit}, node) {
        commit('SELECT_FILE', node)
    },
    changeFileContent({commit, dispatch}, {target, content} = {}) {
        commit('CHANGE_CURRENT_OPENED_FILE_CONTENT', content)
        // dispatch('changeFileStatus', {node: target, opts: {content}})
    },
    openFile({commit, dispatch}, node) {
        if (node.isDirectory) {
            dispatch('changeFileStatus', {node, opts: {expand: !node.expand}})
        } else {
            commit('OPEN_FILE', node)
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
        filesTreeModel = filesTreeModel.parse(store.state.ContractFiles.files)
    }
}
