<template>
    <div id="app">
        <Layout class="hd-layout">
            <Header class="hd" style="height: 64px;">
                <router-link class="logo" :to="{name:'landing-page'}"></router-link>
                <!--<Button @click="testAddContract">添加合约(test)</Button>-->
                <div class="right">
                    <Dropdown v-if="wallets.length>0" class="accountSelect" trigger="click" @on-click="onWalletChange">
                        <account-image :account="currentWallet.account" :size="15"></account-image>
                        <span class="text">{{$t('header.account')}}</span>
                        <DropdownMenu slot="list">
                            <DropdownItem class="account-item"
                                    :class="{'z-sel':wallet.account === currentWallet.account}"
                                    v-for="wallet in wallets" :name="wallet.account">{{wallet.account}}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <router-link class="setting" :to="{name:'setting-page'}">
                        <Icon type="md-settings"></Icon>
                        <span class="text">{{$t('header.setting')}}</span>
                    </router-link>

                    <Dropdown trigger="click" @on-click="onLanguageSelect">
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="lang|iconclass"></use>
                        </svg>
                        <DropdownMenu slot="list">
                            <DropdownItem v-for="lang in langText" :name="lang.symbol">{{lang.text}}</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </Header>
        </Layout>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <Layout>
            <Footer class="layout-footer f-cf">
                <div class="f-fl">
                    <div class="status-item">
                        <a class="link" @click="onDocumentClick">{{$t('statusbar.document')}}</a>
                    </div>
                    <div class="status-item">
                        <a class="link" @click="onFeedbackClick">{{$t('statusbar.feedback')}}</a>
                    </div>
                </div>
                <div class="f-fr">
                    <div class="status-item">
                        <i v-if="currentApiServerStatus==='open' || currentApiServerStatus=='reconnect'"
                                class="blue-lamp"></i>
                        <i v-else class="pink-lamp"></i>
                        <Tooltip placement="top">
                            <a class="text">{{$t('statusbar.currentApiServer')}}</a>
                            <div slot="content">
                                <Button v-if="currentApiServerStatus!=='open' && currentApiServerStatus!=='reconnect'"
                                        type="error" size="small" shape="circle"
                                        icon="md-refresh"
                                        @click="onReconnectClick"></Button>
                                {{currentApiServer.url}}
                            </div>
                        </Tooltip>
                    </div>
                    <div class="status-item">
                        <i class="blue-lamp"></i>
                        <Tooltip :content="currentCompileServer.url" placement="top">
                            <a class="text">{{$t('statusbar.currentCompileServer')}}</a>
                        </Tooltip>
                    </div>
                </div>
            </Footer>
        </Layout>
    </div>
</template>

