/**
 * this util only support plain folder structure, tree support will support later
 */
// must require.context new template when add new template
import {template} from 'lodash'
import * as tplMap from './import'

const util = {}

// {hello:'url/path'}
const bgMap = {}

// {hello:{title:'hello'...}}
const metaMap = {}

// import meta files
const metaFiles = require.context('@/template', true, /meta\.js$/)
const bgs = require.context('@/template', true, /bg\.png$/)

bgs.keys().map(key => {
    const type = /^\.\/(.+)\/bg\.png$/.exec(key)[1]
    bgMap[type] = bgs(key)
})

// function getVal(obj, visitor = '') {
//     var ret
//     visitor = visitor.split('.')
//
//     try {
//         ret = obj
//         visitor.forEach((v) => {
//             ret = ret[v]
//         })
//     } catch (err) {
//         ret = undefined
//     }
//
//     return ret
// }

util.metas = metaFiles.keys().map(key => {
    var meta = metaFiles(key).default

    // add other key val pairs
    meta.type = /^\.\/(.+)\/meta\.js$/.exec(key)[1]
    meta.bgStyle = meta.bgStyle || {}
    meta.bdStyle = meta.bdStyle || {}
    // if bg url exist
    if (!!bgMap[meta.type]) {
        meta.bgUrl = bgMap[meta.type]
        meta.bgStyle['background-image'] = `url(${meta.bgUrl})`
    }

    return meta
}).sort((a, b) => {
    return a.position - b.position
})

util.metas.forEach((val) => {
    metaMap[val.type] = val
})

util.compile = function ({type, title}) {
    let files = tplMap[`${type}`]
    const reg = /^\.\/(.+)\.ejs$/
    files = files.keys().map(key => {
        return {
            title: reg.exec(key)[1],
            content: template(files(key))
        }
    })

    const project = {
        type: type,
        title: title,
        children: files
    }
    project.render = util.render.bind(util, project)

    return project
}

util.render = function (project, opts = {}) {
    opts.entry = opts.entry || metaMap[project.type].entry
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

export default util
