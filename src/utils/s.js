/**插入递归的数组的数据,动态更新
 * {
 *  extendV:[],
 * v:1,
 *   a:[{
 *       extendV:[1],
 *      v:2,
 *      a:[{
 *           extendV:[1,2],
 *           v:3,
 *           a:[{
 *           extendV:[1,2,3],
 *           v:8
 *           }]
 *       },
 *       {
 *       extendV:[1,2],
 *           v:34,
 *           a:[{
 *           extendV:[1,2,34],
 *           v:8
 *           }]
 *       }]
 *   }]}
 */
class Trace {
    constructor(oldData) {
        this.d = JSON.parse(JSON.stringify(oldData))
        this.h = 'value'
        this.b = 'extendValues'
        this.c = 'children'
    }

    handler(h) {
        this.h = h
        return this
    }

    builder(b) {
        this.b = b
        return this
    }

    children(c) {
        this.c = c
        return this
    }

    insert(target, k, c, ext = []) {
        const e = JSON.parse(JSON.stringify(ext))
        e.push(target[k])
        target[this.b] = e
        if (Array.isArray(target[c])) {
            target[c].map(i => {
                this.insert(i, k, c, e)
            })
        }
    }

    transform() {
        this.insert(this.d, this.h, this.c)
        return this
    }

    get() {
        return this.d
    }
}

const f = new Trace({
    v: 1,
    a: [{
        v: 2,
        a: [{
            v: 3,
            a: [{
                v: 8
            }]
        },
            {
                v: 34,
                a: [{
                    v: 8
                }]
            }]
    }]
}).handler('v').children('a').transform().get()
console.log(JSON.stringify(f), 'f')
