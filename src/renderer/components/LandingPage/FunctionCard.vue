<template>
    <div class="functionCard-layout">
        <h3 class="title" slot="title">{{name}}</h3>
        <field-item v-for="field in fields" :name="field.name" :type="field.type"
                    :value.sync="field.value"></field-item>
        <Button class="callBtn" type="primary" @click="onCall">调用</Button>
        <Modal
                class="confirmCallModal"
                v-model="confirmCallModalVisible"
                title="调用确认"
                @on-ok="onCallOk">
            <p>合约名称:{{contractName}}</p>
            <p>调用账户:{{currentWallet.account}}</p>
            <p>调用函数:{{name}}</p>
            <p>调用参数:{{call_params}}</p>
            <p>手续费类型:{{tempAsset.id}}</p>
            <p>调用费用:{{fee}}</p>
        </Modal>
    </div>
</template>

<script>
    import FieldItem from './FieldItem'
    import {mapState} from 'vuex'
    import serializer from '@/util/serializer'
    import PasswordConfirmModal from '@/components/common/PasswordConfirmModal'
    import {
        call_contract,
        fetch_account
    } from '@/services/WalletService'

    async function formatField(type, value) {
        if (type === 'account_name') {
            return fetch_account(value).then((account) => {
                if (!account) {
                    throw new Error(`account doesn't exist`)
                }
                return +account.id.split('.')[2]
            })
        } else {
            return value
        }
    }

    async function formatFields2Params(fields) {
        var ret = {}
        for (const field of fields) {
            ret[field.name] = await formatField(field.type, field.value)
        }

        return ret
    }

    export default {
        name: 'FunctionCard',
        components: {
            FieldItem
        },
        data() {
            return {
                tempAsset: {},
                tempPwd: '',
                confirmCallModalVisible: false,
                callTransaction: null
            }
        },
        props: {
            abi: {
                type: Object,
                default() {
                    return {}
                }
            },
            contractName: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: 'function'
            },
            fields: {
                type: Array,
                default() {
                    return []
                }
            },
            base: {
                type: String,
                default: ''
            }
        },
        computed: {
            ...mapState(['wallets', 'currentWallet', 'assets']),
            fee() {
                if (!this.callTransaction) {
                    return 0
                } else {
                    return this.callTransaction.serialize().operations[0][1].fee.amount / Math.pow(10, this.tempAsset.precision)
                }
            },
            call_params() {
                var ret = {}
                this.fields.forEach(field => {
                    ret[field.name] = field.value
                })

                return JSON.stringify(ret)
            }
        },
        methods: {
            onCall() {
                if (!this.currentWallet.account) {
                    this.$Modal.confirm({
                        title: '前往导入账户',
                        content: '您还未导入账户，是否前往导入账户？',
                        onOk: () => {
                            this.$router.push({name: 'import-recover'})
                        }
                    })
                    return
                }
                const modal = new PasswordConfirmModal()
                modal.$on('unlocked', async ({pwd, asset_id, asset}) => {
                    let params
                    try {
                        params = await formatFields2Params(this.fields)
                    } catch (ex) {
                        this.$Message.error(`${ex.message}`)
                        return
                    }
                    const data = serializer.serializeCallData(this.name, params, this.abi).toString('hex')
                    call_contract(this.currentWallet.account, this.contractName, {
                        'method_name': this.name,
                        'data': data
                    }, asset_id, pwd, false).then((resp) => {
                        this.callTransaction = resp
                        this.tempPwd = pwd
                        this.tempAsset = asset
                        this.confirmCallModalVisible = true
                    }).catch(ex => {
                        this.$Message.error(`${ex.message}`)
                    })
                })
            },
            async onCallOk() {
                const params = await formatFields2Params(this.fields)
                const data = serializer.serializeCallData(this.name, params, this.abi).toString('hex')
                call_contract(this.currentWallet.account, this.contractName, {
                    'method_name': this.name,
                    'data': data
                }, this.tempAsset.id, this.tempPwd, true).then((resp) => {
                    this.$Message.success('合约调用成功')
                    this.$store.dispatch('updateCurrentBalancesAndAssets')
                }).catch(ex => {
                    this.$Message.error(`${ex.message}`)
                })
            }
        }
    }
</script>

<style scoped>
    .functionCard-layout {
        margin-top: 20px;
    }

    .title {
        color: white;
        font-size: 12px;
    }

    .callBtn {
        margin-top: 10px;
        width: 90px;
    }
</style>
