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
                    label: '编辑名称',
                    click: () => {
                        let value = ''
                        // add edit modal
                        // TODO 文件校验 /^[\w,\s-]+\.cpp|hpp$/
                        this.$Modal.confirm({
                            render: (h) => {
                                return h('Input', {
                                    props: {
                                        title: '修改文件名称',
                                        value: this.tempFileItemContext.title,
                                        autofocus: true,
                                        placeholder: 'Please enter your name...'
                                    },
                                    on: {
                                        input: (val) => {
                                            value = val
                                        }
                                    }
                                })
                            },
                            onOk: () => {
                                this.changeTitle(this.tempFileItemContext.id, value)
                            }
                        })
                    }
                }))
            },
            renderContent(h, {root, node, data}) {
                var fileTextNode = null
                fileTextNode = h('span', {
                    on: {
                        click: () => {
                            this.select(data)
                        },
                        dblclick: () => {
                            data.editing = true
                        }
                    }
                }, data.title)

                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', {
                        style: {
                            cursor: 'pointer'
                        },
                        class: {
                            'file-item': true,
                            'selected': !!data.selected
                        },
                        on: {
                            contextmenu: () => {
                                this.tempFileItemContext = data
                                this.menu.popup(remote.getCurrentWindow())
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
                        fileTextNode
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
                                        title: '删除文件',
                                        content: '确认删除该文件？',
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
                this.lastAppendFiles = ContractOperationStore.util.formatFiles([{
                    title: 'new-file.cpp'
                }])
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
                console.log(this.filesTree)
            },
            removeX(id) {
                const node = this.findNodeById(id)
                const idx = this.filesTree.indexOf(node)
                this.filesTree.splice(idx, 1)
                this.$set(this.data[0], 'children', this.filesTree)
            },
            selectX(id) {
                const node = this.findNodeById(id)
                this.$refs.tree.handleSelect(node.nodeKey)
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
