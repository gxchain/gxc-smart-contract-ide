<template>
    <div id="app">
        <Layout>
            <Header class="hd">
                <div class="right">
                    <router-link :to="{name:'landing-page'}">主页</router-link>
                    <router-link :to="{name:'setting-page'}">
                        <Icon type="gear-b"></Icon>
                        setting-page
                    </router-link>
                    <Dropdown trigger="click" @on-click="onWalletChange">
                        <account-image :account="currentWallet.account" :size="15"></account-image>
                        <DropdownMenu slot="list">
                            <DropdownItem class="account-item"
                                          :class="{'z-sel':wallet.account === currentWallet.account}"
                                          v-for="wallet in wallets" :name="wallet.account">{{wallet.account}}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown trigger="click" style="float:right;" @on-click="onLanguageSelect">

                        <Button type="primary">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="lang|iconclass"></use>
                            </svg>
                            <Icon type="arrow-down-b"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem v-for="lang in langText" :name="lang.symbol">{{lang.text}}</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </Header>
        </Layout>
        <router-view></router-view>
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
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/sprite.scss';

    .hd {
        background: url('~top-banner.png');
        background-size: 100%;
        background-repeat: no-repeat;

        .right {
            float: right;
        }
    }

    .account-item {
        &.z-sel {
            background: #0000cc;
        }
    }

    .status-item {
        float: right;
    }

    .pink-lamp {
        display: inline-block;
        @include sprite($pink-lamp);
    }

    .blue-lamp {
        display: inline-block;
        @include sprite($blue-lamp);
    }

    .icon {
        font-size: 30px;
    }


</style>
