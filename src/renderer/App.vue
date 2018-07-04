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
  export default {
      name: 'gxb-wallet-2'
  }
</script>

<style>
  /* CSS */
</style>
