<template>
    <div id="app">
        <Layout>
            <Header class="hd" style="height: 64px;">
                <router-link class="logo" :to="{name:'landing-page'}"></router-link>
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
                        <Icon type="gear-b"></Icon>
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
            <Footer class="layout-footer">
                <div class="status-item">
                    <i class="pink-lamp"></i>
                    <Tooltip :content="currentCompileServer.url" placement="top">
                        <a class="text">当前编译服务</a>
                    </Tooltip>
                </div>
                <div class="status-item">
                    <i class="blue-lamp"></i>
                    <Tooltip :content="currentApiServer.url" placement="top">
                        <a class="text">当前接入点</a>
                    </Tooltip>
                </div>
            </Footer>
        </Layout>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex'
    import {lang2IconClassMap, langText} from '@/const/i18n'
    import AccountImage from '@/components/common/AccountImage'

    export default {
        name: 'gxb-wallet-2',
        components: {
            AccountImage
        },
        computed: {
            ...mapState(['wallets', 'currentWallet', 'lang', 'currentCompileServer', 'currentApiServer'])
        },
        data() {
            return {
                langText
            }
        },
        methods: {
            ...mapActions(['updateCurrentBalancesAndAssets', 'setLang', 'changeWallet']),
            onLanguageSelect(lang) {
                this.setLang(lang)
            },
            onWalletChange(account) {
                this.changeWallet(account)
            }
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

            this.$eventBus.$on('connect:reconnectFail', () => {
                this.$Message.error(this.$t('connect.reconnectFail'))
            }, this)
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/sprite.scss';

    .logo {
        display: inline-block;
        width: 113px;
        height: 32px;
        margin-top: 12px;
        background-size: cover;

        background: url('~logo.svg');
    }

    .hd {
        background: url('~top-banner.png');
        background-size: 100%;
        background-repeat: no-repeat;
        padding: 0 35px;

        .setting {
            margin-right: 25px;
            color: #c4c3d3;
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
            background: rgba(40,123,211,.91);
            color: #fff;
        }
    }

    .status-item {
        float: right;

        .text {
            position: relative;
            left: -6px;
            color: #c4c3d3;
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
