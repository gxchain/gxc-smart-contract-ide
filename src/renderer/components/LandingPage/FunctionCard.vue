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
    </div>
</template>

<script>
    import Fields from './Fields'
    import {mapState, mapGetters} from 'vuex'
    import serializer from '@/util/serializer'
    import {
        call_contract
    } from '@/services/WalletService'
    import fieldUtil from '@/util/fieldUtil'
    import {noAccountGuard} from '@/util/guard'
    import {confirmTransaction, confirmPassword} from '@/util/modalUtil'

    export default {
        name: 'FunctionCard',
        components: {
            Fields
        },
        data() {
            return {
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
            ...mapGetters(['formatBalances', 'assetMap'])
        },
        methods: {
            onCall() {
                this.$logUtil.logClick('callClick')
                if (!noAccountGuard()) {
                    return
                }

                confirmPassword(async ({pwd, asset_id, asset}) => {
                    let items
                    this.callParams = this.computeCallParams()
                    try {
                        items = await this.buildCallItems(asset_id, asset, pwd)
                    } catch (err) {
                        return console.error(err)
                    }

                    confirmTransaction({
                        title: this.$t('contract.title.callConfirm'),
                        items: items,
                        onOk: () => {
                            this.callContract(asset_id, pwd).then((trx) => {
                                this.$logUtil.logClick('callSuc')
                                const txid = trx[0].id
                                this.$eventBus.$emit('log:push', {
                                    info: this.$t('contract.messages.callSuc') + `,txid:${txid}`,
                                    level: 'success'
                                })
                                this.$Message.success(this.$t('contract.messages.callSuc'))
                                this.$store.dispatch('updateCurrentBalancesAndAssets')
                            }).catch(err => {
                                this.$logUtil.logClick('callFail')
                                this.$eventBus.$emit('log:push', {
                                    info: err,
                                    level: 'error'
                                })
                                this.$Message.error(this.$t('contract.messages.callFail'))
                            })
                        }
                    })
                })
            },
            callContract(asset_id, pwd, broadcast = true) {
                return new Promise(async (resolve, reject) => {
                    let params
                    let data
                    var fields = this.$refs.fields.getFields()
                    try {
                        params = await fieldUtil.formatFields2Params(fields)
                        data = serializer.serializeCallData(this.name, params, this.abi).toString('hex')
                    } catch (ex) {
                        console.error(ex)
                        this.$eventBus.$emit('log:push', {
                            info: ex,
                            level: 'error'
                        })
                        this.$Message.error(this.$t('contract.error.paramCompute'))
                        reject(ex)
                    }

                    resolve(call_contract(this.currentWallet.account, this.contractName, {
                        'method_name': this.name,
                        'data': data
                    }, asset_id, pwd, broadcast, this.amount))
                })
            },
            async buildCallItems(asset_id, asset, pwd) {
                const items = [{
                    label: this.$t('contract.label.name'),
                    desc: this.contractName
                }, {
                    label: this.$t('contract.label.callAccount'),
                    desc: this.currentWallet.account
                }, {
                    label: this.$t('contract.label.methodName'),
                    desc: this.name
                }, {
                    label: this.$t('contract.label.params'),
                    desc: this.callParams
                }, {
                    label: this.$t('contract.label.costAmount'),
                    desc: await this.getCallFeeStr(asset_id, asset, pwd)
                }]

                if (!!this.amount.amount) {
                    items.push({
                        label: this.$t('contract.label.carryAmount'),
                        desc: this.assetId2Symbol(this.amount.asset_id) + ', ' + this.amount.amount
                    })
                }

                return items
            },
            getCallFeeStr(asset_id, asset, pwd) {
                return new Promise((resolve, reject) => {
                    this.callContract(asset_id, pwd, false).then((trx) => {
                        const str = asset.symbol + ', ' + trx.serialize().operations[0][1].fee.amount / (10 ** asset.precision)
                        resolve(str)
                    }).catch(err => {
                        this.$eventBus.$emit('log:push', {
                            info: err,
                            level: 'error'
                        })
                        this.$Message.error(this.$t('contract.error.feeCompute'))
                        reject(err)
                    })
                })
            },
            computeCallParams() {
                var ret = {}
                var fields = this.$refs.fields.getFields()
                fields.forEach(field => {
                    ret[field.name] = field.value
                })

                return JSON.stringify(ret)
            },
            assetId2Symbol(id) {
                return this.assetMap[id].symbol
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

    .extra-asset {
        display: flex;
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
