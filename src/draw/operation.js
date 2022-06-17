import Immutable from "immutable";


export default class Operation {
    constructor() {
        this.record = []
        this.current = -1
        this.cache = {}
    }

    append({
               move,
               resize
           }) {
        let moveResult, resizeResult;
        if (typeof move === 'function') {
            moveResult = move.call(this)
        }
        if (typeof resize == 'function') {
            resizeResult = resize.call(this)
        }
        this.record.push({
            moveResult,
            resizeResult
        })
        this.current += 1
        console.log(this.record, 'res')
    }

    back() {
        this.current -= 1
        this.cache = Immutable.Map(this.record[this.current])
        console.log(this.cache,'this.cache')
        return this.cache
    }
}

