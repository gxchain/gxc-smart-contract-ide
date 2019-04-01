<template>
    <div class="template-select-layout">
        <Row style="margin-left: -24px;">
            <Col v-for="(meta,idx) in metas" :key="idx" span="6" offset="2">
            <Card title="" :class="{selected:selected.title===meta.title}" style="text-align: center">
                <div class="cnt" @click="onTemplateClick(meta)" :style="meta.bdStyle">
                    <div class="bg" :class="{'default-bg':!meta.bgUrl}" :style="meta.bgStyle"></div>
                    <p class="title">{{meta.title}}</p>
                </div>
            </Card>
            </Col>
        </Row>
        <p class="description">{{selected.description}}</p>
    </div>
</template>

<script>
    import templateUtil from '@/template/templateUtil'
    import {SWITCH_LANG} from '@/const/eventBus'
    import {cloneDeep} from 'lodash'

    export default {
        name: 'TemplateSelect',
        data() {
            return {
                selected: {},
                lang: localStorage.getItem('lang')
            }
        },
        computed: {
            metas() {
                return this.filterMetas(cloneDeep(templateUtil.metas), this.lang)
            }
        },
        created() {
            this.$eventBus.$on(SWITCH_LANG, (lang) => {
                this.lang = lang
            })
        },
        methods: {
            onTemplateClick(meta) {
                this.selected = meta
                this.$emit('select', meta)
            },
            filterMetas(metas, lang) {
                return metas.map(meta => {
                    if (typeof meta.description === 'string') {
                        return meta
                    } else if (!meta.description['zh-CN'] || !meta.description['en-US']) {
                        meta.description = meta.description['zh-CN'] || meta.description['en-US']
                    } else {
                        meta.description = meta.description[lang]
                    }

                    return meta
                })
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    @import '@styles/sprite.scss';

    .template-select-layout /deep/ .ivu-card-body {
        padding: 0;
        height: 100px;
        line-height: 100px;
    }

    .template-select-layout {
        & /deep/ .ivu-poptip {
            width: 100%;
        }

        & /deep/ .ivu-poptip-rel {
            width: 100%;
        }

        & /deep/ .ivu-card {
            width: 100%;
        }

        & /deep/ .ivu-col {
            margin-top: 20px;
        }
    }

    .description {
        margin-top: 30px;
        margin-left: 40px;
    }

    .cnt {
        position: relative;
        height: 100%;
        cursor: pointer;
        color: #666;
        background-color: rgb(207, 221, 252);

        .title {
            position: relative;
            z-index: 1;
            line-height: 50px;
            font-size: 22px;
            text-align: left;
            margin-left: 20px;
        }

        .bg {
            z-index: 0;
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            background-size: contain;
            background-position: center center;
        }

        .default-bg {
            @include sprite($template-logo);
            background-size: auto;
        }
    }

    .ivu-card.selected {
        box-shadow: 2px 2px 10px #c8c8c8;
    }
</style>
