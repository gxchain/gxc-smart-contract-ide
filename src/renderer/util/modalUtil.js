import TransactionConfirmModal from '@/components/common/TransactionConfirmModal'

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
