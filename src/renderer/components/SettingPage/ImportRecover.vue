<template>
    <div class="layout">
        <Select v-model="importType">
            <Option v-for="item in importTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Input v-model="wifKey" placeholder="私钥"></Input>
        <Input v-model="pwd" placeholder="密码"></Input>
        <Input v-model="pwdRepeat" placeholder="重复密码"></Input>
        <Button @click="onImportClick">导入</Button>

        <Table :columns="columns" :data="data"></Table>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {
        import_account
    } from '@/services/WalletService'

    export default {
        name: 'ImportRecover',
        data() {
            return {
                importType: 'PRIVATE_KEY',
                importTypes: [{
                    value: 'PRIVATE_KEY',
                    label: '导入私钥'
                }],
                wifKey: '',
                pwd: '',
                pwdRepeat: '',
                columns: [{
                    title: '账户',
                    key: 'account'
                }, {
                    title: 'Action',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.removeWallet(params.account)
                                    }
                                }
                            }, 'Delete')
                        ])
                    }
                }]
            }
        },
        computed: {
            ...mapState({
                data: state => {
                    return state.wallets.map((wallet) => {
                        return Object.assign({
                            operation: '删除'
                        }, wallet)
                    })
                }
            })
        },
        methods: {
            ...mapActions(['appendWallet', 'removeWallet']),
            onImportClick() {
                this.import()
            },
            import() {
                import_account(this.wifKey, this.pwd).then((info) => {
                    console.log('success')
                }).catch((ex) => {
                    console.error(ex)
                    // no_reference_account
                })
                // this.appendWallet({
                //     account: 'test'
                //     // password_pubkey,
                //     // encryption_key,
                //     // encrypted_wifkey,
                //     // backup_date: null
                // })
            }
        }
    }
</script>

<style scoped>

</style>
