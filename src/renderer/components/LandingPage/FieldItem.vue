<template>
    <div class="fieldItem-layout">
        <template v-if="isFieldArray">
            <array-field ref="arr" :name="name" :type="type|arrayTypeFormat"></array-field>
        </template>
        <template v-else>
            <Single ref="single" :name="name" :type="type"></Single>
        </template>
    </div>
</template>

<script>
    import ArrayField from './FieldType/ArrayField'
    import Single from './FieldType/Single'

    export default {
        name: 'FieldItem',
        components: {
            ArrayField,
            Single
        },
        props: {
            name: String,
            type: String
        },
        data() {
            return {
                value: null
            }
        },
        computed: {
            isFieldArray() {
                if (this.type.indexOf('[]') !== -1) {
                    return true
                } else {
                    return false
                }
            }
        },
        methods: {
            getValue() {
                if (this.isFieldArray) {
                    return this.$refs.arr.getValue()
                } else {
                    return this.$refs.single.getValue()
                }
            },
            getField() {
                return {
                    name: this.name,
                    type: this.type,
                    value: this.getValue()
                }
            }
        },
        filters: {
            arrayTypeFormat(value) {
                return value.split('[')[0]
            }
        }
    }
</script>

<style scoped>

</style>
