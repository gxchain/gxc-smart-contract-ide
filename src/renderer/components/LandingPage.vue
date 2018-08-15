<template>
    <div class="layout">
        <Layout class="layout-container" style="flex-direction: row">
            <Sider hide-trigger style="background:#151935;height:100%;overflow:auto;color:white;overflow-x:hidden;"
                    width="240">
                <fTree ref="tree"></fTree>
            </Sider>
            <Layout style="flex-direction: column;height:100%;overflow: auto;">
                <Content class="code-wrap">
                    <template v-if="projects.length>0">
                        <code-panel></code-panel>
                    </template>
                    <template v-else>
                        <div class="empty-add-file">
                            <i @click="onAddProjectClick" class="icon-add-file"></i>
                            <p class="desc">{{$t('files.addProject')}}</p>
                        </div>
                    </template>
                </Content>
                <info-panel :bytecode="bytecode" :abi="abi"></info-panel>
            </Layout>
            <Sider class="rightPane" width="320" style="height:100%;overflow: auto;">
                <div class="operation-panel">
                    <div class="compile-area">
                        <Select v-model="entry" class="entry-select" :placeholder="$t('contract.chooseProject')">
                            <Option v-for="project in projects" :value="project.id" :key="project.id">{{ project.title
                                }}
                            </Option>
                        </Select>
                        <Button class="compileBtn" type="primary" ghost :loading="isCompiling" @click="onCompileClick">
                            {{$t('index.compile')}}
                        </Button>
                    </div>
                    <div class="deploy-area">
                        <Input class="contractName" v-model="contractName"
                                :placeholder="$t('contract.inputContractName')"></Input>
                        <Button class="deployBtn" type="primary" ghost @click="onDeploy">{{$t('contract.deploy')}}
                        </Button>
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
            <Form class="pure-text-form" label-position="left" :label-width="120">
                <FormItem :label="$t('contract.label.name')">{{contractName}}</FormItem>
                <FormItem :label="$t('contract.label.entryProject')">{{entryProjectName}}</FormItem>
                <FormItem :label="$t('contract.label.deployAccount')">{{currentWallet.account}}</FormItem>
                <FormItem :label="$t('contract.label.costAmount')">{{tempAsset.symbol}}, {{fee}}</FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import FTree from './LandingPage/FTree'
    import CodePanel from './LandingPage/CodePanel'
    import ContractList from './LandingPage/ContractList'
    import InfoPanel from './LandingPage/InfoPanel'
    import AdmZip from 'adm-zip'
    import PasswordConfirmModal from '@/components/common/PasswordConfirmModal'
    import {mapState, mapGetters, mapActions} from 'vuex'
    import {contractNameFormat} from '@base/rule/contract'
    import {
        deploy_contract
    } from '@/services/WalletService'
    import electron from 'electron'

    const ipcRenderer = electron.ipcRenderer

    export default {
        name: 'landing-page',
        components: {InfoPanel, FTree, CodePanel, ContractList},
        data() {
            return {
                deployTransaction: null,
                confirmDeployModalVisible: false,
                contractName: '',
                entry: '',
                bytecode: '',
                abi: {},
                isCompiling: false,
                tempPwd: '',
                tempAsset: {}
            }
        },
        computed: {
            ...mapGetters('ContractFiles', ['projects']),
            ...mapState(['wallets', 'currentWallet', 'assets']),
            fee() {
                if (!this.deployTransaction) {
                    return 0
                } else {
                    return this.deployTransaction.serialize().operations[0][1].fee.amount / Math.pow(10, this.tempAsset.precision)
                }
            },
            entryProjectName() {
                const project = this.projects.find(project => project.id === this.entry)
                return project ? project.title : ''
            }
        },
        created() {
            ipcRenderer.on('import-project', (event, project) => {
                this.$refs.tree.showEditDirectoryNameModal({
                    name: project.title,
                    title: this.$t('template.title.create'),
                    callback: (name) => {
                        project.title = name
                        this.$store.dispatch('ContractFiles/addProject', project, {root: true})
                    }
                })
            })
        },
        methods: {
            ...mapActions('ContractOperation', ['appendContract']),
            archiveFiles(entry) {
                function recur(zip, files, base = '') {
                    files.forEach(function (file) {
                        if (file.isDirectory) {
                            zip.addFile(base + file.title + '/', Buffer.alloc(0))
                            recur(zip, file.children, base + file.title + '/')
                        } else {
                            zip.addFile(base + file.title, Buffer.alloc(file.content.length, file.content))
                        }
                    })
                }

                // creating archives
                var zip = new AdmZip()

                var files = this.projects.find(project => {
                    return project.id === entry
                }).children

                recur(zip, files)
                // zip.writeZip('/Users/jaime/tests/temptest/temp-zip/test.zip')
                return zip.toBuffer()
            },
            existEntryFile(entryProjectId) {
                var files = this.projects.find(project => {
                    return project.id === entryProjectId
                }).children
                const entryFile = files.find(file => file.title === 'app.json')
                return !!entryFile
            },
            onCompileClick() {
                if (!this.entry) {
                    this.$Message.warning(this.$t('contract.validate.entryProject.required'))
                    return
                }

                if (!this.existEntryFile(this.entry)) {
                    this.$Message.error(this.$t('contract.validate.entryFile.required'))
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
                        this.compileFail(err.response.data)
                    })
            },
            compileSuc(res) {
                this.$Message.success(this.$t('contract.messages.compileSuc'))
                this.renderLog({info: res.stdout, level: 'success'})
                this.renderBytecode(res.wasm)
                this.renderAbi(res.abi)
            },
            compileFail(res) {
                this.$Message.error(this.$t('contract.messages.compileFail'))
                this.renderLog({info: res.stderr || res.message, level: 'error'})
                this.renderBytecode('')
                this.renderAbi()
            },
            renderLog(log) {
                this.$eventBus.$emit('log:push', log)
            },
            renderBytecode(bytecode) {
                this.bytecode = bytecode
            },
            renderAbi(abi) {
                this.abi = abi ? JSON.parse(abi) : {}
            },
            onDeploy() {
                if (!this.currentWallet.account) {
                    this.$Modal.confirm({
                        title: this.$t('common.title.guideToImport'),
                        content: this.$t('common.content.guideToImport'),
                        onOk: () => {
                            this.$router.push({name: 'import-recover'})
                        }
                    })
                    return
                }
                // 如果没有编译过，需要先编译
                if (!this.bytecode) {
                    this.$Message.warning(this.$t('contract.validate.needToCompileFirst'))
                    return
                }
                if (!this.contractName) {
                    this.$Message.warning(this.$t('contract.validate.name.required'))
                    return
                } else if (!contractNameFormat.test(this.contractName)) {
                    this.$Message.warning(this.$t('contract.validate.name.format'))
                    return
                }
                // this.$refs.pwdModal
                const modal = new PasswordConfirmModal({
                    // 必须在这里调用
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
                        this.renderLog({info: ex.message, level: 'error'})
                        this.$Message.error(this.$t('contract.error.feeCompute'))
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
                    this.renderLog({
                        info: this.$t('contract.messages.deploySuc'),
                        level: 'success'
                    })
                    this.$Message.success(this.$t('contract.messages.deploySuc'))
                    // 将部署过的合约保存在本地
                    this.appendContract(resp[0].ext)
                    this.$store.dispatch('updateCurrentBalancesAndAssets')
                }).catch(ex => {
                    this.renderLog({info: ex.message, level: 'error'})
                    this.$Message.error(this.$t('contract.messages.deployFail'))
                    this.$eventBus.$emit('log:push', {
                        info: this.$t('contract.messages.deployFail'),
                        level: 'error'
                    })
                })
            },
            onAddProjectClick() {
                this.$refs.tree.onAddProjectClick()
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    @import '@styles/sprite.scss';

    .layout-container {
        height: calc(100vh - 64px - 32px);
    }

    .filetree-layout {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .filetree-layout /deep/ .files-wrap {
        flex-grow: 1;
    }

    .code-wrap {
        height: 0;
        flex-grow: 1;
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
        text-overflow: ellipsis;
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
