<template>
    <div class="contractList-layout">
        <h3 class="layout-title">
            <span style="vertical-align: middle">{{$t('contract.listTitle')}}</span>
            <Icon type="md-add-circle" @click="onContractImportClick"></Icon>
        </h3>
        <div class="contract-wrap">
            <Collapse v-for="(contract,idx) in contracts" :key="idx" value="1">
                <Panel name="1">
                    <Tooltip :content="'owner: '+contract.from" placement="top">
                        <div class="f-toe contractName" :title="contract.contractName">
                            {{contract.contractName}}
                        </div>
                    </Tooltip>
                    <Icon class="updateContract" type="md-refresh"
                          @click="onContractUpdateClick($event,contract)"></Icon>
                    <Icon class="closeContract" type="md-close" @click="onContractRemoveClick($event,contract)"></Icon>
                    <div slot="content">
                        <function-card v-for="f in contract.functions" :key="f.name" :payable="f.payable"
                                       :abi="contract.abi"
                                       :contractName="contract.contractName"
                                       :name="f.name"
                                       :fields="f.fields"></function-card>
                    </div>
                </Panel>
            </Collapse>
        </div>
    </div>
</template>

<script>
    import FunctionCard from './FunctionCard'
    import {mapActions, mapGetters, mapState} from 'vuex'
    import {cloneDeep} from 'lodash'
    import {fetch_account, get_account_by_id, update_contract} from '@/services/WalletService'
    import {Form, FormItem, Input} from 'iview'
    import {ChainValidation} from 'gxbjs/es/index'
    import {confirmPassword, confirmTransaction} from '@/util/modalUtil'
    import {noAccountGuard} from '@/util/guard'

    function contractsFilter(contracts) {
        return contracts.map(contract => {
            return contractFilter(contract)
        })
    }

    function contractFilter(contract) {
        contract.functions = contract.abi.actions.map((action) => {
            var struct = contract.abi.structs.find((struct) => {
                return struct.name === action.name
            })
            return {
                ...struct,
                ...action
            }
        })
        return contract
    }

    export default {
        name: 'ContractList',
        components: {
            FunctionCard,
            Form,
            FormItem,
            Input
        },
        computed: {
            ...mapState(['abi', 'bytecode', 'currentWallet', 'curChainId']),
            ...mapGetters('ContractOperation', ['contractsFromCurChain']),
            contracts() {
                return contractsFilter(cloneDeep(this.contractsFromCurChain))
            }
        },
        methods: {
            ...mapActions('ContractOperation', ['removeContract', 'appendContract']),
            ...mapActions('ContractOperation', {'updateContractAction': 'updateContract'}),
            onContractRemoveClick(evt, contract) {
                evt.stopPropagation()
                this.$Modal.confirm({
                    title: this.$t('contract.title.removeContract'),
                    content: this.$t('contract.content.removeContract'),
                    onOk: () => {
                        this.removeContract(contract.contractId)
                    }
                })
            },
            onContractImportClick() {
                this.showEditContractNameModal((name) => {
                    fetch_account(name).then(async (account) => {
                        // not exist
                        if (!account) {
                            this.$Message.error(this.$t('contract.error.contractAccountNotExist'))
                            return
                        }
                        // not contract
                        if (!account.code) {
                            this.$Message.error(this.$t('contract.error.notContract'))
                            return
                        }
                        // repeat contract
                        if (!!this.contracts.find(contract => contract.contractId === account.id)) {
                            this.$Message.error(this.$t('contract.error.repeat'))
                            return
                        }

                        const fromAcc = await get_account_by_id(account.referrer)

                        const contract = {
                            chainId: this.$store.state.curChainId,
                            abi: account.abi,
                            from: fromAcc.name,
                            contractName: account.name,
                            contractId: account.id
                        }
                        this.$Message.success(this.$t('contract.messages.importSuc'))
                        this.appendContract(contract)
                        this.$store.dispatch('updateCurrentBalancesAndAssets')
                    })
                })
            },
            showEditContractNameModal(callback) {
                var rules = {
                    name: [
                        {
                            required: true,
                            message: this.$t('contract.validate.name.required')
                        }, {
                            validator: (rule, value, callback) => {
                                let errMsg
                                // FIXME i18n
                                if (!!(errMsg = ChainValidation.is_account_name_error(value))) {
                                    callback(errMsg)
                                } else {
                                    callback()
                                }
                            }
                        }]
                }

                let model = {
                    name: ''
                }

                this.$Modal.confirm({
                    title: this.$t('contract.title.importContract'),
                    loading: true,
                    render: (h) => {
                        return (
                            <Form ref="form" style={{'margin-top': '30px'}} rules={rules} model={model}>
                                <FormItem prop="name">
                                    <Input v-model={model.name} autofocus={true}
                                        placeholder={this.$t('contract.placeholder.name.required')}/>
                                </FormItem>
                            </Form>
                        )
                    },
                    onOk: function () {
                        this.$refs.form.validate((valid) => {
                            if (valid) {
                                this.cancel()
                                callback(model.name)
                            } else {
                                this.buttonLoading = false
                            }
                        })
                    }
                })
            },
            showUpdateContractModal(callback) {
                var model = {
                    newOwner: ''
                }

                var rules = {
                    newOwner: [{
                        validator: (rule, value, callback) => {
                            if (!value) {
                                callback()
                            } else {
                                const errMsg = ChainValidation.is_account_name_error(value)
                                if (!!errMsg) {
                                    callback(errMsg)
                                } else {
                                    callback()
                                }
                            }
                        }
                    }]
                }

                const desc = this.$t('contract.desc.changeOwner')

                this.$Modal.confirm({
                    title: this.$t('contract.title.updateContract'),
                    loading: true,
                    render: (h) => {
                        return (
                            <div>
                                <p>{desc}</p>
                                <Form ref="form" style={{'margin-top': '10px'}} rules={rules} model={model}>
                                    <FormItem prop="newOwner">
                                        <Input v-model={model.newOwner} autofocus={true}
                                            placeholder={this.$t('contract.placeholder.changeOwner')}/>
                                    </FormItem>
                                </Form>
                            </div>
                        )
                    },
                    onOk: function () {
                        this.$refs.form.validate((valid) => {
                            if (valid) {
                                this.cancel()
                                callback(model.newOwner)
                            } else {
                                this.buttonLoading = false
                            }
                        })
                    }
                })
            },
            onContractUpdateClick(evt, contract) {
                evt.stopPropagation()
                this.$logUtil.logClick('updateContractClick')
                if (!noAccountGuard()) {
                    return
                }

                // must compile first
                if (!this.bytecode) {
                    this.$Message.warning(this.$t('contract.validate.needToCompileFirst'))
                    return
                }

                this.showUpdateContractModal(newOwner => {
                    confirmPassword(async ({pwd, asset_id, asset}) => {
                        let items
                        try {
                            items = await this.buildUpdateItems(contract, newOwner, asset_id, asset, pwd)
                        } catch (err) {
                            return console.error(err)
                        }

                        confirmTransaction({
                            title: this.$t('contract.title.updateContractConfirm'),
                            items: items,
                            onOk: () => {
                                this.updateContract(asset_id, pwd, contract, newOwner).then((trx) => {
                                    this.updateContractAction({
                                        newOwner,
                                        chainId: this.curChainId,
                                        id: contract.contractId,
                                        abi: this.abi
                                    })
                                    this.$logUtil.logClick('updateContractSuc')
                                    const txid = trx[0].id
                                    this.$eventBus.$emit('log:push', {
                                        info: this.$t('contract.messages.updateContractSuc') + `,txid:${txid}`,
                                        level: 'success'
                                    })
                                    this.$Message.success(this.$t('contract.messages.updateContractSuc'))
                                    this.$store.dispatch('updateCurrentBalancesAndAssets')
                                }).catch(err => {
                                    this.$logUtil.logClick('updateContractFail')
                                    this.$eventBus.$emit('log:push', {
                                        info: err,
                                        level: 'error'
                                    })
                                    this.$Message.error(this.$t('contract.messages.updateContractFail'))
                                })
                            }
                        })
                    })
                })
            },
            async buildUpdateItems(contract, newOwner, asset_id, asset, pwd) {
                const items = [{
                    label: this.$t('contract.label.costAmount'),
                    desc: await this.getUpdateFeeStr(asset_id, asset, contract, newOwner, pwd)
                }, {
                    label: this.$t('contract.label.callAccount'),
                    desc: this.currentWallet.account
                }, {
                    label: this.$t('contract.label.name'),
                    desc: contract.contractName
                }]

                if (!!newOwner) {
                    items.push({
                        label: this.$t('contract.label.newOwner'),
                        desc: newOwner
                    })
                }

                return items
            },
            getUpdateFeeStr(asset_id, asset, contract, newOwner, pwd) {
                return new Promise((resolve, reject) => {
                    this.updateContract(asset_id, pwd, contract, newOwner, false).then((trx) => {
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
            updateContract(asset_id, pwd, contract, newOwner, broadcast = true) {
                return new Promise(async (resolve, reject) => {
                    const params = {
                        from: this.currentWallet.account,
                        contractName: contract.contractName,
                        code: this.bytecode,
                        abi: this.abi,
                        fee_id: asset_id,
                        password: pwd,
                        broadcast
                    }

                    if (!!newOwner) {
                        params.newOwner = newOwner
                    }

                    resolve(update_contract(params))
                })
            }
        }
    }
</script>

<style scoped type="text/scss" lang="scss">
    .ivu-collapse {
        margin-top: 20px;
        border: 0;
        border-radius: 0;
        border-top: 2px solid #6699ff;
        background: #32395e;
    }

    .closeContract {
        position: absolute;
        right: 0;
        top: 14px;
    }

    .updateContract {
        position: absolute;
        right: 15px;
        top: 9px;
        padding: 5px;
    }

    .contractName {
        display: inline-block;
        width: 190px;
        vertical-align: middle;
        position: relative;
        top: -1px;
    }

    .ivu-icon-md-add-circle {
        position: relative;
        top: 1px;
        vertical-align: middle;
        cursor: pointer;
        font-size: 16px;
        margin-left: 2px;
    }

    .contractList-layout /deep/ .ivu-collapse > .ivu-collapse-item.ivu-collapse-item-active > .ivu-collapse-header {
        border-bottom: 1px solid rgb(21, 25, 53);
    }

    .functionCard-layout {
        &:first-child {
            margin-top: 0;
        }
    }

    .contractList-layout /deep/ .ivu-collapse-content {
        background: #32395e;
    }

    .contractList-layout /deep/ .ivu-collapse-header {
        color: #c4c3d3;
    }

    .title {
        color: #c4c3d3;
        font-size: 14px;
    }

    .contractList-layout {
        border-top: 1px solid #313754;
        height: calc(100vh - 221px);
        padding: 16px 15px 0;
        overflow: auto;

    }

    .contractList-layout /deep/ .ivu-input {
        border-color: #9090c8;
        color: #9090c8;
        background: transparent;
    }

    .contractList-layout /deep/ .ivu-select-selection {
        border-color: #9090c8;
        color: #9090c8;
        background: transparent;
    }

    .layout-title {
        color: white;
        font-size: 14px;
    }
</style>
