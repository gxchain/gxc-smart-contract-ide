<template>
    <div class="functionCard-layout">
        <h3 class="title">{{name}} <span v-if="payable" class="payable-tag">(payable)</span></h3>
        <h3 class="extra-asset-title" v-if="payable">{{$t('contract.carryAmount')}}</h3>
        <div v-if="payable" class="extra-asset">
            <Select v-model="amount.asset_id" class="asset-select" :placeholder="$t('common.placeholder.assetType')">
                <Option v-for="asset in formatBalances" :value="asset.id" :key="asset.id">{{ asset.symbol }}</Option>
            </Select>
            <Input class="asset-amount" :placeholder="$t('common.placeholder.assetAmount')" v-model="amount.amount"/>
        </div>
        <fields ref="fields" :data="fields"></fields>
        <Button class="callBtn" type="primary" @click="onCall">{{$t('contract.call')}}</Button>
        <Modal
                class="confirmCallModal"
                v-model="confirmCallModalVisible"
                :title="$t('contract.title.callConfirm')"
                @on-ok="onCallOk">
            <Form class="pure-text-form" label-position="left" :label-width="120">
                <FormItem :label="$t('contract.label.name')">{{contractName}}</FormItem>
                <FormItem :label="$t('contract.label.callAccount')">{{currentWallet.account}}</FormItem>
                <FormItem :label="$t('contract.label.methodName')">{{name}}</FormItem>
                <FormItem style="word-break: break-all" :label="$t('contract.label.params')">{{callParams}}</FormItem>
                <FormItem v-if="amount.amount" :label="$t('contract.label.carryAmount')">
                    {{amount.asset_id|assetId2Symbol}}, {{amount.amount}}
                </FormItem>
                <FormItem :label="$t('contract.label.costAmount')">{{tempAsset.symbol}}, {{fee}}</FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import Fields from './Fields'
    import {mapState, mapGetters} from 'vuex'
    import serializer from '@/util/serializer'
    import PasswordConfirmModal from '@/components/common/PasswordConfirmModal'
    import {
        call_contract
    } from '@/services/WalletService'
    import fieldUtil from '@/util/fieldUtil'

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
                this.$logUtil.logClick('callClick')
                if (!this.currentWallet.account) {
                    this.$Modal.confirm({
                        title: this.$t('common.title.guideToImport'),
                        content: this.$t('common.content.guideToImport'),
                        onOk: () => {
                            this.$router.push({name: 'import-recover'})
                        }
                    })
                    return
                }
                const modal = new PasswordConfirmModal({i18n: this.$i18n})
                modal.$on('unlocked', async ({pwd, asset_id, asset}) => {
                    let params
                    let data
                    var fields = this.$refs.fields.getFields()
                    try {
                        params = await fieldUtil.formatFields2Params(fields)
                        data = serializer.serializeCallData(this.name, params, this.abi).toString('hex')
                    } catch (ex) {
                        console.error(ex)
                        this.$eventBus.$emit('log:push', {
                            info: ex.message,
                            level: 'error'
                        })
                        this.$Message.error(this.$t('contract.error.paramCompute'))
                        return
                    }
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
                        console.error(ex)
                        this.$eventBus.$emit('log:push', {
                            info: ex.message,
                            level: 'error'
                        })
                        this.$Message.error(this.$t('contract.error.feeCompute'))
                    })
                })
            },
            async onCallOk() {
                var fields = this.$refs.fields.getFields()
                const params = await fieldUtil.formatFields2Params(fields)
                const data = serializer.serializeCallData(this.name, params, this.abi).toString('hex')
                call_contract(this.currentWallet.account, this.contractName, {
                    'method_name': this.name,
                    'data': data
                }, this.tempAsset.id, this.tempPwd, true, this.amount).then((resp) => {
                    this.$logUtil.logClick('callSuc')
                    const txid = resp[0].id
                    this.$eventBus.$emit('log:push', {
                        info: this.$t('contract.messages.callSuc') + `,txid:${txid}`,
                        level: 'success'
                    })
                    this.$Message.success(this.$t('contract.messages.callSuc'))
                    this.$store.dispatch('updateCurrentBalancesAndAssets')
                }).catch(ex => {
                    this.$logUtil.logClick('callFail')
                    this.$eventBus.$emit('log:push', {
                        info: ex.message,
                        level: 'error'
                    })
                    this.$Message.error(this.$t('contract.messages.callFail'))
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

<style lang="scss" type="text/scss" scoped>
    .functionCard-layout {
        margin-top: 20px;
    }

    .payable-tag {
        color: #57a3f3;
    }

    .extra-asset-title {
        margin-top: 6px;
        color: #57a3f3;
        font-size: 12px;
    }

    .title {
        color: white;
        font-size: 12px;
    }

    .callBtn {
        margin-top: 10px;
        width: 90px;
    }

    .extra-asset{
        display:flex;
    }

    .asset-select {
        width: 0;
        flex-grow: 1;
        margin-right: 6px;
    }

    .asset-amount {
        flex-grow: 2;
        width: 0;
    }
</style>
