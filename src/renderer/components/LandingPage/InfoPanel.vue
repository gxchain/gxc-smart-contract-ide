<template>
    <Layout class="infoPanel">
        <!--<Icon type="ios-arrow-down"/>-->
        <!--<Icon type="ios-arrow-up"/>-->
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
                logger: new Logger()
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

<style lang="scss" scoped>
    .infoPanel {
        flex-grow: 0;
        flex-basis: auto;
        flex-shrink: 0;
        z-index: 4;
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
