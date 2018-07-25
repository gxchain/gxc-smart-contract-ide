<template>
    <Button class="copyBtn" type="primary" @click="onCopyClick">{{text}}</Button>
</template>
<script>
    export default {
        name: 'copyBtn',
        props: {
            text: {
                type: String,
                default() {
                    return this.$t('common.copy')
                }
            },
            value: {
                type: String,
                default: ''
            },
            successMsg: {
                type: String,
                default() {
                    return this.$t('common.messages.copySuc')
                }
            }
        },
        methods: {
            onCopyClick() {
                const clipboard = require('electron').clipboard

                if (clipboard) {
                    clipboard.writeText(this.value)
                    this.$Message.success(this.successMsg)
                }

                // TODO 非electron环境
            }
        }
    }
</script>
