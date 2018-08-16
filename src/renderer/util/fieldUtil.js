const util = {}
import i18n from '@/locales'
import store from '@/store'
import {
    fetch_account
} from '@/services/WalletService'
import {accMult} from 'gxc-frontend-base/src/script/util/index'

const handlers = {
    'account_name': async function (value) {
        return fetch_account(value).then((account) => {
            if (!account) {
                throw new Error(i18n.t('error.account.notFound'))
            }
            return +account.id.split('.')[2]
        })
    },
    'contract_asset': function (value) {
        value.amount = accMult(value.amount, Math.pow(10, store.getters.assetMap[value.asset_id].precision))
        value.asset_id = +value.asset_id.split('.')[2]
        return value
    },
    'asset': function (value) {
        value.amount = accMult(value.amount, Math.pow(10, store.getters.assetMap[value.asset_id].precision))
        return value
    },
    defaultHandler: function (value) {
        return value
    }
}

util.formatField = async function (type, value) {
    let handler = handlers[type]
    if (!handler) {
        handler = handlers.defaultHandler
    }

    value = await handler(value)
    return value
}

util.formatFields2Params = async function (fields) {
    var ret = {}
    for (const field of fields) {
        if (util.isArrayType(field.type)) {
            ret[field.name] = await Promise.all(field.value.map(val => {
                return util.formatField(util.getSingleType(field.type), val)
            }))
        } else {
            ret[field.name] = await util.formatField(field.type, field.value)
        }
    }
    return ret
}

util.isArrayType = function (type) {
    if (type.indexOf('[]') !== -1) {
        return true
    } else {
        return false
    }
}

util.getSingleType = function (type) {
    return type.split('[')[0]
}

export default util
