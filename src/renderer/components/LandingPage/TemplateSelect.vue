<template>
    <div class="template-select-layout">
        <Row>
            <Col v-for="meta in metas" span="6" offset="2">
            <Card title="" :class="{selected:selected.title===meta.title}" style="text-align: center">
                <div class="cnt" @click="onTemplateClick(meta)">
                    {{meta.title}}
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import templateUtil from '@/util/templateUtil'

    export default {
        name: 'TemplateSelect',
        data() {
            return {
                selected: {}
            }
        },
        computed: {
            metas() {
                return templateUtil.metas
            }
        },
        methods: {
            onTemplateClick(meta) {
                this.selected = meta
                this.$emit('select', meta)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .template-select-layout /deep/ .ivu-card-body {
        padding: 0;
    }

    .cnt {
        height: 100%;
        padding: 40px 20px;
        cursor: pointer;
    }

    .ivu-card.selected {
        border: 1px solid #57a3f3;
    }
</style>
