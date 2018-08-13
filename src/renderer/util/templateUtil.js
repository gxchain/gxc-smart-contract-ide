/**
 * this util only support plain folder structure, tree support will support later
 */
// must require.context new template when add new template
import {template} from 'lodash'
const util = {}
// TODO cannot use ejs loader, other wise there will be exception in production env
const helloTpl = require.context('@/template/hello', true, /\.ejs$/)
const transferTpl = require.context('@/template/transfer', true, /\.ejs$/)
// import meta files
const metaFiles = require.context('@/template', true, /meta\.js$/)

const tplMap = {helloTpl, transferTpl}
// {hello:{title:'hello'...}}
const metaMap = {}

metaFiles.keys().forEach(key => {
    const content = metaFiles(key).default
    metaMap[content.title] = content
})

util.render = function (project, opts = {}) {
    // TODO chang entry
    opts.entry = opts.entry || metaMap[project.title].entry
    if (opts.title) {
        project.title = opts.title
    }

    project.children = project.children.map(file => {
        // every child file render
        file.content = file.content(opts)
        return file
    })

    delete project.render

    return project
}

util.compile = function (directory) {
    let files = tplMap[`${directory}Tpl`]
    const reg = /^\.\/(.+)\.ejs$/
    files = files.keys().map(key => {
        return {
            title: reg.exec(key)[1],
            content: template(files(key))
        }
    })

    const ret = {
        title: directory,
        children: files
    }
    ret.render = util.render.bind(util, ret)

    return ret
}

util.metas = metaFiles.keys().map(key => {
    return metaFiles(key).default
})

export default util
