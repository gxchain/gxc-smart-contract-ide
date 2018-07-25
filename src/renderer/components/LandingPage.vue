<template>
    <div class="layout">
        <Layout class="layout-container" style="flex-direction: row">
            <Sider hide-trigger style="background:#151935;height:100%;overflow:auto;color:white;overflow-x:hidden;"
                   width="240">
                <file-tree ref="filetree" @on-select-change="onFileSelect"></file-tree>
            </Sider>
            <Layout style="flex-direction: column;height:100%;overflow: auto;">
                <Content :style="{padding: '20px', background: '#fff', 'flex-basis':0, height:'calc(100vh - 346px)'}">
                    <template v-if="files.length>0">
                        <code-panel></code-panel>
                    </template>
                    <template v-else>
                        <div class="empty-add-file">
                            <i @click="onAddFileClick" class="icon-add-file"></i>
                            <p class="desc">{{$t('files.addFile')}}</p>
                        </div>
                    </template>
                </Content>
                <Layout style="height: 250px;flex-shrink:0;flex-grow:0;z-index:4;">
                    <Tabs class="tab-layout" type="card" :animated="false">
                        <TabPane label="LOGS">
                            <logs :logs="logger.logs"></logs>
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
            </Layout>
            <Sider class="rightPane" width="320" style="height:100%;overflow: auto;">
                <div class="operation-panel">
                    <div class="compile-area">
                        <Select v-model="entry" class="entry-select" :placeholder="$t('contract.chooseEntryFile')">
                            <Option v-for="item in files" :value="item.title" :key="item.id">{{ item.title }}</Option>
                        </Select>
                        <Button class="compileBtn" type="ghost" :loading="isCompiling" @click="onCompileClick">
                            {{$t('index.compile')}}
                        </Button>
                    </div>
                    <div class="deploy-area">
                        <Input class="contractName" v-model="contractName"
                               :placeholder="$t('contract.inputContractName')"></Input>
                        <Button class="deployBtn" type="ghost" @click="onDeploy">{{$t('contract.deploy')}}</Button>
                    </div>
                </div>
                <contract-list></contract-list>
            </Sider>
        </Layout>
        <!--部署确认提示-->
        <Modal
                class="confirmDeployModal"
                v-model="confirmDeployModalVisible"
                title="部署确认"
                @on-ok="onDeployOk">
            <p>合约名称:{{contractName}}</p>
            <p>部署账户:{{currentWallet.account}}</p>
            <p>手续费类型:{{tempAsset.symbol}}</p>
            <p>部署费用:{{fee}}</p>
        </Modal>
    </div>
</template>

