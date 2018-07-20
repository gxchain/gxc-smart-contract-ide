<template>
    <div class='wrapper' style='height: 100%;'>
        <codemirror v-for='panel in panels' :key='panel.id' v-if='panel.selected'
                    :options='cmOption' :value='panel.code' @input='onInput($event,panel)'></codemirror>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    import ut from '@/util/util.js'

    // TODO 无法直接用vue-codemirror，似乎打包有问题，无法执行到defineMode对应的回调，导致渲染异常
    import {codemirror} from 'vue-codemirror/src/index.js'
    import 'codemirror/lib/codemirror.css'

    // language
    import 'codemirror/mode/clike/clike'
    import 'codemirror/mode/javascript/javascript'
    // hint
    import 'codemirror/addon/hint/show-hint.css'
    import 'codemirror/addon/hint/show-hint'
    import 'codemirror/addon/hint/anyword-hint'

    // search and replace
    import 'codemirror/addon/dialog/dialog.js'
    import 'codemirror/addon/dialog/dialog.css'
    import 'codemirror/addon/search/search.js'
    import 'codemirror/addon/search/searchcursor.js'
    import 'codemirror/addon/search/jump-to-line.js'

    // fold
    import 'codemirror/addon/fold/foldcode.js'
    import 'codemirror/addon/fold/foldgutter.js'
    import 'codemirror/addon/fold/foldgutter.css'
    import 'codemirror/addon/fold/brace-fold.js'
    import 'codemirror/addon/fold/indent-fold.js'
    import 'codemirror/addon/fold/comment-fold.js'
    import 'codemirror/addon/fold/xml-fold.js'

    import 'codemirror/addon/edit/closebrackets.js'

    export default {
        data() {
            return {
                cmOption: {
                    mode: {
                        name: 'text/x-c++src',
                        useCPP: true
                    },
                    // tabSize: 4,
                    // styleActiveLine: true,
                    lineNumbers: true,
                    tabSize: 4,
                    line: true,
                    extraKeys: {'Alt-F': 'findPersistent'},
                    autoCloseBrackets: true,
                    foldGutter: true,
                    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
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

<style scoped>
    .vue-codemirror {
        height: 100%;
    }

    .vue-codemirror >>> .CodeMirror {
        height: 100%;
    }
</style>
