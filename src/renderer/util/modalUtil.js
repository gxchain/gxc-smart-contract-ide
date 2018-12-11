import TransactionConfirmModal from '@/components/common/TransactionConfirmModal'
import PasswordConfirmModal from '@/components/common/PasswordConfirmModal'

export const confirmTransaction = function ({title = '', items = [], onOk}) {
    const ret = new TransactionConfirmModal({
        propsData: {
            title,
            items,
            onOk
        }
    })

    return ret
}

export const confirmPassword = function (callback) {
    const modal = new PasswordConfirmModal()
    modal.$on('unlocked', callback)
}
