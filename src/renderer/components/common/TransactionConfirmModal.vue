<template>
    <Modal class="pure-text-form" :title="title" v-model="model" @on-ok="_onOk">
        <Form ref="form" label-position="left" :label-width="120">
            <FormItem v-for="item in items" :label="item.label">{{item.desc}}</FormItem>
        </Form>
    </Modal>
</template>
<script>
    import Vue from 'vue'

    export default Vue.extend({
        name: 'TransactionConfirmModal',
        data() {
            return {
                model: false
            }
        },
        props: {
            title: String,
            items: Array,
            onOk: Function
        },
        created() {
            // 为了拿到this.$el
            this.$mount()
        },
        mounted() {
            document.body.appendChild(this.$el)
            // 如果没有这一句，会影响modal出现时的动画效果
            this.model = true
        },
        methods: {
            _onOk() {
                this.onOk()
            }
        }
    })
</script>

<style type="text/scss" lang="scss">
    .pure-text-form /deep/ .ivu-form-item-content{
        word-break: break-all;
    }
</style>
