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
let documentWindow
let feedbackWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createMenu() {
    const application = {
        label: 'Application',
        submenu: [
            {
                label: 'About Application',
                role: 'about'
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
    mainWindow = new BrowserWindow({
        minHeight: 696,
        minWidth: 1180,
        height: 696,
        useContentSize: true,
        width: 1180,
        titleBarStyle: 'hidden',
        backgroundColor: '#000'
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    ipcMain.on('loadDocumentWindow', loadDocumentWindow.bind(this, mainWindow))
    ipcMain.on('loadFeedbackWindow', loadFeedbackWindow.bind(this, mainWindow))
}

function loadDocumentWindow(parent) {
    if (!documentWindow) {
        documentWindow = new BrowserWindow({
            height: 500,
            width: 1000,
            parent: parent
        })

        documentWindow.loadURL('https://github.com/gxchain/Technical-Documents/blob/master/gxchain_contract_start.md')

        documentWindow.on('closed', () => {
            documentWindow = null
        })
    }
}

function loadFeedbackWindow(parent) {
    if (!feedbackWindow) {
        documentWindow = new BrowserWindow({
            height: 500,
            width: 1000,
            parent: parent
        })

        documentWindow.loadURL('http://blockcity.mikecrm.com/1WDrQXM')

        documentWindow.on('closed', () => {
            documentWindow = null
        })
    }
}

app.on('ready', () => {
    createMenu()
    createWindow()
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

autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall()
})

app.on('ready', () => {
    if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
