<template>
    <div class="layout">
        <Layout class="layout-container" style="flex-direction: row">
            <Sider hide-trigger style="background:#151935;height:100%;overflow:auto;color:white;" width="240">
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
                            <p class="desc">add file</p>
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
                        <Select v-model="entry" class="entry-select" placeholder="请选择入口文件">
                            <Option v-for="item in files" :value="item.title" :key="item.id">{{ item.title }}</Option>
                        </Select>
                        <Button class="compileBtn" type="ghost" :loading="isCompiling" @click="onCompileClick">
                            {{$t('index.compile')}}
                        </Button>
                    </div>
                    <div class="deploy-area">
                        <Input class="contractName" v-model="contractName" placeholder="合约名称"></Input>
                        <Button class="deployBtn" type="ghost" @click="onDeploy">部署</Button>
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
            <p>手续费类型:{{tempAsset.id}}</p>
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
        mounted() {
            // TODO temp test
            this.bytecode = '0061736d01000000012d0960027f7e006000017f60027f7f017f60037f7f7f017f60017f0060017e0060000060037e7e7e0060017f017f02570503656e7610616374696f6e5f646174615f73697a65000103656e76066d656d637079000303656e76067072696e7473000403656e76077072696e747569000503656e7610726561645f616374696f6e5f646174610002030d0c020202070002080208040306040501700102020503010001077608066d656d6f72790200165f5a6571524b3131636865636b73756d32353653315f0005165f5a6571524b3131636865636b73756d31363053315f0006165f5a6e65524b3131636865636b73756d31363053315f0007056170706c790008066d616c6c6f63000b0466726565000e066d656d636d70000f0908010041000b0210090a8a0e0c0b00200020014120100f450b0b00200020014120100f450b0d00200020014120100f4100470b6301017f4100410028020441206b2203360204024020012000520d002003200137031820024280808080808080c0eb00520d00200341003602142003410136021020032003290310370208200341186a200341086a100a1a0b4100200341206a3602040b1a004110100220011003412010024110100220011003412010020bcb0103017f017e037f410028020441106b22042106410020043602042001280204210220012802002105024002400240024010002201450d002001418104490d012001100b21040c020b410021040c020b410020042001410f6a4170716b22043602040b2004200110041a0b20064200370308200641086a2004410810011a2006290308210302402001418104490d002004100e0b200020024101756a210102402002410171450d00200128020020056a28020021050b2001200320051100004100200641106a36020441010b080041242000100c0bb904010c7f02402001450d00024020002802c041220d0d004110210d200041c0c1006a41103602000b200141086a200141046a41077122026b200120021b210202400240024020002802c441220a200d4f0d002000200a410c6c6a4180c0006a21010240200a0d0020004184c0006a220d2802000d0020014180c000360200200d20003602000b200241046a210a034002402001280208220d200a6a20012802004b0d002001280204200d6a220d200d28020041808080807871200272360200200141086a22012001280200200a6a360200200d200d28020041808080807872360200200d41046a22010d030b2000100d22010d000b0b41fcffffff0720026b2104200041c8c1006a210b200041c0c1006a210c20002802c8412203210d03402000200d410c6c6a22014180c0006a210620014184c0006a280200220541046a210d0340200520062802006a2107200d417c6a2208280200220941ffffffff07712101024020094100480d000240200120024f0d000340200d20016a220a20074f0d01200a280200220a4100480d012001200a41ffffffff07716a41046a22012002490d000b0b20082001200220012002491b200941808080807871723602000240200120024d0d00200d20026a200420016a41ffffffff07713602000b200120024f0d040b200d20016a41046a220d2007490d000b41002101200b4100200b28020041016a220d200d200c280200461b220d360200200d2003470d000b0b20010f0b2008200828020041808080807872360200200d0f0b41000b870501087f20002802c44121010240024041002d00f041450d0041002802f44121070c010b3f002107410041013a00f0414100200741107422073602f4410b200721030240024002400240200741ffff036a41107622023f0022084d0d00200220086b40001a4100210820023f00470d0141002802f44121030b41002108410020033602f44120074100480d0020002001410c6c6a210220074180800441808008200741ffff037122084181f8034922061b6a2008200741ffff077120061b6b20076b2107024041002d00f0410d003f002103410041013a00f0414100200341107422033602f4410b20024180c0006a210220074100480d01200321060240200741076a417871220520036a41ffff036a41107622083f0022044d0d00200820046b40001a20083f00470d0241002802f44121060b4100200620056a3602f4412003417f460d0120002001410c6c6a22014184c0006a2802002206200228020022086a2003460d020240200820014188c0006a22052802002201460d00200620016a2206200628020041808080807871417c20016b20086a72360200200520022802003602002006200628020041ffffffff07713602000b200041c4c1006a2202200228020041016a220236020020002002410c6c6a22004184c0006a200336020020004180c0006a220820073602000b20080f0b02402002280200220820002001410c6c6a22034188c0006a22012802002207460d0020034184c0006a28020020076a2203200328020041808080807871417c20076b20086a72360200200120022802003602002003200328020041ffffffff07713602000b2000200041c4c1006a220728020041016a22033602c0412007200336020041000f0b2002200820076a36020020020b7b01037f024002402000450d0041002802e44122024101480d0041a4c00021032002410c6c41a4c0006a21010340200341046a2802002202450d010240200241046a20004b0d00200220032802006a20004b0d030b2003410c6a22032001490d000b0b0f0b2000417c6a2203200328020041ffffffff07713602000b4901037f4100210502402002450d000240034020002d0000220320012d00002204470d01200141016a2101200041016a21002002417f6a22020d000c020b0b200320046b21050b20050b0300000b0b1b030041040b04006100000041100b0568692c20000041200b020a00'
            this.abi = `{
  "____comment": "This file was generated by gxb-abigen. DO NOT EDIT - 2018-07-23T02:58:59",
  "version": "gxb::abi/1.0",
  "types": [{
      "new_type_name": "account_name",
      "type": "uint64"
    }
  ],
  "structs": [{
      "name": "hi",
      "base": "",
      "fields": [{
          "name": "user",
          "type": "account_name"
        }
      ]
    }
  ],
  "actions": [{
      "name": "hi",
      "type": "hi",
      "ricardian_contract": ""
    }
  ],
  "tables": [],
  "ricardian_clauses": [],
  "error_messages": [],
  "abi_extensions": []
}`
            this.abi = JSON.parse(this.abi)
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
                // 入口文件空判断
                if (!this.entry) {
                    this.$Message.warning('请先选择入口文件')
                    return
                }

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

                this.isCompiling = true

                this.$http.post('http://localhost:3000/upload', data, config)
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
                // this.renderLog(res.stdout)
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
                if (!this.contractName) {
                    this.$Message.warning('请输入合约名称')
                    return
                }
                // this.$refs.pwdModal
                const modal = new PasswordConfirmModal()
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
                    // 将部署过的合约保存在本地
                    this.appendContract(resp[0].ext)
                    this.$store.dispatch('updateCurrentBalancesAndAssets')
                }).catch(ex => {
                    this.$Message.error(`deploy contract fail:${ex.message}`)
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
        width: 200px;
        margin-right: 15px;
    }

    .contractName {
        width: 200px;
        margin-right: 15px;
    }

    .network-point {
        width: 200px;
        float: left;
    }

    .compileBtn, .deployBtn {
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
