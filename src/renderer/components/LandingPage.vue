<template>
    <div class="layout">
        <Layout>
            <Header>
                <!--<Icon type="plus" @click="onClick"></Icon>-->
                <Button class="compileBtn" type="primary">编译</Button>
                <Select v-model="entry" class="entry-select" placeholder="请选择入口文件">
                    <Option v-for="item in files" :value="item.title" :key="item.id">{{ item.title }}</Option>
                </Select>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    <file-tree @on-select-change="onFileSelect"></file-tree>
                </Sider>
                <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                    <code-panel></code-panel>
                </Content>
                <!--功能面板预留-->
                <!--<Sider hide-trigger :style="{background: '#fff'}">-->
                <!--</Sider>-->
            </Layout>
            <Footer class="layout-footer">
                <Tabs type="card" :animated="false">
                    <TabPane label="LOGS">标签一的内容</TabPane>
                    <TabPane label="BYTECODE">标签二的内容</TabPane>
                    <TabPane label="ABI">标签三的内容</TabPane>
                </Tabs>
            </Footer>
        </Layout>
    </div>
</template>

<script>
    import SystemInformation from './LandingPage/SystemInformation'
    import FileTree from './common/FileTree'
    import CodePanel from './LandingPage/CodePanel'
    import AdmZip from 'adm-zip'
    import {mapState} from 'vuex'

    export default {
        name: 'landing-page',
        data() {
            return {
                entry: ''
            }
        },
        components: {SystemInformation, FileTree, CodePanel},
        computed: mapState('ContractOperation', ['files']),
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            onClick() {

            },
            onFileSelect(evt) {
                // TODO code panel里面用index，file tree用nodekey，这里进行转换，因为files没有被注入nodekey，考虑优化
                // this.current = evt[0].nodeKey - 1
                console.log('teststtss')
            },
            archiveFiles() {
                // creating archives
                var zip = new AdmZip()

                // TODO 改this.files
                this.files.forEach(function (file) {
                    zip.addFile(file.title, Buffer.alloc(file.code.length, file.code), 'entry comment goes here')
                })
                // get everything as a buffer
                // var willSendthis = zip.toBuffer();
                // or write everything to disk
                zip.writeZip('./files.zip')
            }
        }
    }
</script>

<style scoped>
    .ivu-icon-plus {
        color: white;
        font-size: 20px;
    }

    .layout-footer {
        height: 250px;
    }

    .entry-select {
        width: 200px;
        float: right;
    }

    .compileBtn {
        float: right;
    }
</style>
