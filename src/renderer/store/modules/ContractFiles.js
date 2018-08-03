import ut from '@/util/util.js'
import TreeModel from 'tree-model'
import {cloneDeep} from 'lodash'

const util = {
    // 这里的files一定是一个object
    formatFiles: function (files) {
        if (files.children) {
            files.children = files.children.map(function (file) {
                file = util.formatFile(file)
                file = util.formatFiles(file)
                return file
            })
        } else {
            files = util.formatFile(files)
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
            file.expand = file.expand || false
        }
        return file
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
    files: {
        id: 0,
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

let filesTreeModel = new TreeModel()
filesTreeModel = filesTreeModel.parse(cloneDeep(state.files))

const mutations = {
    REFRESH_FILES(state, files) {
        state.files = files
    }
}

function idEq(id) {
    return function (node) {
        return node.model.id === id
    }
}

const actions = {
    appendFile({commit}, node) {
        let tempNode = new TreeModel()
        tempNode = tempNode.parse(util.formatFile())
        filesTreeModel.first(idEq(node.id)).addChild(tempNode)
        // must use deepClone, otherwise the model will tainted
        // by vue store which will throw error after call this function again
        commit('REFRESH_FILES', cloneDeep(filesTreeModel.model))
    },
    changeFileStatus({commit}, {node, opts}) {
        var model = filesTreeModel.first(idEq(node.id)).model
        Object.assign(model, opts)
        commit('REFRESH_FILES', cloneDeep(filesTreeModel.model))
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
