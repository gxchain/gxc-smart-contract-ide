<template>
    <Tree class="filetree" ref="tree" :data="data" :render="renderContent"
          @on-select-change="$emit('on-select-change',$event)"></Tree>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    import ContractOperationStore from '@/store/modules/ContractOperation.js'
    import electron from 'electron'

    const remote = electron.remote
    const Menu = remote.Menu
    const MenuItem = remote.MenuItem

    export default {
        data() {
            return {
                data: [
                    {
                        menu: null,
                        tempFileItemContext: null,
                        title: 'default',
                        expand: true,
                        render: (h, {root, node, data}) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    'font-size': '14px',
                                    background: '#6699ff',
                                    color: 'white',
                                    'padding-left': '15px',
                                    position: 'relative',
                                    left: '-15px',
                                    height: '50px',
                                    'line-height': '50px'
                                }
                            }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '8px',
                                            'font-size': '16px'
                                        }
                                    }),
                                    h('span', data.title)
                                ]),
                                h('span', {
                                    style: {
                                        display: 'inline-block',
                                        float: 'right',
                                        marginRight: '32px'
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-plus-outline'
                                        },
                                        style: {
                                            'font-size': '16px',
                                            'cursor': 'pointer',
                                            'padding': '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.append(data)
                                            }
                                        }
                                    })
                                ])
                            ])
                        }
                    }
                ],
                filesTree: [],
                lastAppendFiles: []
            }
        },
        computed: {
            ...mapState('ContractOperation', ['files'])
        },
        created() {
            // this.$set(this.data[0], 'children', this.files)
            this.initData()
            this.initMenu()

            this.$store.subscribeAction((action, state) => {
                // 添加文件
                if (action.type === 'ContractOperation/appendFile') {
                    this.appendX()
                }

                if (action.type === 'ContractOperation/removeFile') {
                    this.removeX(action.payload)
                }

                if (action.type === 'ContractOperation/selectFile') {
                    this.selectX(action.payload)
                }

                if (action.type === 'ContractOperation/changeFileTitle') {
                    this.changeTitleX(action.payload)
                }
            })
        },
        methods: {
            ...mapActions('ContractOperation', [
                'appendFile',
                'removeFile',
                'selectFile',
                'changeFileTitle'
            ]),
            initMenu() {
                this.menu = new Menu()
                this.menu.append(new MenuItem({
                    label: this.$t('files.editFileName'),
                    click: () => {
                        var that = this
                        var model = {
                            name: this.tempFileItemContext.title
                        }
                        this.$Modal.confirm({
                            title: this.$t('files.title.editFileName'),
                            loading: true,
                            render: (h) => {
                                return h('Form', {
                                    ref: 'form',
                                    style: {
                                        'margin-top': '30px'
                                    },
                                    props: {
                                        rules: {
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
                                                }, {
                                                    validator: (rule, value, callback) => {
                                                        const err_msg = new Error(this.$t('files.validate.repeatName'))
                                                        this.filesTree.forEach((file) => {
                                                            if (file.id !== this.tempFileItemContext.id) {
                                                                if (file.title === value) {
                                                                    callback(err_msg)
                                                                }
                                                            }
                                                        })

                                                        callback()
                                                    }
                                                }]
                                        },
                                        model: model
                                    }
                                }, [
                                    h('FormItem', {
                                        props: {
                                            prop: 'name'
                                        }
                                    }, [h('Input', {
                                        props: {
                                            value: model.name,
                                            autofocus: true,
                                            placeholder: this.$t('files.placeholder.required')
                                        },
                                        on: {
                                            input(val) {
                                                model.name = val
                                            }
                                        }
                                    })])
                                ])
                            },
                            onOk: function () {
                                this.$refs.form.validate((valid) => {
                                    if (valid) {
                                        this.cancel()
                                        that.changeTitle(that.tempFileItemContext.id, model.name)
                                    } else {
                                        this.buttonLoading = false
                                    }
                                })
                            }
                        })
                    }
                }))
            },
            renderContent(h, {root, node, data}) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', {
                        style: {
                            cursor: 'pointer',
                            width: '150px',
                            display: 'inline-block'
                        },
                        class: {
                            'file-item': true,
                            'selected': !!data.selected
                        },
                        on: {
                            contextmenu: () => {
                                this.tempFileItemContext = data
                                this.menu.popup(remote.getCurrentWindow())
                            },
                            click: () => {
                                this.select(data)
                            }
                        }
                    }, [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px',
                                color: 'white'
                            }
                        }),
                        h('span', {}, data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '48px',
                            marginTop: '2px'
                        }
                    }, [
                        h('Icon', {
                            props: {
                                type: 'ios-minus-outline'
                            },
                            style: {
                                'font-size': '14px',
                                'padding': '5px',
                                'cursor': 'pointer'
                            },
                            on: {
                                click: () => {
                                    this.$Modal.confirm({
                                        title: this.$t('files.title.removeFile'),
                                        content: this.$t('files.confirmRemoveFile'),
                                        onOk: () => {
                                            this.remove(root, node, data)
                                        }
                                    })
                                }
                            }
                        })
                    ])
                ])
            },
            append() {
                // 修改files
                this.lastAppendFiles = ContractOperationStore.util.formatFiles([{}])
                this.appendFile(this.lastAppendFiles)
            },
            remove(root, node, data) {
                this.removeFile(data.id)
            },
            select(data) {
                this.selectFile(data.id)
            },
            appendX() {
                this.filesTree = this.filesTree.concat(this.filterFiles(this.lastAppendFiles))
                this.$set(this.data[0], 'children', this.filesTree)
            },
            removeX(id) {
                const node = this.findNodeById(id)
                const idx = this.filesTree.indexOf(node)
                this.filesTree.splice(idx, 1)
                this.$set(this.data[0], 'children', this.filesTree)
            },
            selectX(id) {
                this.filesTree.forEach((file) => {
                    if (file.id === id) {
                        file.selected = true
                    } else {
                        file.selected = false
                    }
                })
            },
            filterFile(file) {
                return Object.assign({}, {
                    expand: false
                }, file)
            },
            filterFiles(files) {
                return files.map((file) => {
                    return this.filterFile(file)
                })
            },
            findNodeById(id) {
                var node = null
                this.filesTree.find(function (file) {
                    if (file.id === id) {
                        node = file
                    }
                })
                return node
            },
            initData() {
                this.filesTree = this.filterFiles(this.files)
                this.$set(this.data[0], 'children', this.filesTree)
            },
            changeTitle(id, title) {
                this.changeFileTitle({
                    id,
                    title
                })
            },
            changeTitleX({id, title}) {
                const node = this.findNodeById(id)
                this.$set(node, 'title', title)
            }
        }
    }
</script>

<style scoped>
    .filetree >>> .ivu-tree-children {
        height: 50px;
        line-height: 50px;
    }

    .filetree >>> .ivu-tree-arrow {
        position: relative;
        z-index: 2;
        color: white;
    }

    .filetree >>> ul li {
        margin: 0;
    }

    .filetree >>> .file-item.selected {
        color: rgb(102, 153, 255);
    }
</style>
