<template>
    <div class="layout">
        <Select v-model="currentUrl">
            <Option v-for="item in apiServers" :value="item.url" :key="item.url">
                {{item.location}} ({{ item.url }})-Latency:{{item.latency}}
            </Option>
        </Select>
        <Button @click="onAddApiServerClick">添加接入点</Button>
        <Button @click="onRemoveApiServerClick">移除接入点</Button>
        <Modal
                class="addApiModal"
                v-model="addApiModalVisible"
                title="添加节点"
                @on-ok="onAddOk"
                @on-cancel="onAddCancel">
            <Input placeholder="请输入节点url" v-model="url"/>
        </Modal>
        <Modal
                class="removeApiModal"
                v-model="removeApiModalVisible"
                title="移除节点"
                @on-ok="onRemoveOk">
            <Select v-model="removeUrl" placeholder="请选择节点">
                <Option v-for="item in apiServers" :value="item.url" :key="item.url">
                    {{item.location}} ({{ item.url }})-Latency:{{item.latency}}
                </Option>
            </Select>
        </Modal>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'ApiServer',
        data() {
            return {
                addApiModalVisible: false,
                url: 'wss://',
                removeApiModalVisible: false,
                removeUrl: ''
            }
        },
        computed: {
            ...mapState(['currentApiServer', 'apiServers']),
            currentUrl: {
                get: function () {
                    return this.currentApiServer.url
                },
                set: function (v) {
                    this.$store.dispatch('changeCurrentApiServer', v)
                    return v
                }
            }
        },
        mounted() {
            this.$store.dispatch('updateApiServersLatency')
        },
        methods: {
            onAddApiServerClick() {
                this.addApiModalVisible = true
            },
            onRemoveApiServerClick() {
                this.removeApiModalVisible = true
            },
            onAddOk() {
                this.$store.dispatch('addApiServer', this.url).then((flag) => {
                    if (flag) {
                        this.$Message.warning(this.$t('apiServer.exist'))
                    }
                })
                this.resetAddModal()
            },
            onAddCancel() {
                this.resetAddModal()
            },
            resetAddModal() {
                this.url = 'wss://'
            },
            onRemoveOk() {
                this.$store.dispatch('removeApiServer', this.removeUrl).then(() => {
                    this.removeUrl = ''
                })
            }
        }
    }
</script>

<style scoped>

</style>
