import Block from "@/ADrag5/block";
import {BoxGraph} from "../helper/index";
import Template from "../template";


export default class Render {
    constructor() {
        this.singleton()
    }

    singleton() {
        if (!Render.instance) {
            this.box = new BoxGraph();
            this.box.root({});
            this.provider = null;
            Render.instance = this;
        }
        return Render.instance;
    }

    remove(key, cut) {
        const deleteItem = this.get()[key]
        Render.instance.box.remove(key, cut)
        return deleteItem
    }

    insert({pre, _package, key}) {
        this.box.insert({
            pre,
            key,
            value: {
                _package,
                _block: new Block()
            }
        })
    }

    mixinPack({_key, pre, _package, downCallback, moveCallback, overCallback}) {
        this.insert({
            key: _key,
            _package,
            pre,
        })
        new Template({_key}).makePack({
            downCallback, moveCallback, overCallback
        })
    }

    mixinFragment({_key, pre, _package, _originId, _moverId, downCallback, moveCallback, overCallback}) {
        new Template({_moverId, _originId}).makeFragment({
            downCallback, moveCallback, overCallback: (p, e) => {
                this.insert({
                    key: _key,
                    _package,
                    pre,
                })
                typeof overCallback === 'function' && overCallback(p, e)
            }
        })
    }

    mixinProvider({_providerId}) {
        Render.instance.provider = new Template({_providerId}).makeProvider()
    }

    takeBox() {
        return Render.instance.box
    }

    get() {
        return Render.instance.box.take()
    }
}

