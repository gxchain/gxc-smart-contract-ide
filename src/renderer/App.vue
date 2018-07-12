<template>
    <div id="app">
        <Layout>
            <Header>
                <router-link :to="{name:'landing-page'}">主页</router-link>
                <router-link :to="{name:'setting-page'}">setting-page</router-link>
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

    export default {
        name: 'gxb-wallet-2',
        computed: {
            ...mapState(['currentWallet'])
        },
        methods: {
            ...mapActions(['updateCurrentBalancesAndAssets'])
            // fetch_balance() {
            //     let wallet_balances
            //     fetch_account_balances(this.currentWallet.account).then(function (balances) {
            //         if (!balances) {
            //             return
            //         }
            //         let asset_ids = wallet_balances.map(b => {
            //             return b.asset_id
            //         })
            //         return get_assets_by_ids(asset_ids)
            //     }).then(assets => {
            //         this.currentFee = assets[0]
            //     }).catch(ex => {
            //         console.error(ex)
            //     })
            // }
        },
        created() {
            // TODO 需要在跟rpc建立连接后，添加connect事件
            setTimeout(() => {
                this.updateCurrentBalancesAndAssets()
            }, 1000)
        }
    }
</script>

<style>
    /* CSS */
</style>
