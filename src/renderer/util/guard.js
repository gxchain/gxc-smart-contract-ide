import store from '@/store'
import {Modal} from 'iview'
import locales from '@/locales'
import router from '@/router'

export const noAccountGuard = function () {
    if (!store.state.currentWallet.account) {
        Modal.confirm({
            title: locales.t('common.title.guideToImport'),
            content: locales.t('common.content.guideToImport'),
            onOk: () => {
                router.push({name: 'import-recover'})
            }
        })
        return false
    }

    return true
}
