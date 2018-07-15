<template>
    <div class="layout">
        <Card v-for="contract in contracts">
            <p slot="title">{{contract.contractName}}
                <Icon type="close" @click="onContractRemoveClick(contract)"></Icon>
            </p>
            <function-card v-for="f in contract.functions" :contractName="contract.contractName" :name="f.name" :fields="f.fields"></function-card>
        </Card>
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
        contract.functions = contract.abi.structs
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

<style scoped>

</style>
