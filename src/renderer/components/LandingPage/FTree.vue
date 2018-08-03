<template>
    <div class="filetree-layout">
        <Tree class="filetree" ref="tree" :data="data" :render="renderNode" @on-toggle-expand="onToggleExpand"></Tree>
    </div>
</template>

<script>
    import {cloneDeep} from 'lodash'
    import {mapState, mapActions} from 'vuex'
    import {Icon} from 'iview'

    import electron from 'electron'

    const remote = electron.remote
    const Menu = remote.Menu
    const MenuItem = remote.MenuItem

    export default {
        name: 'FTree',
        components: {
            Icon
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
                directoryMenu.popup()
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
