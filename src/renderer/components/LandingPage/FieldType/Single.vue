<template>
    <div class="single-layout">
        <slot></slot>
        <h3 v-if="!!name">{{name}}</h3>
        <template v-if="type==='asset'">
            <Select v-model="asset_id" class="asset-select" :placeholder="$t('common.placeholder.assetType')">
                <Option v-for="asset in formatBalances" :value="asset.id" :key="asset.id">{{ asset.symbol }}</Option>
            </Select>
            <Input class="asset-amount" :placeholder="$t('common.placeholder.assetAmount')" v-model="amount"/>
        </template>
        <template v-else-if="type==='contract_asset'">
            <Select v-model="asset_id" class="asset-select" :placeholder="$t('common.placeholder.assetType')">
                <Option v-for="asset in formatBalances" :value="asset.id|assetIdFormat" :key="asset.id">
                    {{ asset.symbol}}
                </Option>
            </Select>
            <Input class="asset-amount" :placeholder="$t('common.placeholder.assetAmount')" v-model="amount"/>
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
                if (this.type === 'asset' || this.type === 'contract_asset') {
                    return {
                        asset_id: this.asset_id,
                        amount: +this.amount
                    }
                } else {
                    return this.value
                }
            }
        },
        filters: {
            // asset_id 在 type 为contract_asset时需要处理为uint64型
            assetIdFormat(value) {
                return +value.split('.')[2]
            }
        }
    }
</script>

<style scoped>
    .single-layout {
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
