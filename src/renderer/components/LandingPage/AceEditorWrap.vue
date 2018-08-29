<template>
    <!--<codemirror ref="cm" :options="cmOption" :value="file.content" @input="onInput($event,file)"></codemirror>-->
    <div ref="editor" class="ace-editor">{{file.content}}</div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {debounce} from 'lodash'
    import ace from 'ace-builds'
    import 'ace-builds/webpack-resolver'
    import 'ace-builds/src-noconflict/ext-language_tools'
    import {types, apis} from '@/const/cppCompletions'
    import {INFO_PANEL_TOGGLE} from '@/const/eventBus'

    // HACK: webpack-resolver not add snippets url
    ace.config.setModuleUrl('ace/snippets/c_cpp', require('file-loader!ace-builds/src-noconflict/snippets/c_cpp'))
    ace.config.setModuleUrl('ace/snippets/text', require('file-loader!ace-builds/src-noconflict/snippets/text'))

    const langTools = ace.require('ace/ext/language_tools')
    const completions = {
        getCompletions: function (editor, session, pos, prefix, callback) {
            callback(null, [...types, ...apis])
        }
    }
    langTools.addCompleter(completions)

    export default {
        name: 'AceEditorWrap',
        data() {
            return {
                editor: null
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
        mounted() {
            var editor = this.editor = ace.edit(this.$refs.editor)
            editor.setTheme('ace/theme/xcode')
            editor.session.setMode('ace/mode/c_cpp')
            editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true
            })
            editor.setShowPrintMargin(false)
            editor.on('change', debounce(() => {
                this.changeFileContent({
                    target: this.file,
                    content: editor.getValue()
                })
            }, 300))

            // must delay, because info panel height changes with aimation
            this.$eventBus.$on(INFO_PANEL_TOGGLE, debounce(() => {
                if (this.show) {
                    this.editor.resize(true)
                }
            }, 500))
        },
        beforeDestroy: function () {
            this.editor.destroy()
            this.editor.container.remove()
        },
        watch: {
            show(val) {
                if (val) {
                    this.editor.resize(true)
                }
            }
        },
        methods: {
            ...mapActions('ContractFiles', ['changeFileContent'])
        }
    }
</script>

<style scoped type="text/scss" lang="scss">
    .ace-editor {
        height: 100%;
    }
</style>
