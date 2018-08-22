<template>
    <div class="base-tool tool-item">
        <Card>
            <p slot="title">
                <Icon type="md-hammer"></Icon>
                {{title}}
            </p>
            <Button size="small" type="primary" slot="extra" @click="onToolUseClick">
                {{$t('tool.use')}}
            </Button>
            <div class="description">
                {{description}}
            </div>
        </Card>
        <Modal
                v-model="visible"
                :footerHide="footerHide"
                :loading="loading"
                class="base-tool-modal"
                :class="modalClass"
                :title="title"
                :okText="okText"
                :cancelText="cancelText"
                @on-ok="$emit('ok')"
                @on-cancel="$emit('cancel')"
                @on-visible-change="$emit('visible-change',$event)">
            <slot></slot>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: 'BaseTool',
        data() {
            return {
                visible: false
            }
        },
        props: {
            title: {
                type: String,
                default: 'title'
            },
            description: {
                type: String,
                default: 'description'
            },
            modalClass: String,
            'cancelText': String,
            'okText': String,
            footerHide: {
                type: Boolean,
                default: true
            },
            loading: Boolean
        },
        methods: {
            onToolUseClick() {
                this.visible = true
            }
        }
    }
</script>

<style scoped lang="scss" type="text/scss">
    .base-tool-modal /deep/ .ivu-modal-body {
        padding: 20px;
    }
</style>
