<template>
    <Tree ref="tree" :data="data" :render="renderContent"
          @on-select-change="$emit('on-select-change',$event)"></Tree>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    import ContractOperationStore from '@/store/modules/ContractOperation.js'

    export default {
        data() {
            return {
                data: [
                    {
                        title: 'parent 1',
                        expand: true,
                        render: (h, {root, node, data}) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '8px'
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
                                            width: '52px'
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
            renderContent(h, {root, node, data}) {
                console.log('renderContentrenderContentrenderContentrenderContent')
                var fileTextNode = null

                if (data.editing) {
                    fileTextNode = h('Input', {
                        props: {
                            size: 'small',
                            placeholder: 'small size',
                            value: data.title,
                            autofocus: true
                        },
                        attrs: {
                            timestamp: +new Date()
                        },
                        on: {
                            'on-blur': (evt) => {
                                data.editing = false
                                this.changeTitle(data.id, evt.target.value)
                            }
                        },
                        methods: {
                            doneEdit() {
                                console.log('lzyzyzy')
                            }
                        }
                    }, data.title)

                    console.log('lzyzyzy', fileTextNode)
                } else {
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
                }

                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        fileTextNode
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
                                type: 'ios-minus-outline'
                            },
                            on: {
                                click: () => {
                                    // 同选中
                                    this.remove(root, node, data)
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
                // const parentKey = root.find(el => el === node).parent
                // const parent = root.find(el => el.nodeKey === parentKey).node
                // const index = parent.children.indexOf(data)
                // parent.children.splice(index, 1)
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
                    expand: false,
                    editing: false
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
