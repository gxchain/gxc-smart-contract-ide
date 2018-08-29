<template>
    <div class='code-panel-layout' style='height: 100%;'>
        <Tabs v-if="files.length>0" :animated="false" type="card" :value="id" closable @on-tab-remove="onTabRemove"
                @on-click="onTabClick">
            <TabPane v-for="file in files" :key="file.id" :name="file.id" :label="file.title">
                <div class="codemirror-wrap">
                    <ace-editor-wrap :file="file" :show="currentOpenedFile.id===file.id"></ace-editor-wrap>
                </div>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    import {cloneDeep} from 'lodash'
    import AceEditorWrap from './AceEditorWrap'

    export default {
        components: {AceEditorWrap},
        computed: {
            ...mapState('ContractFiles', ['currentOpenedFile', 'openedFiles']),
            files() {
                return cloneDeep(this.openedFiles)
            },
            id() {
                return this.currentOpenedFile.id
            }
        },
        methods: {
            ...mapActions('ContractFiles', ['changeFileContent', 'closeOpenedFile', 'changeCurrentOpenedFile']),
            onTabRemove(id) {
                this.closeOpenedFile(id)
            },
            onTabClick(id) {
                this.changeCurrentOpenedFile(id)
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .codemirror-wrap {
        // TODO this shit thing which iview do waste me 3 hours, I will figure it out if I have time, skr
        visibility: visible !important;
        height: 100%;
    }

    .ivu-tabs {
        height: 100%;
    }

    .code-panel-layout {
        & /deep/ .ivu-tabs-tabpane {
            height: 100%;
        }

        & /deep/ .ivu-tabs-bar {
            margin-bottom: 0;
        }

        & /deep/ .ivu-tabs-content {
            height: calc(100% - 32px);
            overflow: auto;
        }
    }

</style>
