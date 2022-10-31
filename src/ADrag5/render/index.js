import Block from "@/ADrag5/block";
import {BoxGraph} from "../helper/index";


export default class Render {
    constructor() {
        this.box = new BoxGraph();
        this.block = new Block()
        this.box.root({})
    }

    create(_package) {
        this.box.insert({
            pre: 'root',
            key: `child-${this.box.takeKeys().length}`,
            value: {
                _package,
                _block: this.block
            },
        })
        return this
    }

    get() {
        return this.box.take()
    }
}

console.log(new Render().create().get())
