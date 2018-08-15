<template>
    <div class="filetree-layout">
        <div class="bar">
            <div class="item" @click="onAddProjectClick">
                <Icon type="md-add-circle"></Icon>
                <span style="vertical-align: middle;">{{$t('files.addProject')}}</span>
            </div>
        </div>
        <div class="files-wrap">
            <Tree class="filetree" ref="tree" :data="data" :render="renderNode"
                    @on-toggle-expand="onToggleExpand" emptyText="">
            </Tree>
        </div>
    </div>
</template>

<script>
    import {cloneDeep} from 'lodash'
    import {mapState, mapActions} from 'vuex'
    import {Icon, Form, FormItem, Input} from 'iview'
    import TemplateSelect from './TemplateSelect'
    import Rules from '@/const/rules'

    import electron from 'electron'
    import templateUtil from '@/util/templateUtil'

    const remote = electron.remote
    const Menu = remote.Menu
    const MenuItem = remote.MenuItem

    export default {
        name: 'FTree',
        components: {
            Icon,
            Form,
            FormItem,
            Input,
            TemplateSelect
        },
        data() {
            return {}
        },
        computed: {
            ...mapState('ContractFiles', ['files', 'currentSelectedFile']),
            data() {
                var data = this.filterData(cloneDeep(this.files.children))
                return data
            }
        },
        created() {
            console.log('tpl', templateUtil.compile('hello').render({title: 'lzyzyzy'}))
        },
        methods: {
            ...mapActions('ContractFiles', ['addProject', 'appendFile', 'changeFileStatus', 'selectFile', 'openFile', 'removeFile']),
            onAddProjectClick() {
                let selected
                const that = this

                function onSelect(sel) {
                    selected = sel
                }

                this.$Modal.confirm({
                    loading: true,
                    title: this.$t('template.title.select'),
                    width: 800,
                    render: () => {
                        return (
                            <template-select on-select={onSelect}></template-select>
                        )
                    },
                    onOk() {
                        if (!!selected) {
                            this.cancel()
                            const compiled = templateUtil.compile(selected.title)
                            // must use setTimeout instead of nextTick, iview bug skr
                            setTimeout(() => {
                                that.showEditDirectoryNameModal({
                                    name: selected.title,
                                    title: that.$t('template.title.create'),
                                    type: 'template',
                                    callback: (name) => {
                                        that.addProject(compiled.render({title: name}))
                                    }
                                })
                            }, 300)
                        } else {
                            this.buttonLoading = false
                            that.$Message.warning(this.$t('template.validate.required'))
                        }
                    }
                })
            },
            popupFileMenu(data) {
                const directoryMenu = new Menu()
                directoryMenu.append(new MenuItem({
                    label: this.$t('files.addFile'),
                    click: () => {
                        this.showEditFileNameModal({
                            name: '',
                            title: this.$t('files.addFile'),
                            callback: (name) => {
                                this.appendFile({target: data, opts: {title: name}})
                            }
                        })
                    }
                }))
                // gxx-server not support multi layer directory briefly
                // directoryMenu.append(new MenuItem({
                //     label: this.$t('files.addFolder'),
                //     click: () => {
                //         this.appendFile({target: data, opts: {isDirectory: true}})
                //     }
                // }))
                directoryMenu.append(new MenuItem({
                    label: this.$t('files.title.editFileName'),
                    click: () => {
                        this.showEditFileNameModal({
                            name: data.title,
                            title: this.$t('files.title.editFileName'),
                            callback: (name) => {
                                this.changeFileStatus({node: data, opts: {title: name}})
                            }
                        })
                    }
                }))
                directoryMenu.append(new MenuItem({
                    label: this.$t('files.title.removeFile'),
                    click: () => {
                        this.showRemoveFileModal(data)
                    }
                }))
                directoryMenu.popup(remote.getCurrentWindow())
            },
            popupDirectoryMenu(data) {
                const directoryMenu = new Menu()
                directoryMenu.append(new MenuItem({
                    label: this.$t('files.addFile'),
                    click: () => {
                        this.showEditFileNameModal({
                            name: '',
                            title: this.$t('files.addFile'),
                            callback: (name) => {
                                this.appendFile({target: data, opts: {title: name}})
                            }
                        })
                    }
                }))
                // gxx-server not support multi layer directory briefly
                // directoryMenu.append(new MenuItem({
                //     label: this.$t('files.addFolder'),
                //     click: () => {
                //         this.appendFile({target: data, opts: {isDirectory: true}})
                //     }
                // }))
                directoryMenu.append(new MenuItem({
                    label: this.$t('files.title.editDirectoryName'),
                    click: () => {
                        this.showEditDirectoryNameModal({
                            name: data.title,
                            title: this.$t('files.title.editDirectoryName'),
                            callback: (name) => {
                                this.changeFileStatus({node: data, opts: {title: name}})
                            }
                        })
                    }
                }))
                directoryMenu.append(new MenuItem({
                    label: this.$t('files.title.removeDirectory'),
                    click: () => {
                        this.showRemoveFileModal(data)
                    }
                }))
                directoryMenu.popup(remote.getCurrentWindow())
            },
            showRemoveFileModal(data) {
                let title
                let content
                if (data.isDirectory) {
                    title = this.$t('files.title.removeDirectory')
                    content = this.$t('files.confirmRemoveDirectory')
                } else {
                    title = this.$t('files.title.removeFile')
                    content = this.$t('files.confirmRemoveFile')
                }
                this.$Modal.confirm({
                    title: title,
                    content: content,
                    onOk: () => {
                        this.removeFile(data)
                    }
                })
            },
            showEditFileNameModal({title, name, callback}) {
                const rules = {
                    name: [
                        {
                            required: true,
                            message: this.$t('files.validate.required')
                        }, {
                            validator: (rule, value, callback) => {
                                const err_msg = new Error(this.$t('files.validate.fileFormat'))
                                if (Rules.fileFormat.test(value)) {
                                    callback()
                                } else {
                                    callback(err_msg)
                                }
                            }
                        }]
                }

                let model = {
                    name: name
                }

                function handleInput(val) {
                    model.name = val
                }

                this.$Modal.confirm({
                    title: title,
                    loading: true,
                    render: (h) => {
                        return (
                            <Form ref="form" style={{'margin-top': '30px'}} rules={rules} model={model}>
                                <FormItem prop="name">
                                    <Input on-input={handleInput} value={model.name} autofocus={true}
                                        placeholder={this.$t('files.placeholder.required')}/>
                                </FormItem>
                            </Form>
                        )
                    },
                    onOk: function () {
                        this.$refs.form.validate((valid) => {
                            if (valid) {
                                this.cancel()
                                callback(model.name)
                            } else {
                                this.buttonLoading = false
                            }
                        })
                    }
                })
            },
            showEditDirectoryNameModal({title, name, callback, type = 'files'}) {
                const placeholder = this.$t(`${type}.placeholder${type === 'files' ? '.directory' : ''}.required`)
                const rules = {
                    name: [
                        {
                            required: true,
                            message: this.$t(`${type}.validate${type === 'files' ? '.directory' : ''}.required`)
                        }, {
                            validator: (rule, value, callback) => {
                                let filenameReg = Rules.directoryFormat
                                const err_msg = new Error(this.$t(`${type}.validate${type === 'files' ? '.directory' : ''}.format`))
                                if (filenameReg.test(value)) {
                                    callback()
                                } else {
                                    callback(err_msg)
                                }
                            }
                        }]
                }

                let model = {
                    name: name
                }

                function handleInput(val) {
                    model.name = val
                }

                this.$Modal.confirm({
                    title: title,
                    loading: true,
                    render: (h) => {
                        return (
                            <Form ref="form" style={{'margin-top': '30px'}} rules={rules} model={model}>
                                <FormItem prop="name">
                                    <Input on-input={handleInput} value={model.name} autofocus={true}
                                        placeholder={placeholder}/>
                                </FormItem>
                            </Form>
                        )
                    },
                    onOk: function () {
                        this.$refs.form.validate((valid) => {
                            if (valid) {
                                this.cancel()
                                callback(model.name)
                            } else {
                                this.buttonLoading = false
                            }
                        })
                    }
                })
            },
            remove(root, node, data) {
                const parentKey = root.find(el => el === node).parent
                const parent = root.find(el => el.nodeKey === parentKey).node
                const index = parent.children.indexOf(data)
                parent.children.splice(index, 1)
            },
            filterData(files) {
                return files.map(file => {
                    file.render = this.renderNode
                    return file
                })
            },
            renderNode(h, {root, node, data}) {
                if (data.isDirectory) {
                    return (
                        <div class={{fileItem: true, selected: data.id === this.currentSelectedFile.id}}
                            on-click={this.OnFileClick.bind(this, data)}
                            on-dblclick={this.OnFileDblclick.bind(this, data)}
                            on-contextmenu={this.popupDirectoryMenu.bind(this, data)}>
                            <Icon type="ios-folder-outline" style={{
                                marginRight: '8px',
                                color: 'white',
                                'vertical-align': 'middle'
                            }}/>
                            <span style={{'vertical-align': 'middle'}}>{data.title}</span>
                        </div>
                    )
                } else {
                    return (
                        <div class={{fileItem: true, selected: data.id === this.currentSelectedFile.id}}
                            on-click={this.OnFileClick.bind(this, data)}
                            on-dblclick={this.OnFileDblclick.bind(this, data)}
                            on-contextmenu={this.popupFileMenu.bind(this, data)}>
                            <Icon type="ios-paper-outline" style={{
                                marginRight: '8px',
                                color: 'white',
                                'vertical-align': 'middle'
                            }}/>
                            <span style={{'vertical-align': 'middle'}}>{data.title}</span>
                        </div>
                    )
                }
            },
            onToggleExpand(node) {
                this.changeFileStatus({node: node, opts: {expand: node.expand}})
            },
            OnFileClick(data) {
                this.selectFile(data)
            },
            OnFileDblclick(data) {
                this.openFile(data)
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    @import '@styles/_variable.scss';

    .files-wrap {
        overflow: auto;
    }

    .filetree-layout /deep/ .ivu-tree-children > li {
        position: relative;
    }

    .filetree-layout /deep/ .fileItem {
        position: absolute;
        top: 0px;
        left: 0;
        padding-left: 20px;
        width: 100%;
        box-sizing: border-box;
        cursor: default;
    }

    .filetree-layout /deep/ .fileItem.selected {
        color: $base-color;
    }

    .filetree-layout /deep/ .ivu-tree-arrow {
        position: relative;
        z-index: 3;
    }

    .bar {
        padding-left: 18px;
        height: 32px;
        line-height: 32px;
        background: #050713;

        .item {
            display: inline-block;
            color: #5874db;
            cursor: pointer;
        }

        .ivu-icon {
            font-size: 18px;
        }
    }
</style>
