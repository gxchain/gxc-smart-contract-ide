const util = {}
import i18n from '@/locales'
import {
    fetch_account
} from '@/services/WalletService'

util.formatField = async function (type, value) {
    if (type === 'account_name') {
        return fetch_account(value).then((account) => {
            if (!account) {
                throw new Error(i18n.t('error.account.notFound'))
            }
            return +account.id.split('.')[2]
        })
    } else {
        return value
    }
}

util.formatFields2Params = async function (fields) {
    var ret = {}
    for (const field of fields) {
        ret[field.name] = await util.formatField(field.type, field.value)
    }

    return ret
}

export default util
