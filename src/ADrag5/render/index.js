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
            this.provider = null;
            Render.instance = this;
        }
        return Render.instance;
    }

    /**
     * 移除某box
     * @param key
     * @param cut
     * @returns {*}
     */
    remove(key, cut) {
        const deleteItem = this.get()[key]
        Render.instance.box.remove(key, cut)
        return deleteItem
    }

    /**
     * 创建box
     * @param key
     * @param _package
     */
    create({key, _package}) {
        Render.instance.box.create({
            key,
            value: {
                _package,
                _block: new Block()
            }
        })
    }

    /**
     * 插入box
     * @param pre
     * @param _package
     * @param key
     */
    insert({pre, _package, key}) {
        Render.instance.box.insert({
            pre,
            key,
            value: {
                _package,
                _block: new Block()
            }
        })
    }

    /**
     * Pack混入事件，加持移动属性
     * @param _key
     * @param pre
     * @param _package
     * @param downCallback
     * @param moveCallback
     * @param overCallback
     */
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

    /**
     * Fragment混入事件 加入移动属性
     * @param _key
     * @param pre
     * @param _package
     * @param _originId
     * @param _moverId
     * @param downCallback
     * @param moveCallback
     * @param overCallback
     */
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

    /**
     * 混入容器,
     * @param _providerId
     * @param event
     */
    mixinProvider({_providerId, event}) {
        Render.instance.provider = new Template({_providerId}).makeProvider(event)
    }

    /**
     * 获取box实例
     * @returns {BoxGraph}
     */
    takeBox() {
        return Render.instance.box
    }

    /**
     * 获取box数据
     * @returns {{}}
     */
    get() {
        return Render.instance.box.take()
    }
}

