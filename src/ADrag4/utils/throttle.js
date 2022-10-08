import {takeWhile, interval} from "rxjs";

export default class Throttle {
    constructor(time) {
        this.getInstance(time)
    }

    getInstance() {
        if (!Throttle.instance) {
            this.fn = new Function('')
            this.go = true
            Throttle.instance = this;
        }
        return Throttle.instance;
    }

    start(fn, time) {
        if (!this.go) {
            this.go = true
            this.fn = fn
            interval(time).pipe(
                takeWhile(() => this.go)
            ).subscribe(() => {
                if (typeof this.fn === 'function') {
                    this.fn()
                }
            })
        }
    }

    over() {
        this.go = false
    }
}