<script>
    import {locale} from 'iview'
    import {mapActions, mapState} from 'vuex'
    import {lang2IconClassMap, langText} from '@/const/i18n'
    import AccountImage from '@/components/common/AccountImage'
    import {reconnect} from '@/services/connect'
    import {SWITCH_LANG} from '@/const/eventBus'
    import {ipcRenderer} from 'electron'

    import en from 'iview/dist/locale/en-US'
    import zh from 'iview/dist/locale/zh-CN'

    // import * as testAbi from '../../test/unit/data/abi'

    export default {
        name: 'gxb-wallet-2',
        components: {
            AccountImage
        },
        computed: {
            ...mapState(['wallets', 'currentWallet', 'currentCompileServer', 'currentApiServer', 'currentApiServerStatus'])
        },
        data() {
            return {
                lang: localStorage.getItem('lang'),
                langText
            }
        },
        methods: {
            ...mapActions(['updateCurrentBalancesAndAssets', 'changeWallet']),
            onLanguageSelect(lang) {
                if (lang === 'zh-CN') {
                    locale(zh)
                } else {
                    locale(en)
                }
                this.$i18n.locale = lang
                this.setLang(lang)
            },
            onWalletChange(account) {
                this.changeWallet(account)
            },
            onReconnectClick() {
                reconnect()
            },
            onDocumentClick() {
                this.$logUtil.logClick('documentClick')
                this.$electron.remote.shell.openExternal('https://docs.gxchain.org/zh/guide/contract.html')
            },
            onFeedbackClick() {
                this.$logUtil.logClick('feedbackClick')
                this.$electron.remote.shell.openExternal('http://blockcity.mikecrm.com/1WDrQXM')
            },
            setLang(lang) {
                this.$eventBus.$emit(SWITCH_LANG, lang)
                localStorage.setItem('lang', lang)
                this.lang = lang
            }
            // testAddContract() {
            //     this.$store.dispatch('ContractOperation/appendContract', {
            //         abi: testAbi.case1,
            //         from: 'lzydophin94',
            //         contractName: 'test' + new Date(),
            //         contractId: new Date() + ''
            //     }, {root: true})
            // }
        },
        filters: {
            'iconclass': (lang) => {
                return '#' + lang2IconClassMap[lang]
            }
        },
        created() {
            // rpc连接消息，如果直接在connect回调中触发消息，由于需要locales，所以会引发多重循环引用，导致程序出错
            this.$eventBus.$on('connect:open', () => {
                this.$Message.success(this.$t('connect.success'))
            }, this)

            this.$eventBus.$on('connect:closed', () => {
                this.$Message.warning(this.$t('connect.closed'))
            }, this)

            this.$eventBus.$on('connect:error', () => {
                this.$Message.error(this.$t('connect.error'))
            }, this)
        },
        mounted() {
            const animationEntry = document.getElementById('entry-animation-wrap')
            animationEntry.classList.add('z-hide')

            const date = new Date()

            ipcRenderer.on('send-init-time', function (event, initTime) {
                console.log(`render time:${date - initTime},initTime:${initTime}`)
            })
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    @import '@styles/sprite.scss';

    .logo {
        display: inline-block;
        width: 113px;
        height: 32px;
        margin-top: 20px;
        background-size: cover;

        background: url('~logo.svg');
    }

    .hd-layout {
        // fix windows background-image white border bug
        background: #151935;
    }

    .hd {
        position: relative;
        z-index: 902;
        -webkit-app-region: drag;
        background: url('~top-banner.png');
        background-size: 100%;
        background-repeat: no-repeat;
        padding: 0 35px;

        .setting {
            margin-right: 25px;
            color: #c4c3d3;

            .ivu-icon {
                font-size: 14px;
            }
        }

        .right {
            float: right;
        }

        .ivu-icon-gear-b {
            font-size: 16px;
            vertical-align: middle;
        }

        canvas {
            vertical-align: middle;
        }

        .text {
            vertical-align: middle;
            color: #c4c3d3;
        }

        .accountSelect {
            margin-right: 25px;
            cursor: pointer;
        }

        // TODO 不生效

        /*& >>> .ivu-select-dropdown {*/
        /*top: 50px;*/
        /*}*/
    }

    .layout-footer {
        height: 32px;
        line-height: 32px;
        padding: 0 35px;
        background: #1c2340;
    }

    .account-item {

        &.z-sel {
            background: rgba(40, 123, 211, .91);
            color: #fff;
        }

    }

    .status-item {
        display: inline-block;
        .text {
            position: relative;
            left: -6px;
            color: #c4c3d3;
        }

        .link {
            color: rgb(111, 153, 248);
            text-decoration: underline;
            margin-right: 20px;
        }
    }

    .pink-lamp {
        vertical-align: middle;
        display: inline-block;
        @include sprite($pink-lamp);
    }

    .blue-lamp {
        vertical-align: middle;
        display: inline-block;
        @include sprite($blue-lamp);
    }

    .icon {
        cursor: pointer;
        position: relative;
        top: 8px;
        font-size: 30px;
    }


</style>
