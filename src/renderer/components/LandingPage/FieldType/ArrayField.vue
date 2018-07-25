<template>
    <div class="array-layout">
        <h3 style="position: relative;">{{name}}
            <Icon type="plus" @click="onAddItemClick"></Icon>
        </h3>
        <div class="wrap">
            <single v-for="(item,idx) in items" :type="type">
                <Icon type="minus" @click="onRemoveItemClick(idx)"></Icon>
            </single>
        </div>
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

<style scoped lang="scss">
    h3 {
        margin-top: 6px;
        font-size: 12px;
        color: #9090c8;
    }

    .ivu-icon-plus, .ivu-icon-minus {
        display: none;
        color: #57a3f3;
        font-size: 14px;
        position: absolute;
        left: -20px;
        top: -4px;
        padding: 6px;
        cursor: pointer;
    }

    .ivu-icon-minus {
        color: #d00b0b;
        top: 4px;
    }

    .array-layout{
        &:hover .ivu-icon-plus, &:hover .ivu-icon-minus{
            display: block;
        }

        .single-layout{
            margin-top: 10px;

            &:first-child{
                margin-top: 0;
            }
        }
    }
</style>
