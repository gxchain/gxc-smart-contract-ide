<template>
    <div class="layout">
        <Select v-model="currentUrl">
            <Option v-for="item in apiServers" :value="item.url" :key="item.url">
                {{item.location}} ({{ item.url }})-Latency:{{item.latency}}
            </Option>
        </Select>
        <div class="btn-group">
            <Button class="addPoint" type="primary" @click="onAddApiServerClick">{{$t('apiServer.addEntryPoint')}}</Button>
            <Button type="error" @click="onRemoveApiServerClick">{{$t('apiServer.removeEntryPoint')}}</Button>
        </div>
        <Modal
                class="addApiModal"
                v-model="addApiModalVisible"
                :title="$t('apiServer.addEntryPoint')"
                @on-ok="onAddOk"
                @on-cancel="onAddCancel">
            <Input :placeholder="$t('apiServer.placeholder.addEntryPoint')" v-model="url"/>
        </Modal>
        <Modal
                class="removeApiModal"
                v-model="removeApiModalVisible"
                :title="$t('apiServer.removeEntryPoint')"
                @on-ok="onRemoveOk">
            <Select v-model="removeUrl" :placeholder="$t('apiServer.placeholder.removeEntryPoint')">
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
        activated() {
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
                        this.$Message.warning(this.$t('apiServer.messages.exist'))
                    } else {
                        this.$Message.success(this.$t('apiServer.messages.addSuc'))
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
                    this.$Message.success(this.$t('apiServer.messages.removeSuc'))
                    this.removeUrl = ''
                })
            }
        }
    }
</script>

<style scoped>
    .btn-group {
        margin-top: 20px;
    }

    .addPoint {
        margin-right: 10px;
    }
</style>
