import dateformat from 'dateformat'

function generateGuuId() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}

function formatTime(date = new Date()) {
    return dateformat(date, 'yyyy-mm-dd HH:MM:ss')
}

export default {
    formatTime,
    generateGuuId
}
