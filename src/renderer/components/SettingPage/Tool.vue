<template>
    <div class="tool-layout">
        <generate-key-pair></generate-key-pair>
    </div>
</template>

<script>
    import GenerateKeyPair from './Tool/GenerateKeyPair'
    export default {
        components: {
            GenerateKeyPair
        },
        name: 'Tool'
    }
</script>

<style type="text/scss" lang="scss" scoped>
    .tool-layout{
        display: flex;
    }

    .tool-item{
        width: 300px;
        margin-right: 20px;
    }
</style>
