<template>
    <div class="layout">
        <Layout class="layout-container">
            <Sider style="background: #151935;">
                <router-link class="nav-item" :to="{name:'import-recover'}">导入/恢复</router-link>
                <router-link class="nav-item" :to="{name:'api-server'}">接入点</router-link>
                <router-link class="nav-item" :to="{name:'compile-server'}">编译服务</router-link>
            </Sider>
            <Content style="padding: 20px 30px;">
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
    .layout-container {
        height: calc(100vh - 64px - 32px);
    }

    .nav-item {
        display: block;
        margin: auto;
        margin-top: 20px;
        width: 120px;
        height: 32px;
        line-height: 32px;
        box-sizing: border-box;
        color: white;
        border: 1px solid #6699ff;
        text-align: center;
    }
</style>
