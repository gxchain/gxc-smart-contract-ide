<template>
    <base-tool @visible-change="onVisibleChange" :loading="true" modalClass="generate-key-pair-modal" class="generate-key-pair-layout" :title="$t('title')"
            :description="$t('description')">
        <div class="content">
            <Button class="btn" type="primary" @click="updateKeyPair">{{$t('updateKeyPair')}}</Button>
            <Form class="pure-text-form" label-position="left" :label-width="80">
                <FormItem :label="$t('pub')">
                    <span class="text">{{pub}}</span>
                    <copy-btn size="small" :value="pub"></copy-btn>
                </FormItem>
                <FormItem :label="$t('priv')">
                    <span class="text">{{priv}}</span>
                    <copy-btn size="small" :value="priv"></copy-btn>
                </FormItem>
            </Form>
        </div>
    </base-tool>
</template>

<script>
    import CopyBtn from '@/components/common/CopyBtn.vue'
    import BaseTool from './BaseTool'
    import {GXClient} from 'gxclient'

    export default {
        name: 'GenerateKeyPair',
        components: {
            BaseTool,
            CopyBtn
        },
        data() {
            return {
                priv: '',
                pub: ''
            }
        },
        created() {
            this.updateKeyPair()
        },
        methods: {
            updateKeyPair() {
                let pair = this.generateKeyPair()
                this.priv = pair.privateKey
                this.pub = pair.publicKey
            },
            generateKeyPair() {
                let client = new GXClient()
                return client.generateKey()
            },
            onVisibleChange(visible) {
                if (visible) {
                    // this.updateKeyPair()
                }
            }
        },
        i18n: { // `i18n` option, setup locale info for component
            messages: {
                'en-US': {
                    title: 'Generate Key Pair',
                    description: 'Generate GXC key pair, you may use it when generate some contract function params',
                    pub: 'pubKey',
                    priv: 'privateKey',
                    updateKeyPair: 'Update Key Pair'
                },
                'zh-CN': {
                    title: '生成公私钥对',
                    description: '生成GXC公私钥对，你可能会在合约的函数参数用到',
                    pub: '公钥',
                    priv: '私钥',
                    updateKeyPair: '刷新密钥对'
                }
            }
        }
    }
</script>

<style type="text/scss" lang="scss" scoped>
    .generate-key-pair-layout {

    }
</style>

<style type="text/scss" lang="scss">
    .generate-key-pair-modal {
        .ivu-modal {
            width: 600px !important;
        }

        .btn {
            margin-bottom: 10px;
        }

        .text {
            vertical-align: middle;
        }

        .copyBtn {
            position: absolute;
            right: 40px;
            top: 4px;

        }
    }
</style>
