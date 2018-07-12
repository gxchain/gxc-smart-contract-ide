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

                    <Button class="compileBtn" type="primary" @click="onCompile">编译</Button>
                    <Select v-model="entry" class="entry-select" placeholder="请选择入口文件">
                        <Option v-for="item in files" :value="item.title" :key="item.id">{{ item.title }}</Option>
                    </Select>
                    <Input v-model="contractName" placeholder="合约名称"></Input>
                    <Button class="deployBtn" type="primary" @click="onDeploy">部署</Button>
                    <Button class="callBtn" type="primary" @click="onCall">调用</Button>
                </Sider>

                <!--功能面板预留-->
                <!--<Sider hide-trigger :style="{background: '#fff'}">-->
                <!--</Sider>-->
            </Layout>

        </Layout>
        <!--密码提示框-->
        <Modal :loading="passwordConfirmModalLoading" v-model="passwordConfirmModalVisible" @on-ok="onPasswordOk">
            <Input v-model="tempPwd" title="解锁钱包" placeholder="请输入密码"/>
        </Modal>
        <!--部署确认提示-->
        <Modal
                class="confirmDeployModal"
                v-model="confirmDeployModalVisible"
                title="部署确认"
                @on-ok="onDeployOk"
                @on-cancel="onDeployCancel">
            <p>合约名称:{{contractName}}</p>
            <p>部署账户:{{currentWallet.account}}</p>
            <p>手续费类型:GXS</p>
            <p>部署费用:{{fee}}</p>
        </Modal>
    </div>
</template>

