'use strict'

import {app, BrowserWindow, Menu, dialog, ipcMain} from 'electron'
import filesUtil from './util/filesUtil'
import {autoUpdater} from 'electron-updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let aboutWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

const updateWinURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/update.html`
    : `file://${__dirname}/update.html`

const aboutWinUrl = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/about.html`
    : `file://${__dirname}/about.html`

function createMenu() {
    const application = {
        label: 'Application',
        submenu: [
            {
                label: 'About Application',
                click: () => {
                    showAboutWindow()
                }
                // role: 'about'
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: () => {
                    app.quit()
                }
            }
        ]
    }

    const file = {
        label: 'File',
        submenu: [{
            label: 'Import Project',
            accelerator: 'CmdOrCtrl+i',
            click() {
                dialog.showOpenDialog({
                    properties: ['openDirectory']
                }, (files) => {
                    if (!!files) {
                        mainWindow.webContents.send('import-project', filesUtil.genProject(files[0]))
                    }
                })
            }
        }]
    }

    const edit = {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            }
        ]
    }

    const template = [
        application,
        file,
        edit
    ]

    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

function createWindow() {
    /**
     * Initial window options
     */
    const initTime = new Date()
    mainWindow = new BrowserWindow({
        minHeight: 696,
        minWidth: 1180,
        height: 696,
        width: 1180,
        titleBarStyle: 'hidden',
        backgroundColor: '#000'
    })

    mainWindow.loadURL(winURL)

    // test render time
    setTimeout(function () {
        mainWindow && mainWindow.webContents.send('send-init-time', +initTime)
    }, 10000)

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

function createUpdateWindow(info = {}) {
    const updateWindow = new BrowserWindow({
        height: 500,
        width: 700,
        resizable: false,
        show: false
    })

    updateWindow.once('ready-to-show', () => {
        updateWindow.show()
        updateWindow.webContents.send('releaseNoteGet', info)
    })

    // for windows & linux
    updateWindow.setMenu(null)

    updateWindow.loadURL(updateWinURL)

    ipcMain.on('quitAndInstall', () => {
        autoUpdater.quitAndInstall()
    })
}

function showAboutWindow() {
    if (!!aboutWindow) {
        aboutWindow.focus()
        return
    }
    aboutWindow = new BrowserWindow({
        height: 180,
        width: 280,
        resizable: false
    })

    // for windows & linux
    aboutWindow.setMenu(null)

    aboutWindow.loadURL(aboutWinUrl)

    aboutWindow.on('closed', () => {
        aboutWindow = null
    })
}

app.on('ready', () => {
    createMenu()
    createWindow()
    // createUpdateWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

autoUpdater.on('update-downloaded', (info) => {
    createUpdateWindow(info)
})

// will auto download
app.on('ready', () => {
    if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
