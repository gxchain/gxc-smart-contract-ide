import ut from '@/util/util.js'
import TreeModel from 'tree-model'
import {findIndex} from 'lodash'

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
    // TODO change file not sync
    openedFiles: [],
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
        state.openedFiles.push(filesTreeModel.first(idEq(node.id)).model)
    },
    CHANGE_CURRENT_OPENED_FILE(state, id) {
        state.currentOpenedFile = id ? state.openedFiles.find(file => file.id === id) : {}
    },
    CLOSE_OPENED_FILE(state, id) {
        const index = findIndex(state.openedFiles, file => file.id === id)
        state.openedFiles.splice(index, 1)
    },
    CHANGE_CURRENT_OPENED_FILE_BY_INDEX(state, idx) {
        state.currentOpenedFile = idx === -1 ? {} : state.openedFiles[idx]
    },
    CHANGE_CURRENT_OPENED_FILE_CONTENT(state, {node, content}) {
        const target = state.openedFiles.find(file => file.id === node.id)
        if (!!target) {
            target.content = content
        }
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
    removeFile({state, commit, dispatch}, node) {
        // close opened file first
        const f = state.openedFiles.find(f => f.id === node.id)
        if (!!f) {
            dispatch('closeOpenedFile', f.id)
        }
        filesTreeModel.first(idEq(node.id)).walk(file => {
            const f = state.openedFiles.find(f => f.id === file.model.id)
            if (!!f) {
                dispatch('closeOpenedFile', f.id)
            }
        })
        commit('REMOVE_FILE', node)
    },
    selectFile({commit}, node) {
        commit('SELECT_FILE', node)
    },
    changeFileContent({commit, dispatch}, {target, content} = {}) {
        commit('CHANGE_CURRENT_OPENED_FILE_CONTENT', {node: target, content})
        dispatch('changeFileStatus', {node: target, opts: {content}})
    },
    openFile({commit, dispatch, state}, node) {
        if (node.isDirectory) {
            dispatch('changeFileStatus', {node, opts: {expand: !node.expand}})
        } else {
            if (state.openedFiles.find(file => file.id === node.id)) {
                dispatch('changeCurrentOpenedFile', node.id)
            } else {
                commit('OPEN_FILE', node)
                dispatch('changeCurrentOpenedFile', node.id)
            }
        }
    },
    changeCurrentOpenedFile({commit}, id) {
        commit('CHANGE_CURRENT_OPENED_FILE', id)
    },
    closeOpenedFile({commit, state, dispatch}, id) {
        const idx = findIndex(state.openedFiles, file => file.id === id)
        let targetIndex
        if (idx === 0) {
            if (state.openedFiles.length > 1) {
                targetIndex = 0
            } else {
                targetIndex = -1
            }
        } else {
            targetIndex = idx - 1
        }
        commit('CLOSE_OPENED_FILE', id)
        // close file is current opened file
        if (id === state.currentOpenedFile.id) {
            // change to another opened file
            dispatch('changeCurrentOpenedFileByIndex', targetIndex)
        }
    },
    changeCurrentOpenedFileByIndex({commit, state}, idx) {
        commit('CHANGE_CURRENT_OPENED_FILE_BY_INDEX', idx)
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
