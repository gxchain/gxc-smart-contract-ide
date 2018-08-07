<template>
    <Layout class="infoPanel">
        <Icon type="ios-arrow-down"/>
        <Icon type="ios-arrow-up"/>
        <Tabs class="tab-layout" type="card" :animated="false">
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
                <tree-view v-if="!!abi" :data="abi"></tree-view>
            </TabPane>
        </Tabs>
    </Layout>
</template>

<script>
    import Logger from '@/util/logger'

    export default {
        name: 'infoPanel',
        data() {
            return {
                logger: new Logger()
            }
        },
        props: {
            bytecode: String,
            abi: Object
        },
        mounted() {
            this.$eventBus.$on('log:push', (log) => {
                this.renderLog(log)
            })
        }
    }
</script>

<style scoped>

</style>
