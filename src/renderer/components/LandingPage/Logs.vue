<template>
    <div class="logs-layout">
        <p class="log-item" :class="{'error':log.level==='error'}" v-for="log in logs"><span class="time-tag">[{{log.time|timeFilter}}] </span>{{log.info}}</p>
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

    .time-tag{
        color: #2d8cf0;
    }
</style>
