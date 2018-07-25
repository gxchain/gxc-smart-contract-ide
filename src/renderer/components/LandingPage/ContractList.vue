<template>
    <div class="contractList-layout">
        <h3 class="layout-title">{{$t('contract.title')}}</h3>
        <div class="contract" v-for="contract in contracts">
            <p class="title" slot="title">
                {{contract.contractName}}
                <Icon type="close" @click="onContractRemoveClick(contract)"></Icon>
            </p>
            <function-card v-for="f in contract.functions" :abi="contract.abi" :contractName="contract.contractName"
                           :name="f.name"
                           :fields="f.fields"></function-card>
        </div>
    </div>
</template>

<script>
    import FunctionCard from './FunctionCard'
    import {mapState, mapActions} from 'vuex'
    import {cloneDeep} from 'lodash'

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
        components: {FunctionCard},
        computed: {
            ...mapState('ContractOperation', {
                contracts: state => {
                    console.log(contractsFilter(cloneDeep(state.contracts)))
                    return contractsFilter(cloneDeep(state.contracts))
                }
            })
        },
        methods: {
            ...mapActions('ContractOperation', ['removeContract']),
            onContractRemoveClick(contract) {
                this.$Modal.confirm({
                    title: 'test',
                    content: '确定要删除吗？',
                    onOk: () => {
                        this.removeContract(contract.contractId)
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .ivu-icon-close {
        display: none;
        float: right;
        padding: 5px;
        cursor: pointer;
    }

    .contract {
        &:hover {
            .ivu-icon-close {
                display: block;
            }
        }
    }

    .title {
        color: #c4c3d3;
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
