<template>
    <div class="functionCard-layout">
        <h3 class="title" slot="title">{{name}}</h3>
        <h3 v-if="payable">附带资产</h3>
        <div v-if="payable" class="extra-asset">
            <Select v-model="amount.asset_id" class="asset-select" placeholder="请选择资产类型">
                <Option v-for="asset in formatBalances" :value="asset.id" :key="asset.id">{{ asset.symbol }}</Option>
            </Select>
            <Input class="asset-amount" placeholder="资产数量" v-model="amount.amount"/>
        </div>
        <fields ref="fields" :data="fields"></fields>
        <Button class="callBtn" type="primary" @click="onCall">调用</Button>
        <Modal
                class="confirmCallModal"
                v-model="confirmCallModalVisible"
                title="调用确认"
                @on-ok="onCallOk">
            <p>合约名称:{{contractName}}</p>
            <p>调用账户:{{currentWallet.account}}</p>
            <p>调用函数:{{name}}</p>
            <p style="word-break: break-all;">调用参数:{{callParams}}</p>
            <p v-if="!!amount.amount">附带资金:{{amount.amount}}</p>
            <p>手续费类型:{{tempAsset.id}}</p>
            <p>调用费用:{{fee}}</p>
        </Modal>
    </div>
</template>

<script>
    import Fields from './Fields'
    import {mapState, mapGetters} from 'vuex'
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
            Fields
        },
        data() {
            return {
                tempAsset: {},
                tempPwd: '',
                confirmCallModalVisible: false,
                callTransaction: null,
                callParams: {},
                amount: {
                    amount: null,
                    asset_id: ''
                }
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
            },
            payable: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            ...mapState(['wallets', 'currentWallet', 'assets']),
            ...mapGetters(['formatBalances']),
            fee() {
                if (!this.callTransaction) {
                    return 0
                } else {
                    return this.callTransaction.serialize().operations[0][1].fee.amount / Math.pow(10, this.tempAsset.precision)
                }
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
                const modal = new PasswordConfirmModal({i18n: this.$i18n})
                modal.$on('unlocked', async ({pwd, asset_id, asset}) => {
                    let params
                    var fields = this.$refs.fields.getFields()
                    try {
                        params = await formatFields2Params(fields)
                    } catch (ex) {
                        this.$Message.error(`${ex.message}`)
                        return
                    }
                    const data = serializer.serializeCallData(this.name, params, this.abi).toString('hex')
                    call_contract(this.currentWallet.account, this.contractName, {
                        'method_name': this.name,
                        'data': data
                    }, asset_id, pwd, false, this.amount).then((resp) => {
                        this.callParams = this.computeCallParams()
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
                var fields = this.$refs.fields.getFields()
                const params = await formatFields2Params(fields)
                const data = serializer.serializeCallData(this.name, params, this.abi).toString('hex')
                call_contract(this.currentWallet.account, this.contractName, {
                    'method_name': this.name,
                    'data': data
                }, this.tempAsset.id, this.tempPwd, true, this.amount).then((resp) => {
                    this.$Message.success('合约调用成功')
                    this.$store.dispatch('updateCurrentBalancesAndAssets')
                }).catch(ex => {
                    this.$Message.error(`${ex.message}`)
                })
            },
            computeCallParams() {
                var ret = {}
                var fields = this.$refs.fields.getFields()
                fields.forEach(field => {
                    ret[field.name] = field.value
                })

                return JSON.stringify(ret)
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

    .asset-select {
        width: 80px;
        margin-right: 6px;
    }

    .asset-amount {
        width: 160px;
    }
</style>
