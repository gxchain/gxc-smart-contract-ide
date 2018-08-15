<template>
    <div class="contractList-layout">
        <h3 class="layout-title">
            <span style="vertical-align: middle">{{$t('contract.listTitle')}}</span>
            <Icon type="md-add-circle" @click="onContractImportClick"></Icon>
        </h3>
        <div class="contract-wrap">
            <Collapse v-for="contract in contracts" value="1">
                <Panel name="1">
                    <div class="f-toe" :title="contract.contractName"
                            style="display:inline-block;width:210px;vertical-align: middle;">
                        {{contract.contractName}}
                    </div>
                    <Icon type="md-close" @click="onContractRemoveClick($event,contract)"></Icon>
                    <div slot="content">
                        <function-card v-for="f in contract.functions" :payable="f.payable" :abi="contract.abi"
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
    import {mapState, mapActions} from 'vuex'
    import {cloneDeep} from 'lodash'
    import {fetch_account} from '@/services/WalletService'
    import {contractNameFormat} from 'gxc-frontend-base/src/rule/contract'
    import {Form, FormItem, Input} from 'iview'

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
            ...mapState('ContractOperation', {
                contracts: state => {
                    return contractsFilter(cloneDeep(state.contracts))
                }
            })
        },
        methods: {
            ...mapActions('ContractOperation', ['removeContract', 'appendContract']),
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
                    fetch_account(name).then((account) => {
                        // not exist
                        if (!account) {
                            this.$Message.error(this.$t('contract.error.notExist'))
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

                        const contract = {
                            abi: account.abi,
                            from: account.referer,
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
                const rules = {
                    name: [
                        {
                            required: true,
                            message: this.$t('contract.validate.name.required')
                        }, {
                            validator: (rule, value, callback) => {
                                const err_msg = new Error(this.$t('contract.validate.name.format'))
                                if (contractNameFormat.test(value)) {
                                    callback()
                                } else {
                                    callback(err_msg)
                                }
                            }
                        }]
                }

                let model = {
                    name: ''
                }

                function handleInput(val) {
                    model.name = val
                }

                this.$Modal.confirm({
                    title: this.$t('contract.title.importContract'),
                    loading: true,
                    render: (h) => {
                        return (
                            <Form ref="form" style={{'margin-top': '30px'}} rules={rules} model={model}>
                                <FormItem prop="name">
                                    <Input on-input={handleInput} value={model.name} autofocus={true}
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
