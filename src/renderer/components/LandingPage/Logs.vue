<template>
    <div class="logs-layout">
        <p class="log-item" :class="{'error':log.level==='error'}" v-for="log in logs">{{log.info}}</p>
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

<style scoped lang="scss">
    .logs-layout {
        .error {
            color: red;
        }
    }

    .log-item{
        margin: 10px 0;

        &:first-child{
            margin-top: 0;
        }
    }
</style>
