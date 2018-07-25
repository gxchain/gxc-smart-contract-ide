<template>
    <div class="fields-layout">
        <field-item v-for="field in data" :name="field.name" :type="field.type"></field-item>
    </div>
</template>

<script>
    import FieldItem from './FieldItem'

    export default {
        name: 'Fields',
        components: {
            FieldItem
        },
        props: {
            data: {
                type: Array,
                default: []
            }
        },
        methods: {
            getValue() {
                return this.$children.map((comp) => {
                    return comp.getValue()
                })
            },
            getFields() {
                return this.$children.map((comp) => {
                    return comp.getField()
                })
            }
        }
    }
</script>

<style scoped>

</style>
