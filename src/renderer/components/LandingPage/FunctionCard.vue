<template>
    <div class="layout">
        <Card>
            <p slot="title">function name:{{name}}</p>
            <field-item v-for="field in fields" :name="field.name" :type="field.type"></field-item>
        </Card>
    </div>
</template>

<script>
    import FieldItem from './FieldItem'

    export default {
        name: 'FunctionCard',
        components: {
            FieldItem
        },
        props: {
            name: {
                type: String,
                default: 'function'
            },
            fields: {
                type: Array,
                default() {
                    return []
                }
            },
            base: {
                type: String,
                default: ''
            }
        }
    }
</script>

<style scoped>

</style>
