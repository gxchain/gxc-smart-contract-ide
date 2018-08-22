<template>
    <div class="tool-item">
        <base-tool :title="title" :description="description">
            tool pane
        </base-tool>
    </div>
</template>

<script>
    import BaseTool from './BaseTool'

    export default {
        name: 'GenerateKeyPair',
        components: {BaseTool},
        data() {
            return {
                title: 'test',
                description: 'dkdkdk'
            }
        },
        methods: {}
    }
</script>

<style type="text/scss" lang="scss" scoped>

</style>
