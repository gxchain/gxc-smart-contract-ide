<template>
    <div class="layout">
        <Form ref="form" :rules="rules" :model="form" label-position="left" :label-width="120">
            <FormItem :label="$t('importSetting.label.importType')" prop="importType">
                <Select v-model="form.importType">
                    <Option v-for="item in importTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem :label="$t('importSetting.label.wifKey')" prop="wifKey">
                <Input type="password" v-model="form.wifKey"
                        :placeholder="$t('importSetting.placeholder.wifKey')"></Input>
            </FormItem>
            <FormItem :label="$t('importSetting.label.pwd')" prop="pwd">
                <Input type="password" v-model="form.pwd" :placeholder="$t('importSetting.placeholder.pwd')"></Input>
            </FormItem>
            <FormItem :label="$t('importSetting.label.pwdCheck')" prop="pwdCheck">
                <Input type="password" v-model="form.pwdCheck"
                        :placeholder="$t('importSetting.placeholder.pwdCheck')"></Input>
            </FormItem>
        </Form>

        <Button class="import" type="primary" :loading="loading" @click="onImportClick">
            {{$t('importSetting.importTitle')}}
        </Button>

        <Table :columns="columns" :data="data"></Table>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {PrivateKey} from 'gxbjs/es/index'
    import {
        import_account
    } from '@/services/WalletService'

    export default {
        name: 'ImportRecover',
        data() {
            return {
                loading: false,
                rules: {
                    importType: [{
                        required: true,
                        message: this.$t('importSetting.validate.importType.required')
                    }],
                    wifKey: [{
                        required: true,
                        message: this.$t('importSetting.validate.wifKey.required')
                    }, {
                        validator: (rule, value, callback) => {
                            let wif_regex = /^5[HJK][1-9A-Za-z]{49}$/
                            const err_msg = new Error(this.$t('importSetting.validate.wifKey.format'))
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
                        message: this.$t('importSetting.validate.pwd.required')
                    }, {
                        type: 'string',
                        min: 6,
                        message: this.$t('importSetting.validate.pwd.format')
                    }],
                    pwdCheck: [{
                        required: true,
                        message: this.$t('importSetting.validate.pwdCheck.required')
                    }, {
                        type: 'string',
                        min: 6,
                        message: this.$t('importSetting.validate.pwd.format')
                    }, {
                        validator: (rule, value, callback) => {
                            if (value !== this.form.pwd) {
                                callback(new Error(this.$t('importSetting.validate.pwdCheck.doNotMatch')))
                            } else {
                                callback()
                            }
                        }
                    }]
                },
                form: {
                    wifKey: '',
                    pwd: '',
                    pwdCheck: '',
                    importType: 'PRIVATE_KEY'
                },
                importTypes: [{
                    value: 'PRIVATE_KEY',
                    label: this.$t('importSetting.label.importWifKey')
                }],
                columns: [{
                    title: this.$t('importSetting.account'),
                    key: 'account'
                }, {
                    title: this.$t('importSetting.accountId'),
                    key: 'id'
                }, {
                    title: this.$t('importSetting.action'),
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
                                        this.$Modal.confirm({
                                            title: this.$t('importSetting.title.removeAccount'),
                                            content: this.$t('importSetting.content.removeAccount'),
                                            onOk: () => {
                                                this.removeWallet(params.row.account)
                                            }
                                        })
                                    }
                                }
                            }, this.$t('importSetting.remove'))
                        ])
                    }
                }]
            }
        },
        computed: {
            ...mapState({
                data: state => {
                    return state.wallets.map((wallet) => {
                        return Object.assign({}, wallet, {id: wallet.id.split('.')[2]})
                    })
                }
            })
        },
        methods: {
            ...mapActions(['appendWallet', 'removeWallet']),
            onImportClick() {
                this.$logUtil.logClick('importClick')
                this.import()
            },
            import() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        import_account(this.form.wifKey, this.form.pwd).then((info) => {
                            this.$logUtil.logClick('importSuc')
                            this.loading = false
                            this.$Message.success(this.$t('importSetting.messages.importSuc'))
                        }).catch((ex) => {
                            this.$logUtil.logClick('importFail')
                            this.loading = false
                            this.$Message.error(ex.message)
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .import {
        min-width: 96px;
        margin-top: 10px;
        margin-bottom: 20px;
    }
</style>
