import axios from 'axios'
import {b64_to_utf8} from 'gxc-frontend-base/src/script/util/index'

const state = {
    lastSha: '',
    completions: []
}

const mutations = {
    UPDATE_SHA(state, sha) {
        state.lastSha = sha
    },
    UPDATE_COMPLETIONS(state, completions) {
        state.completions = completions
    }
}

function filterJson(json) {
    json.types = json.types || []
    json.keywords = json.keywords || []
    json.apis = json.apis || []

    const types = json.types.map((type) => {
        return {
            value: type.name,
            meta: 'keyword'
        }
    })

    const keywords = json.keywords.map((keyword) => {
        return {
            value: keyword.name,
            meta: 'keyword'
        }
    })

    const apis = json.apis.map((api) => {
        return {
            fields: [],
            ...api,
            value: api.name,
            meta: 'gxc_api',
            score: 9999999
        }
    })

    return [...types, ...keywords, ...apis]
}

const actions = {
    updateCompletions({commit}) {
        axios.get('https://api.github.com/repos/gxchain/Technical-Documents/contents/gxb_contract_api.json', {
            headers: {'Accept': 'application/vnd.github.v3.object'}
        }).then(res => {
            if (res.data.sha !== state.lastSha) {
                commit('UPDATE_SHA', res.data.sha)
                commit('UPDATE_COMPLETIONS', filterJson(JSON.parse(b64_to_utf8(res.data.content))))
            }
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
