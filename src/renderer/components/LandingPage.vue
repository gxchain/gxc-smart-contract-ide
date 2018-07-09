<template>
    <div class="layout">
        <Layout>

            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    <file-tree @on-select-change="onFileSelect"></file-tree>
                </Sider>
                <Layout>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                        <code-panel></code-panel>
                    </Content>
                    <Layout>
                        <Tabs type="card" :animated="false">
                            <TabPane label="LOGS">{{log}}</TabPane>
                            <TabPane label="BYTECODE">
                                {{bytecode}}
                                <copy-btn :value="bytecode"></copy-btn>
                            </TabPane>
                            <TabPane label="ABI">
                                <tree-view :data="abi"></tree-view>
                            </TabPane>
                        </Tabs>
                    </Layout>
                </Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    右边功能面板
                    <Select v-model="networkPoint" class="network-point" placeholder="请选择接入点">
                        <Option v-for="item in networkPoints" :value="item.value" :key="item.id">{{ item.title }}
                        </Option>
                    </Select>
                    <Button class="compileBtn" type="primary" @click="onCompile">编译</Button>
                    <Select v-model="entry" class="entry-select" placeholder="请选择入口文件">
                        <Option v-for="item in files" :value="item.title" :key="item.id">{{ item.title }}</Option>
                    </Select>
                    <Button class="compileBtn" type="primary" @click="onDeploy">部署</Button>
                </Sider>

                <!--功能面板预留-->
                <!--<Sider hide-trigger :style="{background: '#fff'}">-->
                <!--</Sider>-->
            </Layout>

        </Layout>
    </div>
</template>

<script>
    import SystemInformation from './LandingPage/SystemInformation'
    import FileTree from './common/FileTree'
    import CodePanel from './LandingPage/CodePanel'
    import CopyBtn from '@/components/common/CopyBtn.vue'
    import AdmZip from 'adm-zip'
    import {mapState} from 'vuex'
    import {deploy_contract} from '@/services/WalletService'

    export default {
        name: 'landing-page',
        data() {
            return {
                entry: '',
                bytecode: '',
                abi: '',
                log: '',
                networkPoint: '',
                networkPoints: [
                    {
                        title: '线上网络',
                        id: 0,
                        value: 0
                    },
                    {
                        title: '测试网络',
                        id: 1,
                        value: 1
                    }
                ]
            }
        },
        created() {
            // this.$http('test.json', {
            //     params: {
            //         ID: 12345
            //     }
            // }).then((response) => {
            //     this.onReceiveCompileResult(response.data)
            // })
            //     .catch(function (error) {
            //         console.log('errrrrrrr', error)
            //     })
        },
        components: {SystemInformation, FileTree, CodePanel, CopyBtn},
        computed: {
            ...mapState('ContractOperation', ['files']),
            ...mapState(['wallets', 'currentWallet'])
        },
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
            archiveFiles(entryName) {
                // creating archives
                var zip = new AdmZip()

                // TODO 改this.files
                this.files.forEach(function (file) {
                    zip.addFile(file.title, Buffer.alloc(file.code.length, file.code))
                })

                var entryFile = {
                    name: 'app.json',
                    content: `{"main":"${entryName}"}`
                }

                zip.addFile('app.json', Buffer.alloc(entryFile.content.length, entryFile.content))
                // get everything as a buffer
                return zip.toBuffer()
                // or write everything to disk
                // zip.writeZip('./files.zip')
            },
            onCompile() {
                // 入口文件空判断

                // 压缩文件，调用编译服务
                var buffer = this.archiveFiles(this.entry)

                var data = new FormData()
                data.append('bundle', new Blob([buffer]), 'bundle.zip')
                // var config = {
                //     onUploadProgress: function (progressEvent) {
                //         console.log('progggg', progressEvent)
                //     }
                // }

                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }

                this.$http.post('http://localhost:3000/upload', data, config)
                    .then((res) => {
                        console.log('succccc', res)
                        this.onReceiveCompileResult(res.data)
                    })
                    .catch(function (err) {
                        console.log('errrrr', err)
                    })
            },
            onReceiveCompileResult(res) {
                if (res.status === 'success') {
                    this.renderSuc(res)
                } else {
                    this.renderFail(res)
                }
            },
            renderSuc(res) {
                this.renderLog(res.stdout)
                this.renderBytecode(res.wasm)
                this.renderAbi(res.abi)
                // this.renderLog(res.stdout)
            },
            renderFail(res) {
                console.log(res)
            },
            renderLog(log) {
                this.log = log
            },
            renderBytecode(bytecode) {
                this.bytecode = bytecode
            },
            renderAbi(abi) {
                this.abi = JSON.parse(abi)
                // console.log('kkkkk', JSON.parse(abi))
            },
            onDeploy() {
                deploy_contract(this.currentWallet.account, '1.3.1', '123123', true).then((resp) => {
                    console.log('delopyed', resp)
                }).catch(ex => {
                    console.error('fiifififif', ex)
                })
            }
        }
    }
</script>

<style scoped>
    .ivu-icon-plus {
        color: white;
        font-size: 20px;
    }

    .entry-select {
        width: 200px;
        float: right;
    }

    .network-point {
        width: 200px;
        float: left;
    }

    .compileBtn {
        float: right;
    }
</style>
