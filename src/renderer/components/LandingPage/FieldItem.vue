<template>
    <div class="layout">
        <template v-if="type==='asset'">
            <h3>{{name}}</h3>
            <Select v-model="mValueForAsset.asset_id" class="asset-select" placeholder="请选择资产类型">
                <Option v-for="asset in assets" :value="asset.id" :key="asset.id">{{ asset.id }}</Option>
            </Select>
            <Input class="asset-amount" placeholder="资产数量" v-model="mValueForAsset.amount"/>
        </template>
        <template v-else>
            <h3>{{name}}</h3><Input v-model="mValue" :placeholder="type"/>
        </template>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'FieldItem',
        props: {
            name: String,
            type: String,
            value: null
        },
        watch: {
            'mValue': function () {
                this.$emit('update:value', this.mValue)
            },
            'mValueForAsset.asset_id': function () {
                this.$emit('update:value', this.mValueForAsset)
            },
            'mValueForAsset.amount': function () {
                this.$emit('update:value', this.mValueForAsset)
            }
        },
        computed: {
            ...mapState(['assets'])
        },
        data() {
            return {
                mValueForAsset: {},
                mValue: ''
            }
        }
    }
</script>

<style scoped>
    h3{
        margin-top: 6px;
        font-size: 12px;
        color:#9090c8;
    }

    .asset-select{
        width: 60px;
        margin-right: 6px;
    }

    .asset-amount{
        width: 150px;
    }
</style>
