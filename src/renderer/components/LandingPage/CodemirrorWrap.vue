<template>
    <codemirror ref="cm" :options="cmOption" :value="file.content" @input="onInput($event,file)"></codemirror>
</template>

<script>
    import {mapActions} from 'vuex'
    import {debounce} from 'lodash'
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

    // theme
    import 'codemirror/theme/blackboard.css'

    export default {
        name: 'CodemirrorWrap',
        components: {codemirror},
        data() {
            return {
                cmOption: {
                    mode: {
                        name: 'text/x-c++src',
                        useCPP: true
                    },
                    lineNumbers: true,
                    tabSize: 4,
                    line: true,
                    extraKeys: {'Alt-F': 'findPersistent'},
                    autoCloseBrackets: true,
                    foldGutter: true,
                    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                    theme: 'default'
                }
            }
        },
        props: {
            file: {
                type: Object,
                default: {}
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            show(val) {
                if (val) {
                    this.$refs.cm.refresh()
                }
            }
        },
        methods: {
            ...mapActions('ContractFiles', ['changeFileContent']),
            onInput: debounce(function (content, file) {
                this.changeFileContent({
                    target: file,
                    content: content
                })
            }, 300)
        }
    }
</script>

<style scoped>

</style>
