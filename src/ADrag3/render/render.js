import {complier} from "../load/compiler";
import lodash from "lodash";

const MAPKEYS = ["x", "y", "ZIndex", "width", "height", "visible", "focus"];
export default class Render {
    constructor() {
        this.wait = false;
        this.records = [];
        this.pointOfRecords = -1;
        this.nodes = [];
    }

    updateElement(tag, fn) {
        let fnResult = undefined;
        if (tag) {
            this.nodes.map((i) => {
                if (i.instance.tag === tag && typeof fn === "function") {
                    fnResult = fn.call(this, i.instance);
                }
            });
        }
        return new Promise(resolve => {
            resolve(fnResult)
        })
    }

    start() {
        return complier();
    }

    shot() {
        this.records.push(lodash.cloneDeep(this.nodes));
        this.pointOfRecords++
    }

    unDo() {
        this.pointOfRecords--
        return this.makeStep()
    }

    makeStep() {
        return new Promise(resolve => {
            const step = this.records[this.pointOfRecords] ? this.records[this.pointOfRecords][0] : undefined
            const preStep = lodash.cloneDeep(step)
            resolve(preStep)
        })
    }

    //分水岭的作用，前后create的节点渲染机制不一样，之前的为wait模式，之后的将不再顾及是否finished，直接渲染
    syncRender() {
        this.wait = true;
        this.nodes.map((i, k) => {
            //当前节点打上同步标签，表明其会被额外当成一个任务被同步的执行
            i.instance.tagWaitRener();
            if (k) {
                i.instance.hide();
            } else {
                i.instance.display();
            }
        });
    }

    nextRender(currentTag) {
        let stop = false;
        for (let i = 0, length = this.nodes.length; i < length; i++) {
            if (
                this.nodes[i].instance.tag !== currentTag &&
                !this.nodes[i].instance.visible
            ) {
                this.nodes[i].instance.display();
                stop = true;
                break;
            }
        }
        return stop;
    }

    finished(current) {
        if (current && this.wait && current.isTagWaitRender()) {
            this.wait = this.nextRender(current.tag);
        }
    }

    /**
     * 1：创建节点，你不可以直接更改view来更改视图，而是需要更改template转化的节点实例来
     * 2：依靠tag来区分节点，无tag会导致意料外问题
     * @param {*} template 模板
     * @param {*} tag 节点标识
     * @returns
     */
    create(template, tag) {
        if (!tag) {
            throw new Error("tag is required for new nodes");
        }
        const that = this;
        const cloneOfTemplate = lodash.cloneDeep(template);
        cloneOfTemplate.setTag(tag);
        let view = this.map(cloneOfTemplate);
        const instance = new Proxy(cloneOfTemplate, {
            set: function (obj, prop, value) {
                if (MAPKEYS.includes(prop)) {
                    that.nodes = that.nodes.map((i) => {
                        return {
                            instance: i.instance,
                            view:
                                i.instance.tag === obj.tag
                                    ? Object.freeze({...i.view, [prop]: value})
                                    : Object.freeze(i.view),
                        };
                    });
                }
                console.log('set', prop, value, obj, that.nodes)
                obj[prop] = value;
                return true;
            },
        });
        const item = {
            instance,
            view: Object.freeze(view),
        };
        return new Promise(resolve => {
            this.nodes.push(item);
            resolve(instance)
        });
    }

    getNodes() {
        return lodash.cloneDeep(this.nodes);
    }

    map(i) {
        return {
            x: i.x,
            y: i.y,
            visible: i.visible,
            width: i.width,
            height: i.height,
            ZIndex: i.ZIndex,
            tag: i.tag,
        };
    }
}
