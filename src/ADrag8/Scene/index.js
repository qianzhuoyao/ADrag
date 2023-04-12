import Group from "@/ADrag8/Group";
import Fragment from "@/ADrag8/Fragment";
import Render from "@/ADrag8/Render";
import {createMouseClick} from "@/ADrag8/Event/operation";

const BLOCK_TYPE = {
    group: '__GROUP__',
    fragment: '__FRAGMENT__'
}
/**
 * const block = new Fragment()
 * const group = new Group().createChild(block)
 * const render = new Render()
 * const scene = new Scene()
 * scene.createBlock(block)
 * scene.renderBlock(render)
 */
export default class Scene {
    constructor() {
        this._Key = 0
        //组不会主动在视图内显示，它的内容应该一并在$Blocks内
        this.$Groups = []
        this.$Blocks = {}

    }

    /**
     * 创建块
     * @param block
     */
    createBlock(block) {
        if (block instanceof Fragment) {
            const key = `${BLOCK_TYPE.fragment}${this._Key++}`
            block.setId(key)
            this.$Blocks[key] = {block, key}
        } else {
            throw new ReferenceError('createBlock block is not instance of Fragment')
        }
    }

    /**
     * 创建组
     * @param block
     */
    createGroup(block) {
        if (block instanceof Group) {
            this.$Groups.push(block)
        } else {
            throw new ReferenceError('createGroup block is not instance of Group')
        }
    }


    /**
     * 加载默认背景点击事件
     */
    loadDefaultEvent() {
        createMouseClick(document.body, () => {
            Object.values(this.$Blocks).map(i => {
                i.block.$BaseObserver.updateFocus(false)
            })
        }, true)
        // this.clickBlock()
    }

    /**
     * 加载完事件并将fragment挂在到视图上
     * @param render 渲染器
     * @param openDefaultFocusEvent 开启默认的焦点模式
     */
    mountBlocks(render, openDefaultFocusEvent = true) {
        console.log(this.$Blocks, 'this.$Blocks')
        if (render instanceof Render) {
            render.load({
                blocks: this.$Blocks
            })
            openDefaultFocusEvent && this.loadDefaultEvent()
        }
    }
}
