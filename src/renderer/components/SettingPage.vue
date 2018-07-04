<template>
    <div class="layout">
        <Layout>
            <Sider>
                <router-link :to="{name:'import-recover'}">导入/恢复</router-link>
            </Sider>
            <Content>
                <router-view></router-view>
            </Content>
        </Layout>
    </div>
</template>

<script>
    export default {
        name: 'SettingPage'
    }
</script>

<style scoped>

</style>
