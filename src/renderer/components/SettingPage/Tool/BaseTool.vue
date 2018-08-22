<template>
    <div class="base-tool">
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
                :title="title"
                @on-ok="$emit('ok')"
                @on-cancel="$emit('cancel')">
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
            }
        },
        methods: {
            onToolUseClick() {
                this.visible = true
            }
        }
    }
</script>

<style scoped>

</style>
