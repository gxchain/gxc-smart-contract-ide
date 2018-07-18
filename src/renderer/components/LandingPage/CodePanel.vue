<template>
    <div class="wrapper">
        <codemirror v-for="panel in panels" :key="panel.id" v-if="panel.selected"
                    :options="cmOption" :value="panel.code" @input="onInput($event,panel)"></codemirror>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    import ut from '@/util/util.js'

    // TODO 无法直接用vue-codemirror，似乎打包有问题，无法执行到defineMode对应的回调，导致渲染异常
    import {codemirror} from 'vue-codemirror/src/index.js'
    import 'codemirror/lib/codemirror.css'

    // language
    import 'codemirror/mode/clike/clike.js'
    // theme css

    export default {
        data() {
            return {
                cmOption: {
                    // tabSize: 4,
                    // styleActiveLine: true,
                    lineNumbers: true,
                    tabSize: 4,
                    line: true
                    // line: true,
                    // lineWrapping: true,
                    // theme: 'default'
                }
            }
        },
        components: {codemirror},
        computed: {
            ...mapState('ContractOperation', ['files']),
            panels() {
                const pnls = this.files.map(function (file) {
                    return Object.assign({}, file)
                })

                return pnls
            }
        },
        methods: {
            ...mapActions('ContractOperation', ['changeContent']),
            onInput: ut.debounce(function (content, panel) {
                this.changeContent({
                    id: panel.id,
                    content
                })
            }, 300)
        }
    }
</script>
