<template>
    <div class="layout">
        <Card v-for="contract in contracts">
            <p slot="title">{{contract.contractName}}</p>
            <function-card v-for="f in contract.functions" :name="f.name" :fields="f.fields"></function-card>
        </Card>
    </div>
</template>

<script>
    import FunctionCard from './FunctionCard'
    import {mapState} from 'vuex'
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
        }
    }
</script>

<style scoped>

</style>
