<template>
    <div class='wrapper' style='height: 100%;'>
        <codemirror v-if="!!file.id" :options='cmOption' :value='file.content' @input='onInput'></codemirror>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    import ut from '@/util/util.js'
    import {cloneDeep} from 'lodash'

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
            ...mapState('ContractFiles', ['currentOpenedFile']),
            file() {
                return cloneDeep(this.currentOpenedFile)
            }
        },
        methods: {
            ...mapActions('ContractFiles', ['changeFileContent']),
            onInput: ut.debounce(function (content) {
                this.changeFileContent({
                    target: this.file,
                    // can not use file.content here cause the input value hasn't sync yet
                    content: content
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
