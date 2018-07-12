<template>
    <Modal :loading="loading" v-model="model" @on-ok="onOk">
        <Input v-model="pwd" title="解锁钱包" placeholder="请输入密码"/>
    </Modal>
</template>
<script>
    export default {
        name: 'PasswordConfirmModal',
        data() {
            return {
                pwd: '',
                model: true
            }
        },
        props: {
            loading: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            onOk() {
                this.$emit('ok', this.pwd)
            }
        }
    }
</script>
