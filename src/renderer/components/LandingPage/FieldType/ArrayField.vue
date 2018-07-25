<template>
    <div class="array-layout">
        <h3>{{name}}
            <Icon type="plus" @click="onAddItemClick"></Icon>
        </h3>
        <single v-for="(item,idx) in items" :type="type">
            <Icon type="minus" @click="onRemoveItemClick(idx)"></Icon>
        </single>
    </div>
</template>

<script>
    import Single from './Single'

    export default {
        name: 'ArrayField',
        components: {
            Single
        },
        data() {
            return {
                items: [{}]
            }
        },
        props: {
            // 参数名称
            name: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: '',
                required: true
            }
        },
        methods: {
            getValue() {
                return this.$children.filter((child) => {
                    return child.$options.name === 'Single'
                }).map((comp) => {
                    return comp.getValue()
                })
            },
            onAddItemClick() {
                this.addItem()
            },
            addItem() {
                this.items.push({})
            },
            onRemoveItemClick(idx) {
                this.removeItem(idx)
            },
            removeItem(idx) {
                if (this.items.length === 1) {
                    return
                }

                this.items.splice(idx, 1)
            }
        }
    }
</script>

<style scoped>
    h3 {
        margin-top: 6px;
        font-size: 12px;
        color: #9090c8;
    }
</style>
