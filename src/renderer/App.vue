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
                footer
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
            ...mapState(['currentWallet', 'lang'])
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

<style scoped>
    .icon{
        font-size: 30px;
    }
</style>
