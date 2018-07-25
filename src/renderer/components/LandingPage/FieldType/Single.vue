<template>
    <div class="single-layout">
        <slot></slot>
        <h3 v-if="!!name">{{name}}</h3>
        <template v-if="type==='asset'">
            <Select v-model="asset_id" class="asset-select" placeholder="请选择资产类型">
                <Option v-for="asset in formatBalances" :value="asset.id" :key="asset.id">{{ asset.symbol }}</Option>
            </Select>
            <Input class="asset-amount" placeholder="资产数量" v-model="amount"/>
        </template>
        <template v-else>
            <Input v-model="value" :placeholder="type"/>
        </template>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'Single',
        data() {
            return {
                value: '',
                asset_id: '',
                amount: null
            }
        },
        computed: {
            ...mapGetters(['formatBalances'])
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
                if (this.type === 'asset') {
                    return {
                        asset_id: this.asset_id,
                        amount: +this.amount
                    }
                } else {
                    return this.value
                }
            }
        }
    }
</script>

<style scoped>
    .single-layout{
        position: relative;
    }

    h3 {
        margin-top: 6px;
        font-size: 12px;
        color: #9090c8;
    }

    .asset-select {
        width: 80px;
        margin-right: 6px;
    }

    .asset-amount {
        width: 160px;
    }
</style>
