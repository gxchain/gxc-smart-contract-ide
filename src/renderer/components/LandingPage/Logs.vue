<template>
    <div class="logs-layout">
        <p class="log-item" :class="{'error':log.level==='error'}" v-for="log in logs"><a
                class="time-tag" @click="onTimeClick(log)">[{{log.time|timeFilter}}] </a>{{log.info.message||log.info}}
            <Button class="detail-btn" size="small" v-if="log.info.detail" @click="onShowLogDetail(log)">{{$t('common.detail')}}</Button>
        </p>
    </div>
</template>

<script>
    export default {
        name: 'Logs',
        props: {
            logs: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        methods: {
            // copy
            onTimeClick(log) {
                const clipboard = require('electron').clipboard

                if (clipboard) {
                    clipboard.writeText(JSON.stringify(log.info, 4, null))
                    this.$Message.success(this.$t('common.messages.copySuc'))
                }
            },
            onShowLogDetail(log) {
                this.$Modal.confirm({
                    okText: this.$t('common.copy'),
                    title: this.$t('common.detail'),
                    width: 600,
                    render: () => {
                        if (typeof log.info.detail === 'string') {
                            return (<div style={{'max-height': '300px', 'overflow': 'auto'}}>{log.info.detail}</div>)
                        } else if (typeof log.info === 'object') {
                            return (
                                <div style={{'max-height': '300px', 'overflow': 'auto'}}>
                                    <tree-view data={log.info.detail}></tree-view>
                                </div>
                            )
                        }
                    },
                    onOk: () => {
                        const clipboard = require('electron').clipboard

                        if (clipboard) {
                            clipboard.writeText(JSON.stringify(log.info.detail, 4, null))
                            this.$Message.success(this.$t('common.messages.copySuc'))
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped type="text/scss" lang="scss">
    .logs-layout {
        .error {
            color: red;
        }
    }

    .log-item {
        margin: 10px 0;
        user-select: auto;

        &:first-child {
            margin-top: 0;
        }
    }

    .time-tag {
        color: #2d8cf0;
    }

    .detail-btn{
        padding: 0 7px;
    }
</style>
