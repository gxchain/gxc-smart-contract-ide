<template>
    <div class="filetree-layout">
        <Tree class="filetree" ref="tree" :data="data" :render="renderNode" @on-toggle-expand="onToggleExpand"></Tree>
    </div>
</template>

<script>
    import {cloneDeep} from 'lodash'
    import {mapState, mapActions} from 'vuex'
    import {Icon, Form, FormItem, Input} from 'iview'

    import electron from 'electron'

    const remote = electron.remote
    const Menu = remote.Menu
    const MenuItem = remote.MenuItem

    export default {
        name: 'FTree',
        components: {
            Icon,
            Form,
            FormItem,
            Input
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
        },
        methods: {
            ...mapActions('ContractFiles', ['appendFile', 'changeFileStatus', 'selectFile', 'openFile']),
            popupDirectoryMenu(data) {
                const directoryMenu = new Menu()
                directoryMenu.append(new MenuItem({
                    label: this.$t('files.addFile'),
                    click: () => {
                        this.appendFile({target: data})
                    }
                }))
                directoryMenu.append(new MenuItem({
                    label: this.$t('files.addFolder'),
                    click: () => {
                        this.appendFile({target: data, opts: {isDirectory: true}})
                    }
                }))
                directoryMenu.append(new MenuItem({
                    label: this.$t('files.title.editDirectoryName'),
                    click: () => {
                        this.openEditDirectoryNameModal(data)
                    }
                }))
                directoryMenu.popup()
            },
            popupFileMenu(data) {
                const directoryMenu = new Menu()
                directoryMenu.append(new MenuItem({
                    label: this.$t('files.addFile'),
                    click: () => {
                        this.appendFile({target: data})
                    }
                }))
                directoryMenu.append(new MenuItem({
                    label: this.$t('files.addFolder'),
                    click: () => {
                        this.appendFile({target: data, opts: {isDirectory: true}})
                    }
                }))
                directoryMenu.append(new MenuItem({
                    label: this.$t('files.title.editFileName'),
                    click: () => {
                        this.openEditFileNameModal(data)
                    }
                }))
                directoryMenu.popup()
            },
            openEditFileNameModal(data) {
                const that = this
                const rules = {
                    name: [
                        {
                            required: true,
                            message: this.$t('files.validate.required')
                        }, {
                            validator: (rule, value, callback) => {
                                let filenameReg = /^[\w,\s-]+\.cpp|hpp$/
                                const err_msg = new Error(this.$t('files.validate.fileFormat'))
                                if (filenameReg.test(value)) {
                                    callback()
                                } else {
                                    callback(err_msg)
                                }
                            }
                        }]
                }

                let model = {
                    name: data.title
                }

                function handleInput(val) {
                    model.name = val
                }

                this.$Modal.confirm({
                    title: this.$t('files.title.editFileName'),
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
                                that.changeFileStatus({node: data, opts: {title: model.name}})
                            } else {
                                this.buttonLoading = false
                            }
                        })
                    }
                })
            },
            openEditDirectoryNameModal(data) {
                const that = this
                const rules = {
                    name: [
                        {
                            required: true,
                            message: this.$t('files.validate.required')
                        }, {
                            validator: (rule, value, callback) => {
                                let filenameReg = /^[\w,\s-]+$/
                                const err_msg = new Error(this.$t('files.validate.directoryFormat'))
                                if (filenameReg.test(value)) {
                                    callback()
                                } else {
                                    callback(err_msg)
                                }
                            }
                        }]
                }

                let model = {
                    name: data.title
                }

                function handleInput(val) {
                    model.name = val
                }

                this.$Modal.confirm({
                    title: this.$t('files.title.editDirectoryName'),
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
                                that.changeFileStatus({node: data, opts: {title: model.name}})
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
                                color: 'white'
                            }}/>
                            <span>{data.title}</span>
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
                                color: 'white'
                            }}/>
                            <span>{data.title}</span>
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

<style lang="scss" scoped>
    .filetree-layout {
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
    }

    .filetree-layout /deep/ .fileItem.selected {
        background: blue;
    }

    .filetree-layout /deep/ .ivu-tree-arrow {
        position: relative;
        z-index: 3;
    }
</style>
