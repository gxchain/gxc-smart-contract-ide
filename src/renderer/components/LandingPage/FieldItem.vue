<template>
    <div class="layout">
        field name:{{name}}
        field type:{{type}}
    </div>
</template>

<script>
    export default {
        name: 'FieldItem',
        props: {
            name: String,
            type: String
        }
    }
</script>

<style scoped>

</style>
