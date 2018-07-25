import {isArray} from 'lodash'

class Logger {
    constructor({limit = 50, logs = []} = {}) {
        this.logs = logs
        this.limit = limit
    }

    push(item) {
        var exceed
        if (isArray(item)) {
            this.logs = this.logs.concat(item)
        } else {
            this.logs.push(item)
        }

        exceed = this.logs.length - this.limit

        if (exceed > 0) {
            this.logs = this.logs.slice(exceed)
        }
    }

    clear() {
        this.logs = []
    }
}

export default Logger
