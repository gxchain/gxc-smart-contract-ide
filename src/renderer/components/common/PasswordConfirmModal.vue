<template>
    <Modal :title="title" :loading="loading" v-model="model" @on-ok="onOk">
        <Form ref="form" :rules="rules" :model="form" label-position="left" :label-width="80">
            <FormItem label="密码" prop="pwd">
                <Input type="password" v-model="form.pwd" title="解锁钱包" placeholder="请输入密码"/>
            </FormItem>
            <FormItem label="资产类型" prop="asset_id">
                <Select v-model="form.asset_id" placeholder="请选择操作所消耗的资产类型">
                    <Option v-for="asset in formatBalances" :value="asset.id" :key="asset.id">{{ asset.symbol }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="当前余额">
                <p>{{restAmount}}</p>
            </FormItem>
        </Form>
    </Modal>
</template>
<script>
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
                title: '确认密码',
                rules: {
                    pwd: [{
                        required: true,
                        message: '请输入密码'
                    }, {
                        type: 'string',
                        min: 6,
                        message: 'The password length cannot be less than 6 bits',
                        trigger: 'blur'
                    }],
                    asset_id: [{
                        required: true,
                        message: '请选择资产类型'
                    }]
                },
                form: {
                    pwd: '',
                    asset_id: ''
                }
            }
        },
        computed: {
            assets: function () {
                return store.state.assets
            },
            formatBalances: function () {
                return store.getters.formatBalances
            },
            restAmount: function () {
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
                            var asset = this.assets.find((asset) => {
                                return asset.id === this.form.asset_id
                            })
                            this.$emit('unlocked', {...this.form, asset})
                        }).catch(ex => {
                            this.$Message.error(ex.message)
                        })
                    } else {
                        this.$Message.error('Fail!')
                        this.$nextTick(() => {
                            this.loading = true
                        })
                    }
                })
            }
        }
    })
</script>
