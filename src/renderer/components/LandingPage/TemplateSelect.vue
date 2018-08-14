<template>
    <div class="template-select-layout">
        <Row>
            <Col v-for="meta in metas" span="6" offset="2">
            <Poptip trigger="hover" word-wrap :content="meta.description">
                <Card title="" :class="{selected:selected.title===meta.title}" style="text-align: center">
                    <div class="cnt" @click="onTemplateClick(meta)">
                        {{meta.title}}
                    </div>
                </Card>
            </Poptip>
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

<style lang="scss" type="text/scss" scoped>
    .template-select-layout /deep/ .ivu-card-body {
        padding: 0;
    }

    .template-select-layout{
        & /deep/ .ivu-poptip{
            width: 100%;
        }

        & /deep/ .ivu-poptip-rel{
            width: 100%;
        }

        & /deep/ .ivu-card{
            width: 100%;
        }
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
