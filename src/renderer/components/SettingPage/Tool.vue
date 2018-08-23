<template>
    <div class="tool-layout">
        <generate-key-pair></generate-key-pair>
        <generate-signature></generate-signature>
    </div>
</template>

<script>
    import GenerateKeyPair from './Tool/GenerateKeyPair'
    import GenerateSignature from './Tool/GenerateSignature'
    export default {
        components: {
            GenerateKeyPair,
            GenerateSignature
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
