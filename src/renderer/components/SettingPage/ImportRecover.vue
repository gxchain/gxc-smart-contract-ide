<template>
    <div class="layout">
        <Form ref="form" :rules="rules" :model="form" label-position="left" :label-width="100">
            <FormItem label="导入方式">
                <Select v-model="importType">
                    <Option v-for="item in importTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="私钥" prop="wifKey">
                <Input v-model="form.wifKey" placeholder="私钥"></Input>
            </FormItem>
            <FormItem label="Aligned title" prop="pwd">
                <Input v-model="form.pwd" placeholder="密码"></Input>
            </FormItem>
            <FormItem label="Aligned title" prop="pwdCheck">
                <Input v-model="form.pwdCheck" placeholder="密码"></Input>
            </FormItem>
        </Form>

        <Button @click="onImportClick">导入</Button>

        <Table :columns="columns" :data="data"></Table>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {PrivateKey} from 'gxbjs/lib/index.js'
    import {
        import_account
    } from '@/services/WalletService'

    export default {
        name: 'ImportRecover',
        data() {
            return {
                rules: {
                    wifKey: [{
                        required: true,
                        message: '请输入私钥'
                    }, {
                        validator(rule, value, callback) {
                            let wif_regex = /^5[HJK][1-9A-Za-z]{49}$/
                            const err_msg = new Error('私钥格式错误')
                            if (wif_regex.test(value)) {
                                try {
                                    let private_key = PrivateKey.fromWif(value)
                                    let public_key = private_key.toPublicKey()
                                    let public_key_string = public_key.toPublicKeyString()
                                    if (public_key_string.indexOf('GXC') > -1) {
                                        callback()
                                    } else {
                                        callback(err_msg)
                                    }
                                } catch (e) {
                                    callback(err_msg)
                                }
                            } else {
                                callback(err_msg)
                            }
                        }
                    }],
                    pwd: [{
                        required: true,
                        message: '请输入密码'
                    }, {
                        type: 'string',
                        min: 6,
                        message: 'The password length cannot be less than 6 bits',
                        trigger: 'blur'
                    }],
                    pwdCheck: [{
                        required: true,
                        message: '请确认密码'
                    }, {
                        type: 'string',
                        min: 6,
                        message: 'The password length cannot be less than 6 bits',
                        trigger: 'blur'
                    }, {
                        validator: (rule, value, callback) => {
                            if (value !== this.form.pwd) {
                                callback(new Error('The two input passwords do not match!'))
                            } else {
                                callback()
                            }
                        }
                    }]
                },
                form: {
                    wifKey: '',
                    pwd: '',
                    pwdCheck: ''
                },
                importType: 'PRIVATE_KEY',
                importTypes: [{
                    value: 'PRIVATE_KEY',
                    label: '导入私钥'
                }],
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
                                        this.removeWallet(params.row.account)
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
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        import_account(this.form.wifKey, this.form.pwd).then((info) => {
                            console.log('success')
                        }).catch((ex) => {
                            console.error(ex)
                            // no_reference_account
                        })
                    } else {
                        this.$Message.error('Fail!')
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
