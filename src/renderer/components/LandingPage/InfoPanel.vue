<template>
    <Layout :class="{isFold:isFold}" class="infoPanel">
        <Tabs class="infoPanel" type="card" :animated="false">
            <div class="fold-trigger" slot="extra">
                <Icon v-if="!isFold" @click="onToggleClick(true)" type="ios-arrow-down"/>
                <Icon v-if="isFold" @click="onToggleClick(false)" type="ios-arrow-up"/>
            </div>
            <TabPane label="LOGS">
                <div class="logs-wrap" style="height: 100%;" @contextmenu="onLogRightClick">
                    <logs :logs="logger.logs"></logs>
                </div>
            </TabPane>
            <TabPane label="WASM">
                {{bytecode}}
                <copy-btn v-if="!!bytecode" :value="bytecode"></copy-btn>
            </TabPane>
            <TabPane label="ABI">
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
    import {INFO_PANEL_TOGGLE} from '@/const/eventBus'

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
                log.time = new Date()
                this.logger.push(log)
            })
        },
        methods: {
            onLogRightClick() {
                this.menu.popup(remote.getCurrentWindow())
            },
            onToggleClick(flag) {
                this.isFold = flag
                this.$eventBus.$emit(INFO_PANEL_TOGGLE, flag)
            }
        }
    }
</script>

<style scoped lang="scss" type="text/scss">
    .infoPanel {
        position: relative;
        flex-grow: 0;
        flex-basis: auto;
        z-index: 4;

        &.isFold {
            & /deep/ .ivu-tabs-content {
                height: 0;
            }
        }
    }

    .fold-trigger {
        margin-right: 4px;
        font-size: 16px;

        .ivu-icon {
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