<script>
    import SystemInformation from './LandingPage/SystemInformation'
    import FileTree from './common/FileTree'
    import CodePanel from './LandingPage/CodePanel'
    import CopyBtn from '@/components/common/CopyBtn.vue'
    import AdmZip from 'adm-zip'
    import {mapState} from 'vuex'
    import {call_contract, deploy_contract, unlock_wallet} from '@/services/WalletService'
    // import {ops} from 'gxbjs/es/index.js'

    export default {
        name: 'landing-page',
        data() {
            return {
                passwordConfirmModalLoading: true,
                deployTransaction: null,
                passwordConfirmModalVisible: false,
                confirmDeployModalVisible: false,
                contractName: '',
                currentFee: {},
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
                ],
                // temp
                tempPwd: ''
            }
        },
        created() {

            // console.log('pppwekr', ops.abi_def.fromObject(JSON.parse(abi)))
            // setTimeout(() => {
            //     serialize_contract_call_args('testlzy11', 'hi', {
            //         user: 342
            //     }).then(function (ret) {
            //         console.log('suc', ret)
            //     }).catch(ex => {
            //         console.error('fail', ex)
            //     })
            // }, 1000)

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
        mounted() {
            this.$store.dispatch('updateApiServersLatency')
            this.setCurrentFee()
            // this.onDeploy()
            // TODO temp test
            this.bytecode = '0061736d0100000001711360037f7e7f0060047f7e7f7e0060027f7e006000006000017e60017f0060017e006000017f60027f7f017f60037f7f7f017f60027f7f0060047e7e7e7e017f60067e7e7e7e7f7f017f60047f7e7f7f0060037e7e7e0060047f7f7e7f0060047f7f7f7f0060037f7e7f017f60017f017f0298021003656e760561626f7274000303656e7610616374696f6e5f646174615f73697a65000703656e761063757272656e745f7265636569766572000403656e760c63757272656e745f74696d65000403656e760b64625f66696e645f693634000b03656e760a64625f6765745f693634000903656e760d64625f72656d6f76655f693634000503656e760c64625f73746f72655f693634000c03656e760d64625f7570646174655f693634000d03656e760a6778625f617373657274000a03656e76066d656d637079000903656e76067072696e7469000603656e76067072696e7473000503656e76087072696e74735f6c000a03656e76077072696e747569000603656e7610726561645f616374696f6e5f64617461000803201f080808070e00080108020802080f0f05100a09110a0f120812051205050903040501700105050503010001077c09066d656d6f72790200165f5a6571524b3131636865636b73756d32353653315f0010165f5a6571524b3131636865636b73756d31363053315f0011165f5a6e65524b3131636865636b73756d31363053315f0012036e6f770013056170706c790014066d616c6c6f63002604667265650029066d656d636d70002d090b010041000b052e1719151b0ae7321f0b00200020014120102d450b0b00200020014120102d450b0d00200020014120102d4100470b0a00100342c0843d80a70ba30201017f4100410028020441d0006b2203360204024020012000520d0020032001370348024002400240200242ffffffffffffffc93f550d0020024280808a9acde89cc746510d0120024280808a9acde89ca932520d032003410036023c2003410136023820032003290338370210200341c8006a200341106a10181a0c030b20024280808080808080ca3f510d0120024280808080808080c0eb00520d02200341003602342003410236023020032003290330370218200341c8006a200341186a101a1a0c020b200341003602442003410336024020032003290340370208200341c8006a200341086a10161a0c010b2003410036022c2003410436022820032003290328370220200341c8006a200341206a101a1a0b4100200341d0006a3602040bf80101037f4100410028020441306b2205360204200541286a4100360200200520013703102005427f3703182005420037032020052000290300370308024002400240200541086a200229030841c005102322002903002002290300520d00200541086a20001024200528022022030d010c020b20052002360200200541086a200020012005102520052802202203450d010b02400240200541246a220428020022022003460d000340200241686a220228020021002002410036020002402000450d002000102b0b20032002470d000b200541206a28020021020c010b200321020b200420033602002002102b0b4100200541306a3602040b880305037f017e017f017e027f410028020441e0006b2204210941002004360204200128020421022001280200210841002101024010012203450d00024002402003418104490d002003102621010c010b410020042003410f6a4170716b22013602040b20012003100f1a0b200941186a41106a220642003703002009420037032020094200370318410141301009410041f0001009200941186a20014108100a1a200941186a41086a2204200141086a4108100a1a2006200141106a4108100a1a02402003418104490d00200110290b200941306a41086a2201200441086a2903003703002009290318210520092004290300370330200941c0006a41086a200129030037030020092009290330370340200020024101756a210102402002410171450d00200128020020086a28020021080b200941d0006a41086a200941c0006a41086a2903002207370300200941086a41086a20073703002009200929034022073703502009200737030820012005200941086a20081100004100200941e0006a36020441010bc20203017f017e027f4100410028020441c0006b220736020420072001370338200741306a4100360200200720013703182007427f370320200742003703282007200029030022053703100240024002402005200142808080c0f3a9d388322002290308100422004100480d00200741106a2000101c2200280210200741106a46419001100920072002360208410141d0011009200741106a20004200200741086a101d200728022822040d010c020b2007200236020c2007200741386a3602082007200741106a2003200741086a101e20072802282204450d010b024002402007412c6a220628020022022004460d000340200241686a220228020021002002410036020002402000450d002000102b0b20042002470d000b200741286a28020021020c010b200421020b200620043602002002102b0b4100200741c0006a3602040ba60305037f027e017f017e027f410028020441e0006b2204210a41002004360204200128020421022001280200210941002101024010012203450d00024002402003418104490d002003102621010c010b410020042003410f6a4170716b22013602040b20012003100f1a0b200a41106a41106a22074200370300200a4200370318200a4200370310410141301009410041f0001009200a4200370328200a41106a20014108100a1a200a41106a41086a2204200141086a4108100a1a2007200141106a4108100a1a200a41106a41186a2207200141186a4108100a1a02402003418104490d00200110290b200a41306a41086a2201200441086a290300370300200a2903102105200a200429030037033020072903002106200a41c0006a41086a2001290300370300200a200a290330370340200020024101756a210102402002410171450d00200128020020096a28020021090b200a41d0006a41086a200a41c0006a41086a2903002208370300200a41086a2008370300200a200a2903402208370350200a200837030020012005200a200620091101004100200a41e0006a36020441010b0a004120100c2001100e0bcb0103017f017e037f410028020441106b22042106410020043602042001280204210220012802002105024002400240024010012201450d002001418104490d012001102621040c020b410021040c020b410020042001410f6a4170716b22043602040b20042001100f1a0b20064200370308200641086a20044108100a1a2006290308210302402001418104490d00200410290b200020024101756a210102'
            this.abi = `{
  "____comment": "This file was generated by gxb-abigen. DO NOT EDIT - 2018-07-11T08:30:24",
  "version": "gxb::abi/1.0",
  "types": [{
      "new_type_name": "account_name",
      "type": "uint64"
    },{
      "new_type_name": "symbol_name",
      "type": "uint64"
    }
  ],
  "structs": [{
      "name": "subbalance",
      "base": "",
      "fields": [{
          "name": "owner",
          "type": "account_name"
        },{
          "name": "value",
          "type": "asset"
        }
      ]
    },{
      "name": "addbalance",
      "base": "",
      "fields": [{
          "name": "owner",
          "type": "account_name"
        },{
          "name": "value",
          "type": "asset"
        },{
          "name": "ram_payer",
          "type": "account_name"
        }
      ]
    },{
      "name": "getbalance",
      "base": "",
      "fields": [{
          "name": "owner",
          "type": "account_name"
        },{
          "name": "sym",
          "type": "symbol_name"
        }
      ]
    },{
      "name": "hi",
      "base": "",
      "fields": [{
          "name": "user",
          "type": "account_name"
        }
      ]
    },{
      "name": "bye",
      "base": "",
      "fields": [{
          "name": "user",
          "type": "account_name"
        }
      ]
    }
  ],
  "actions": [{
      "name": "subbalance",
      "type": "subbalance",
      "ricardian_contract": ""
    },{
      "name": "addbalance",
      "type": "addbalance",
      "ricardian_contract": ""
    },{
      "name": "getbalance",
      "type": "getbalance",
      "ricardian_contract": ""
    },{
      "name": "hi",
      "type": "hi",
      "ricardian_contract": ""
    },{
      "name": "bye",
      "type": "bye",
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
        components: {SystemInformation, FileTree, CodePanel, CopyBtn},
        computed: {
            ...mapState('ContractOperation', ['files']),
            ...mapState(['wallets', 'currentWallet', 'assets']),
            fee() {
                if (!this.deployTransaction) {
                    return 0
                } else {
                    return this.deployTransaction.serialize().operations[0][1].fee.amount / Math.pow(10, this.currentFee.precision)
                }
            }
        },
        watch: {
            assets: function () {
                this.setCurrentFee()
            }
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
                this.passwordConfirmModalVisible = true
            },
            onCall() {
                call_contract(this.currentWallet.account, 'sdklfjwer', '1.3.1', '123123', true).then((resp) => {
                    console.log('called', resp)
                }).catch(ex => {
                    console.error('cclclclclclcl', ex)
                })
            },
            onDeployOk() {
                deploy_contract({
                    from: this.currentWallet.account,
                    fee_id: this.currentFee.id,
                    password: this.tempPwd,
                    broadcast: true,
                    abi: this.abi,
                    contractName: this.contractName,
                    code: this.bytecode
                }).then((resp) => {
                    this.deployTransaction = resp
                }).catch(ex => {
                    console.error('deploy contract fail', ex)
                })
            },
            onDeployCancel() {
                console.log('cacncncncn')
            },
            onPasswordOk() {
                unlock_wallet(this.currentWallet.account, this.tempPwd).then(() => {
                    this.passwordConfirmModalVisible = false
                    this.confirmDeployModalVisible = true
                    return deploy_contract({
                        from: this.currentWallet.account,
                        fee_id: this.currentFee.id,
                        password: this.tempPwd,
                        broadcast: false,
                        abi: this.abi,
                        contractName: this.contractName,
                        code: this.bytecode
                    }).then((resp) => {
                        this.deployTransaction = resp
                    }).catch(ex => {
                        console.error('deploy contract fail', ex)
                    })
                }).catch(ex => {
                    this.$Message.error(ex.message)
                    this.passwordConfirmModalLoading = false
                    this.$nextTick(() => {
                        this.passwordConfirmModalLoading = true
                    })
                })
            },
            setCurrentFee() {
                this.currentFee = this.assets[0]
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

    }
</style>
