


export default class Render {
    constructor(box) {
        this.box = box
        this.box.root({})
    }

    create(value) {
        this.box.insert({
            pre: 'root',
            key: `child-${this.box.take().length}`,
            value,
        })
    }
}
