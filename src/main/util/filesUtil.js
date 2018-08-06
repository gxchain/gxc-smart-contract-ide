import rd from 'readdir-enhanced'
import fs from 'fs-extra'
import path from 'path'

const util = {}

/**
 * generate project object by a directory path
 * @param p {String} directory path
 * @returns {Object}
 */
util.genProject = function (p) {
    function recur(parent, dir) {
        const files = rd.readdirSync(dir, {filter: /^[\w,\s-]+/})
        files.forEach(file => {
            const filePath = path.join(dir, file)
            if (fs.lstatSync(filePath).isDirectory()) {
                const node = {
                    title: file,
                    isDirectory: true,
                    children: []
                }
                parent.push(node)
                recur(node.children, filePath)
            } else {
                parent.push({
                    title: file,
                    content: fs.readFileSync(filePath, 'utf8')
                })
            }
        })
    }

    const project = {
        title: path.basename(p),
        children: []
    }

    recur(project.children, p)
    return project
}

export default util
