<template>
    <div class="layout">
        <Card>
            <p slot="title">function name:{{name}}</p>
            <field-item v-for="field in fields" :name="field.name" :type="field.type"
                        :value.sync="field.value"></field-item>
        </Card>
        <Button class="callBtn" type="primary" @click="onCall">调用</Button>
    </div>
</template>

<script>
    import FieldItem from './FieldItem'
    import {mapState} from 'vuex'
    import {
        call_contract
    } from '@/services/WalletService'

    export default {
        name: 'FunctionCard',
        components: {
            FieldItem
        },
        props: {
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
            ...mapState(['currentWallet'])
        },
        methods: {
            onCall() {
                // TODO data的处理
                console.log(this.fields)
                if (window.nnn) {
                    call_contract(this.currentWallet.account, this.contractName, {
                        'method_name': this.name,
                        'data': '5601000000000000'
                    }, '1.3.0', '123123', true).then((resp) => {
                        console.log('called', resp)
                    }).catch(ex => {
                        console.error('cclclclclclcl', ex)
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
