<template>
    <div class="contractList-layout">
        <h3 class="layout-title">{{$t('contract.listTitle')}} <Icon type="md-add" @click="onContractImportClick"></Icon></h3>
        <div class="contract" v-for="contract in contracts">
            <p class="title">
                {{contract.contractName}}
                <Icon type="md-close" @click="onContractRemoveClick(contract)"></Icon>
            </p>
            <function-card v-for="f in contract.functions" :payable="f.payable" :abi="contract.abi" :contractName="contract.contractName"
                           :name="f.name"
                           :fields="f.fields"></function-card>
        </div>
    </div>
</template>

<script>
    import FunctionCard from './FunctionCard'
    import {mapState, mapActions} from 'vuex'
    import {cloneDeep} from 'lodash'
    import {fetch_account} from '@/services/WalletService'
    import Rules from '@/const/rules'
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
            onContractRemoveClick(contract) {
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
                            message: this.$t('files.validate.required')
                        }, {
                            validator: (rule, value, callback) => {
                                const err_msg = new Error(this.$t('contract.validate.name.format'))
                                if (Rules.contractNameFormat.test(value)) {
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
                                        placeholder={this.$t('contract.placeholder.required')}/>
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
    .ivu-icon-md-close {
        display: none;
        float: right;
        padding: 5px;
        cursor: pointer;
    }

    .contract {
        &:hover {
            .ivu-icon-md-close {
                display: block;
            }
        }
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

    .contract {
        margin-top: 20px;
        border-top: 2px solid #6699ff;
        padding: 18px 20px 25px;
        background: #32395e;
    }
</style>
