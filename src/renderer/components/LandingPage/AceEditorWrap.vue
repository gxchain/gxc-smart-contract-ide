<template>
    <!--<codemirror ref="cm" :options="cmOption" :value="file.content" @input="onInput($event,file)"></codemirror>-->
    <div ref="editor" class="ace-editor">{{file.content}}</div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {debounce, template, cloneDeep} from 'lodash'
    import ace from 'ace-builds'
    import 'ace-builds/webpack-resolver'
    import 'ace-builds/src-noconflict/ext-language_tools'
    import 'ace-builds/src-noconflict/mode-c_cpp'
    import {INFO_PANEL_TOGGLE} from '@/const/eventBus'
    import store from '@/store'
    import tooltipTemplate from './tooltipTemplate.ejs'

    const compiled = template(tooltipTemplate)

    // HACK: webpack-resolver not add snippets url
    ace.config.setModuleUrl('ace/snippets/c_cpp', require('file-loader!ace-builds/src-noconflict/snippets/c_cpp'))
    ace.config.setModuleUrl('ace/snippets/text', require('file-loader!ace-builds/src-noconflict/snippets/text'))

    function i18nFilter(item, lang) {
        var labelI18nMap = {
            include: {
                'en-US': 'include',
                'zh-CN': '所属'
            },
            description: {
                'en-US': 'description',
                'zh-CN': '描述'
            },
            fields: {
                'en-US': 'fields',
                'zh-CN': '参数'
            }
        }

        if (typeof item.description === 'string') {
            item.desc = item.description
        } else {
            item.desc = item.description[lang]
        }

        item.fields.forEach((field) => {
            if (typeof field.description === 'string') {
                field.desc = field.description
            } else {
                field.desc = field.description[lang]
            }
        })

        item.label = {
            include: labelI18nMap.include[lang],
            description: labelI18nMap.description[lang],
            fields: labelI18nMap.fields[lang]
        }
        return item
    }

    const langTools = ace.require('ace/ext/language_tools')

    // extend highlight rules
    const CppMode = ace.require('ace/mode/c_cpp').Mode
    const mode = new CppMode()
    const OldHighlight = mode.HighlightRules
    mode.HighlightRules = function () {
        const oh = new OldHighlight(...arguments)
        oh.$rules.singleLineComment.push({
            token: 'keyword',
            regex: '@abi',
            next: 'singleLineComment'
        })

        return oh
    }

    const completions = {
        getCompletions: function (editor, session, pos, prefix, callback) {
            callback(null, cloneDeep(store.state.CppCompletion.completions))
        },
        getDocTooltip(item) {
            if (item.meta == 'gxc_api' && !item.docHTML) {
                item.docHTML = compiled(i18nFilter(item, localStorage.getItem('lang')))
            }
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
            editor.session.setMode(mode)
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
