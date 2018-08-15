<template>
    <div class="template-select-layout">
        <Row style="margin-left: -24px;">
            <Col v-for="meta in metas" span="6" offset="2">
            <Card title="" :class="{selected:selected.title===meta.title}" style="text-align: center">
                <div class="cnt" @click="onTemplateClick(meta)">
                    <div class="bg"></div>
                    <p class="title">{{meta.title}}</p>
                </div>
            </Card>
            </Col>
        </Row>
        <p class="description">{{selected.description}}</p>
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
    @import '@styles/sprite.scss';

    .template-select-layout /deep/ .ivu-card-body {
        padding: 0;
    }

    .template-select-layout {
        margin-top: 15px;

        & /deep/ .ivu-poptip {
            width: 100%;
        }

        & /deep/ .ivu-poptip-rel {
            width: 100%;
        }

        & /deep/ .ivu-card {
            width: 100%;
        }
    }

    .description {
        margin-top: 30px;
        margin-left: 40px;
    }

    .cnt {
        position: relative;
        height: 100%;
        padding: 40px 20px;
        cursor: pointer;

        .title {
            position: relative;
            z-index: 1;
            color: #666;
        }

        .bg {
            z-index: 0;
            position: absolute;
            transform: translate(-50%, -50%);
            left: 50%;
            top: 50%;
            @include sprite($light-logo)
        }
    }

    .ivu-card.selected {
        border: 1px solid #57a3f3;
    }
</style>
