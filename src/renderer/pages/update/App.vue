<template>
    <div id="app">
        {{releaseNote}}
        <div class="btn-wrap">
            <button @click="onLaterClick">later</button>
            <button @click="onInstallClick">update now</button>
        </div>
    </div>
</template>

<script>
    import {remote, ipcRenderer} from 'electron'

    export default {
        name: 'app',
        data() {
            return {
                lang: localStorage.getItem('lang'),
                releaseNote: '',
                version: ''
            }
        },
        created() {
            ipcRenderer.on('releaseNoteGet', (evt, message) => {
                this.releaseNote = message.releaseNotes
                this.version = message.version
            })
        },
        methods: {
            onLaterClick() {
                const win = remote.getCurrentWindow()
                win.close()
            },
            onInstallClick() {
                ipcRenderer.send('quitAndInstall')
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>

</style>
