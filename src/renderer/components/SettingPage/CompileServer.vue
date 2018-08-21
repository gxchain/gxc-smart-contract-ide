<template>
    <div class="layout">
        <Select v-model="currentUrl">
            <Option v-for="item in compileServers" :value="item.url" :key="item.url">
                {{item.location}} ({{ item.url }})
            </Option>
        </Select>
        <div class="btn-group">
            <Button type="primary" class="addCompileServer" @click="onAddCompileServerClick">
                {{$t('compileServer.addCompileServer')}}
            </Button>
            <Button type="error" @click="onRemoveCompileServerClick">{{$t('compileServer.removeCompileServer')}}
            </Button>
        </div>
        <Modal
                class="addCompileModal"
                v-model="addCompileModalVisible"
                :title="$t('compileServer.addCompileServer')"
                @on-ok="onAddOk"
                @on-cancel="onAddCancel">
            <Input :placeholder="$t('compileServer.placeholder.addCompileServer')" v-model="url"/>
        </Modal>
        <Modal
                class="removeCompileModal"
                v-model="removeCompileModalVisible"
                :title="$t('compileServer.removeCompileServer')"
                @on-ok="onRemoveOk">
            <Select v-model="removeUrl" :placeholder="$t('compileServer.placeholder.removeCompileServer')">
                <Option v-for="item in compileServers" :value="item.url" :key="item.url">
                    {{item.location}} ({{ item.url }})
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
                        this.$Message.warning(this.$t('compileServer.messages.exist'))
                    } else {
                        this.$logUtil.logClick('addCompileServerSuc')
                        this.$Message.success(this.$t('compileServer.messages.addSuc'))
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
                    this.$Message.success(this.$t('compileServer.messages.removeSuc'))
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

    .addCompileServer {
        margin-right: 10px;
    }
</style>
