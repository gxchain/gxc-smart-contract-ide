<template>
    <Layout :class="{isFold:isFold}" class="infoPanel">
        <div class="fold-trigger">
            <Icon v-if="!isFold" @click="isFold=true" type="ios-arrow-down"/>
            <Icon v-if="isFold" @click="isFold=false" type="ios-arrow-up"/>
        </div>
        <Tabs class="infoPanel" type="card" :animated="false">
            <TabPane label="LOGS">
                <div class="logs-wrap" style="height: 100%;" @contextmenu="onLogRightClick">
                    <logs :logs="logger.logs"></logs>
                </div>
            </TabPane>
            <TabPane label="BYTECODE">
                {{bytecode}}
                <copy-btn v-if="!!bytecode" :value="bytecode"></copy-btn>
            </TabPane>
            <TabPane label="ABI">
                <!--TODO v-if-->
                <tree-view v-if="!isAbiEmpty" :data="abi"></tree-view>
            </TabPane>
        </Tabs>
    </Layout>
</template>

<script>
    import Logger from '@/util/logger'
    import Logs from './Logs'
    import CopyBtn from '@/components/common/CopyBtn.vue'
    import {isEmpty} from 'lodash'

    import electron from 'electron'

    const remote = electron.remote
    const Menu = remote.Menu
    const MenuItem = remote.MenuItem

    export default {
        name: 'infoPanel',
        components: {
            Logs,
            CopyBtn
        },
        data() {
            return {
                logger: new Logger(),
                isFold: false
            }
        },
        computed: {
            isAbiEmpty() {
                return isEmpty(this.abi)
            }
        },
        props: {
            bytecode: String,
            abi: Object
        },
        created() {
            this.menu = new Menu()
            this.menu.append(new MenuItem({
                label: this.$t('log.clear'),
                click: () => {
                    this.logger.clear()
                }
            }))
        },
        mounted() {
            this.$eventBus.$on('log:push', (log) => {
                this.logger.push(log)
            })
        },
        methods: {
            onLogRightClick() {
                this.menu.popup()
            }
        }
    }
</script>

<style scoped lang="scss" type="text/scss">
    .infoPanel {
        position: relative;
        flex-grow: 0;
        flex-basis: auto;
        flex-shrink: 0;
        z-index: 4;

        &.isFold{
            & /deep/ .ivu-tabs-content{
                height: 0;
            }
        }
    }

    .fold-trigger{
        position: absolute;
        right: 10px;
        top: 0;
        z-index: 5;
        font-size: 16px;

        .ivu-icon{
            padding: 8px;
            cursor: pointer;
        }
    }

    .infoPanel /deep/ .ivu-tabs-content {
        transition: .5s height ease-in-out;
        overflow: auto;
        height: 218px;
    }

    .infoPanel /deep/ .ivu-tabs-tabpane {
        padding: 15px;
    }

    .infoPanel /deep/ .ivu-tabs-bar {
        margin-bottom: 0;
    }

    .infoPanel /deep/ .ivu-tabs-tabpane {
        height: 100%;
    }
</style>