<script>
    import FileTree from './common/FileTree'
    import CodePanel from './LandingPage/CodePanel'
    import CopyBtn from '@/components/common/CopyBtn.vue'
    import ContractList from './LandingPage/ContractList'
    import AdmZip from 'adm-zip'
    import Logger from '@/util/logger'
    import Logs from './LandingPage/Logs'
    import PasswordConfirmModal from '@/components/common/PasswordConfirmModal'
    import {mapState, mapActions} from 'vuex'
    import {
        deploy_contract
    } from '@/services/WalletService'

    export default {
        name: 'landing-page',
        components: {Logs, FileTree, CodePanel, CopyBtn, ContractList},
        data() {
            return {
                deployTransaction: null,
                confirmDeployModalVisible: false,
                contractName: '',
                entry: '',
                bytecode: '',
                abi: '',
                logger: new Logger(),
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
                ],
                isCompiling: false,
                tempPwd: '',
                tempAsset: {}
            }
        },
        computed: {
            ...mapState('ContractOperation', ['files']),
            ...mapState(['wallets', 'currentWallet', 'assets']),
            fee() {
                if (!this.deployTransaction) {
                    return 0
                } else {
                    return this.deployTransaction.serialize().operations[0][1].fee.amount / Math.pow(10, this.tempAsset.precision)
                }
            }
        },
        mounted() {
            this.$eventBus.$on('log.push', (log) => {
                this.renderLog(log)
            })
        },
        methods: {
            ...mapActions('ContractOperation', ['appendContract']),
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
            onCompileClick() {
                if (!this.entry) {
                    this.$Message.warning('请先选择入口文件')
                    return
                }

                // 压缩文件，调用编译服务
                var buffer = this.archiveFiles(this.entry)

                var data = new FormData()
                data.append('bundle', new Blob([buffer]), 'bundle.zip')

                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }

                this.isCompiling = true

                this.$http.post(this.$store.state.currentCompileServer.url + '/upload', data, config)
                    .then((res) => {
                        this.isCompiling = false
                        if (res.data.status === 'success') {
                            this.compileSuc(res.data)
                        } else {
                            this.compileFail(res.data)
                        }
                    })
                    .catch((err) => {
                        this.isCompiling = false
                        this.compileFail(err)
                        console.log('errrrr', err)
                    })
            },
            compileSuc(res) {
                this.$Message.success('编译成功')
                this.renderLog({info: res.stdout, level: 'success'})
                this.renderBytecode(res.wasm)
                this.renderAbi(res.abi)
            },
            compileFail(res) {
                this.$Message.error('编译失败')
                this.renderLog({info: res.stderr || res.message, level: 'error'})
                this.renderBytecode('')
                this.renderAbi('')
            },
            renderLog(log) {
                this.logger.push(log)
            },
            renderBytecode(bytecode) {
                this.bytecode = bytecode
            },
            renderAbi(abi) {
                this.abi = abi ? JSON.parse(abi) : ''
            },
            onDeploy() {
                if (!this.currentWallet.account) {
                    this.$Modal.confirm({
                        title: '前往导入账户',
                        content: '您还未导入账户，是否前往导入账户？',
                        onOk: () => {
                            this.$router.push({name: 'import-recover'})
                        }
                    })
                    return
                }
                // 如果没有编译过，需要先编译
                if (!this.bytecode) {
                    this.$Message.warning('Please compile first')
                    return
                }
                if (!this.contractName) {
                    this.$Message.warning('请输入合约名称')
                    return
                } else if (!/^[~a-z0-9-]*$/.test(this.contractName)) {
                    this.$Message.warning('合约名只能是字母、数字和-的组合')
                    return
                }
                // this.$refs.pwdModal
                const modal = new PasswordConfirmModal({
                    i18n: this.$i18n
                })
                modal.$on('unlocked', ({pwd, asset_id, asset}) => {
                    return deploy_contract({
                        from: this.currentWallet.account,
                        fee_id: asset_id,
                        password: pwd,
                        broadcast: false,
                        abi: this.abi,
                        contractName: this.contractName,
                        code: this.bytecode
                    }).then((resp) => {
                        this.deployTransaction = resp
                        this.tempPwd = pwd
                        this.tempAsset = asset
                        this.confirmDeployModalVisible = true
                    }).catch(ex => {
                        this.$Message.error(`${ex.message}`)
                    })
                })
            },
            onDeployOk() {
                deploy_contract({
                    from: this.currentWallet.account,
                    fee_id: this.tempAsset.id,
                    password: this.tempPwd,
                    broadcast: true,
                    abi: this.abi,
                    contractName: this.contractName,
                    code: this.bytecode
                }).then((resp) => {
                    this.$Message.success('合约部署成功')
                    this.$eventBus.$emit('log.push', {
                        info: '部署成功',
                        level: 'success'
                    })
                    // 将部署过的合约保存在本地
                    this.appendContract(resp[0].ext)
                    this.$store.dispatch('updateCurrentBalancesAndAssets')
                }).catch(ex => {
                    this.$Message.error(`deploy contract fail:${ex.message}`)
                    this.$eventBus.$emit('log.push', {
                        info: '部署失败',
                        level: 'error'
                    })
                })
            },
            onAddFileClick() {
                this.$refs.filetree.append()
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/sprite.scss';

    .layout-container {
        height: calc(100vh - 64px - 32px);
    }

    .ivu-icon-plus {
        color: white;
        font-size: 20px;
    }

    .entry-select {
        width: 180px;
        margin-right: 15px;
    }

    .contractName {
        width: 180px;
        margin-right: 15px;
    }

    .compileBtn, .deployBtn {
        width: 75px;
        border-color: #6699ff;
        color: #6699ff;
    }

    .rightPane {
        background: #151935;
    }

    .operation-panel {
        border-top: 1px solid #313754;
        padding: 20px;
    }

    .entry-select /deep/ .ivu-select-selection, .contractName /deep/ .ivu-input {
        background: black;
        color: #9090c8;
        border: 1px solid #9090c8;

        &:hover {
            border-color: #6699ff;
        }
    }

    .deploy-area {
        margin-top: 20px;
    }

    .empty-add-file {
        .icon-add-file {
            margin: auto;
            display: block;
            cursor: pointer;
            transform: scale(0.5);
            @include sprite($add-file);
        }

        .desc {
            text-align: center;
            font-size: 20px;
            color: #999;
            margin-top: -40px;
        }
    }
</style>
