<template>
    <div id="app">
        <div class="logo"></div>
        <h1 class="title">{{$t('releaseTitle')}}</h1>
        <p class="desc">{{version}} {{$t('desc1')}}, {{$t('desc2')}}
            {{oldVersion}}</p>
        <p class="detail-label">{{$t('detailLabel')}}:</p>
        <div class="detail-cnt" v-html="releaseNoteX"></div>
        <div class="btn-wrap">
            <button class="laterBtn" @click="onLaterClick">{{$t('later')}}</button>
            <button class="installBtn" @click="onInstallClick">{{$t('now')}}</button>
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
                version: '',
                oldVersion: localStorage.getItem('version')
            }
        },
        computed: {
            releaseNoteX() {
                return this.$options.filters.releaseNoteFilter(this.releaseNote, this.lang)
            }
        },
        created() {
            document.title = this.$t('title')
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
        },
        i18n: { // `i18n` option, setup locale info for component
            messages: {
                'en-US': {
                    title: 'Software Update',
                    releaseTitle: 'New release has been published',
                    desc1: 'version is available',
                    desc2: 'your current version is',
                    detailLabel: 'Release detail',
                    later: 'Install Later',
                    now: 'Install Now'
                },
                'zh-CN': {
                    title: '软件更新',
                    releaseTitle: '新版本已发布',
                    desc1: '版本已发布',
                    desc2: '您当前的版本是',
                    detailLabel: '更新详情',
                    later: '稍后安装',
                    now: '立即安装'
                }
            }
        },
        filters: {
            releaseNoteFilter: function (str, lang) {
                function filterStr(str) {
                    if (/^<br\s*>|<br\s*\/>.*/.test(str)) {
                        return str.replace(/<br\s*>|<br\s*\/>/, '')
                    } else {
                        return str
                    }
                }

                const cnReg = /[zZ][hH]-[cC][nN]:/
                const enReg = /[eE][nN]-[uU][sS]:/
                let cnIndex = cnReg.exec(str)
                cnIndex && (cnIndex = cnIndex.index)
                let enIndex = enReg.exec(str)
                enIndex && (enIndex = enIndex.index)

                let cnStr
                let enStr

                // if annotation not exist, return original value directly
                if (cnIndex === null || enIndex === null) {
                    return str
                }

                if (cnIndex < enIndex) {
                    cnStr = str.substring(cnIndex + 6, enIndex)
                    enStr = str.substring(enIndex + 6)
                } else {
                    enStr = str.substring(enIndex + 6, cnIndex)
                    cnStr = str.substring(cnIndex + 6)
                }

                return lang.toLowerCase() === 'zh-cn' ? filterStr(cnStr) : filterStr(enStr)
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    #app {
        height: 100%;
        padding: 20px 20px 20px 100px;
        background: rgb(236, 236, 236);
        font-size: 14px;
    }

    .logo {
        position: absolute;
        left: 22px;
        top: 22px;
        width: 60px;
        height: 60px;
        background: url(~@images/logo.png);
        background-size: cover;
    }

    .title {
        margin: 0;
        font-size: 16px;
        line-height: 1;
    }

    .detail-label {
        font-weight: 700;
        margin-bottom: 3px;
    }

    .detail-cnt {
        height: 320px;
        padding: 10px 8px;
        overflow: auto;
        overflow-x: hidden;
        word-break: break-word;
        background: white;
        border: 1px solid #bfbbbb;
    }

    .btn-wrap {
        float: right;
        margin-top: 12px;
    }

    button {
        padding: 4px 20px;
        font-size: 14px;
        border-radius: 4px;
        box-shadow: none;
        border: 0;
        cursor: pointer;
    }

    .installBtn {
        background: #2d8cf0;
        color: white;
    }

    .laterBtn {
        margin-right: 10px;
        background: rgb(192, 192, 192);
    }

    p {
        margin: 0;
        margin-top: 7px;
    }
</style>

<style lang="scss" type="text/scss">
    html, body {
        overflow: hidden;
        margin: 0;
        height: 100%;
    }

    *, *::after, *::before {
        -webkit-user-select: none;
    }

    p {
        margin: 0;
        line-height: 1.4;
    }

</style>
