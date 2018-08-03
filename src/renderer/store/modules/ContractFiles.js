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
    currentSelectedFile: {},
    currentOpenedFile: {},
    files: {
        id: 1,
        isRoot: true,
        isDirectory: true,
        title: 'root',
        children: [{
            title: 'folder1',
            isDirectory: true,
            children: [{
                title: 'hello.cpp',
                content: exampleCode1,
                isDirectory: false
            }, {
                title: 'hello.hpp',
                content: exampleCode2,
                isDirectory: false
            }]
        }, {
            title: 'folder2',
            isDirectory: true,
            children: [{
                title: 'hello2.cpp',
                content: exampleCode1,
                isDirectory: false
            }, {
                title: 'hello2.hpp',
                content: exampleCode2,
                isDirectory: false
            }]
        }]
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
    removeFile({commit}, node) {
        filesTreeModel.first(idEq(node.id)).drop()
        commit('REFRESH_FILES')
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
    util,
    afterInit(store) {
        // filesTreeModel wanna use data after plugin handled,and can not directly access files by `state.files`,
        // because it's a pure object which wouldn't change by plugin
        filesTreeModel = new TreeModel()
        filesTreeModel = filesTreeModel.parse(cloneDeep(store.state.ContractFiles.files))
    }
}
