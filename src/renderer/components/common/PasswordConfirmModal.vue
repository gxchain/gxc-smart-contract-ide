<template>
    <Modal :title="title" :loading="loading" v-model="model" @on-ok="onOk">
        <Form ref="form" :rules="rules" :model="form" label-position="left" :label-width="80">
            <FormItem :label="$t('common.label.pwd')" prop="pwd">
                <Input type="password" v-model="form.pwd" :placeholder="$t('common.placeholder.pwd')"/>
            </FormItem>
            <FormItem :label="$t('unlock.label.assetType')" prop="asset_id">
                <Select v-model="form.asset_id" :placeholder="$t('unlock.placeholder.assetType')">
                    <Option v-for="asset in formatBalances" :value="asset.id" :key="asset.id">{{ asset.symbol }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem :label="$t('unlock.label.balance')">
                <p>{{balance}}</p>
            </FormItem>
        </Form>
    </Modal>
</template>
<script>
    // TODO i18必须从外部传入，否则会导致循环依赖问题
    import Vue from 'vue'
    import store from '@/store'
    import {
        unlock_wallet
    } from '@/services/WalletService'

    export default Vue.extend({
        name: 'PasswordConfirmModal',
        data() {
            return {
                pwd: '',
                loading: true,
                model: false,
                title: this.$t('unlock.title'),
                rules: {
                    pwd: [{
                        required: true,
                        message: this.$t('common.validate.pwd.required')
                    }, {
                        type: 'string',
                        min: 6,
                        message: this.$t('common.validate.pwd.format'),
                        trigger: 'blur'
                    }],
                    asset_id: [{
                        required: true,
                        message: this.$t('unlock.validate.assetType.required')
                    }]
                },
                form: {
                    pwd: '',
                    asset_id: ''
                }
            }
        },
        computed: {
            formatBalances: function () {
                return store.getters.formatBalances
            },
            balance: function () {
                var balance = this.formatBalances.find((balance) => {
                    return balance.id === this.form.asset_id
                })
                return balance ? balance.amount : 0
            }
        },
        created() {
            this.$mount()
        },
        mounted() {
            document.body.appendChild(this.$el)
            // 如果没有这一句，会影响modal出现时的动画效果
            this.model = true
        },
        methods: {
            onOk() {
                this.$refs.form.validate((valid) => {
                    this.loading = false
                    if (valid) {
                        this.model = false
                        unlock_wallet(store.state.currentWallet.account, this.form.pwd).then(() => {
                            var asset = this.formatBalances.find((asset) => {
                                return asset.id === this.form.asset_id
                            })
                            this.$emit('unlocked', {...this.form, asset})
                        }).catch(ex => {
                            this.$Message.error(ex.message)
                        })
                    } else {
                        this.$nextTick(() => {
                            this.loading = true
                        })
                    }
                })
            }
        }
    })
</script>
