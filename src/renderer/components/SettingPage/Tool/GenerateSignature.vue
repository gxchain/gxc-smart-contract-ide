<template>
    <base-tool @visible-change="onVisibleChange" :loading="true" modalClass="generate-signature-modal"
            class="generate-signature-layout"
            :title="$t('title')"
            :description="$t('description')">
        <div class="content">
            <Form ref="form" label-position="left" :label-width="80" :rules="rules" :model="model">
                <FormItem :label="$t('wifKey')" prop="wifKey">
                    <Input v-model="model.wifKey" :placeholder="$t('placeholder.wifKey')"/>
                </FormItem>
                <FormItem :label="$t('message')" prop="message">
                    <Input v-model="model.message" :placeholder="$t('placeholder.message')"/>
                </FormItem>
            </Form>
            <div class="btn-wrap">
                <Button class="btn" type="primary" @click="onSignClick">{{$t('sign')}}</Button>
                <copy-btn v-if="!!signature" :value="signature"></copy-btn>
            </div>
            <p class="sig f-toe">{{signature}}</p>
        </div>
    </base-tool>
</template>

<script>
    import CopyBtn from '@/components/common/CopyBtn.vue'
    import BaseTool from './BaseTool'
    import {Serializer, Signature, PrivateKey, types} from 'gxbjs'
    import {wifKeyFormat} from 'gxc-frontend-base/src/rule'

    export default {
        name: 'GenerateSignature',
        components: {
            BaseTool,
            CopyBtn
        },
        data() {
            return {
                model: {
                    wifKey: '',
                    message: ''
                },
                rules: {
                    wifKey: [{
                        required: true,
                        message: this.$t('validate.wifKey.required')
                    }, {
                        validator: (rule, value, callback) => {
                            const err_msg = new Error(this.$t('validate.wifKey.format'))
                            if (wifKeyFormat.test(value)) {
                                callback()
                            } else {
                                callback(err_msg)
                            }
                        }
                    }],
                    message: [{
                        required: true,
                        message: this.$t('validate.message.required')
                    }]
                },
                signature: ''
            }
        },
        methods: {
            onSignClick() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.sign()
                    }
                })
            },
            sign() {
                const ser = new Serializer('temp', {
                    str: types.string
                })
                const buf = ser.toBuffer({
                    str: this.model.message
                })
                try {
                    const sig = Signature.signBuffer(buf, PrivateKey.fromWif(this.model.wifKey))
                    this.signature = sig.toHex()
                } catch (err) {
                    this.$Message.error({content: err.message, duration: 2})
                    this.signature = ''
                }
            },
            onVisibleChange(visible) {
                if (!visible) {
                    this.$refs.form.resetFields()
                    this.signature = ''
                }
            }
        },
        i18n: { // `i18n` option, setup locale message for component
            messages: {
                'en-US': {
                    title: 'Generate Signature',
                    description: 'Generate signature based on ECDSA and SHA256, you may use it when generate some contract function params',
                    sign: 'Sign',
                    wifKey: 'WifKey',
                    message: 'Message',
                    updateKeyPair: 'Update Key Pair',
                    validate: {
                        wifKey: {
                            required: 'WifKey required',
                            format: 'WifKey format error, format is WIF'
                        },
                        message: {
                            required: 'Message required'
                        }
                    },
                    placeholder: {
                        wifKey: 'Please enter wifKey',
                        message: 'Please enter message'
                    }
                },
                'zh-CN': {
                    title: '生成签名',
                    description: '生成基于ECDSA和SHA256算法的数字签名，你可能会在构造合约的函数参数时用到',
                    sign: '签名',
                    wifKey: '私钥',
                    message: '消息',
                    updateKeyPair: '刷新密钥对',
                    validate: {
                        wifKey: {
                            required: '请输入私钥',
                            format: '私钥格式有误，格式为WIF'
                        },
                        message: {
                            required: '请输入签名消息'
                        }
                    },
                    placeholder: {
                        wifKey: '请输入私钥',
                        message: '请输入签名消息'
                    }
                }
            }
        }
    }
</script>

<style type="text/scss" lang="scss" scoped>
    .generate-signature-layout {

    }
</style>

<style type="text/scss" lang="scss">
    .generate-signature-modal {
        .ivu-modal {
            width: 600px !important;
        }

        .sig {
            margin-top: 20px;
        }

        .btn-wrap {
            margin-top: 30px;
        }
    }
</style>
