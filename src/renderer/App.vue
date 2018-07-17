<template>
    <div id="app">
        <Layout>
            <Header>

                <router-link :to="{name:'landing-page'}">主页</router-link>
                <router-link :to="{name:'setting-page'}">setting-page</router-link>
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

    export default {
        name: 'gxb-wallet-2',
        computed: {
            ...mapState(['currentWallet', 'lang', 'currentCompileServer', 'currentApiServer'])
        },
        data() {
            return {
                langText
            }
        },
        methods: {
            ...mapActions(['updateCurrentBalancesAndAssets', 'setLang']),
            onLanguageSelect(lang) {
                this.setLang(lang)
            }
        },
        created() {
            // TODO 需要在跟rpc建立连接后，添加connect事件
            setTimeout(() => {
                this.updateCurrentBalancesAndAssets()
            }, 3000)
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
