<template>
    <div class="layout">
        <Select v-model="currentUrl">
            <Option v-for="item in compileServers" :value="item.url" :key="item.url">
                {{item.location}} ({{ item.url }})-Latency:{{item.latency}}
            </Option>
        </Select>
        <div class="btn-group">
            <Button type="primary" class="addCompileServer" @click="onAddCompileServerClick">添加服务器</Button>
            <Button type="error" @click="onRemoveCompileServerClick">移除服务器</Button>
        </div>
        <Modal
                class="addCompileModal"
                v-model="addCompileModalVisible"
                title="添加服务器"
                @on-ok="onAddOk"
                @on-cancel="onAddCancel">
            <Input placeholder="请输入服务器url" v-model="url"/>
        </Modal>
        <Modal
                class="removeCompileModal"
                v-model="removeCompileModalVisible"
                title="移除服务器"
                @on-ok="onRemoveOk">
            <Select v-model="removeUrl" placeholder="请选择服务器">
                <Option v-for="item in compileServers" :value="item.url" :key="item.url">
                    {{item.location}} ({{ item.url }})-Latency:{{item.latency}}
                </Option>
            </Select>
        </Modal>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'CompileServer',
        data() {
            return {
                addCompileModalVisible: false,
                url: 'http://',
                removeCompileModalVisible: false,
                removeUrl: ''
            }
        },
        computed: {
            ...mapState(['currentCompileServer', 'compileServers']),
            currentUrl: {
                get: function () {
                    return this.currentCompileServer.url
                },
                set: function (v) {
                    this.$store.dispatch('changeCurrentCompileServer', v)
                    return v
                }
            }
        },
        methods: {
            onAddCompileServerClick() {
                this.addCompileModalVisible = true
            },
            onRemoveCompileServerClick() {
                this.removeCompileModalVisible = true
            },
            onAddOk() {
                this.$store.dispatch('addCompileServer', this.url).then((flag) => {
                    if (flag) {
                        this.$Message.warning(this.$t('compileServer.exist'))
                    }
                })
                this.resetAddModal()
            },
            onAddCancel() {
                this.resetAddModal()
            },
            resetAddModal() {
                this.url = 'http://'
            },
            onRemoveOk() {
                this.$store.dispatch('removeCompileServer', this.removeUrl).then(() => {
                    this.removeUrl = ''
                })
            }
        }
    }
</script>

<style scoped>
    .btn-group{
        margin-top: 20px;
    }

    .addCompileServer{
        margin-right: 10px;
    }
</style>
