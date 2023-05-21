import Group from "@/ADrag8/Group";
import Fragment from "@/ADrag8/Fragment";
import Render from "@/ADrag8/Render";
import {createMouseDown} from "@/ADrag8/Event/operation";
import {BLOCK_TYPE} from "@/ADrag8/Config/CONSTANT";
import {Container} from "@/ADrag8";
import {paramsAllArray} from "@/ADrag8/Tools/typeCheck";

/**
 * const block = new Fragment()
 * const group = new Group().createChild(block)
 * const container = new Container()
 * const render = new Render()
 * const scene = new Scene()
 * scene.createBlock(block)
 * scene.renderBlock(render)
 */
export default class Scene {
    constructor() {
        this._Key = 0;
        //组不会额外在视图内显示，它的内容应该一并在$Blocks内，它是一类数据集
        this.$Groups = [];
        this.$Blocks = {};
        this.$Containers = {};
        this.$CanvasModule = null;
    }

    createContainer(container) {
        if (container instanceof Container) {
            const key = `${BLOCK_TYPE.container.toString()}${this._Key++}`;
            container.setId(key);
            this.$Containers[key] = {container, key};
        } else {
            throw new ReferenceError(
                "createContainer container is not instance of Container"
            );
        }
    }

    /**
     * 创建块
     * @param block
     */
    createBlock(block) {
        if (block instanceof Fragment) {
            const key = `${BLOCK_TYPE.fragment.toString()}${this._Key++}`;
            block.setId(key);
            this.$Blocks[key] = {block, key};
        } else {
            throw new ReferenceError("createBlock block is not instance of Fragment");
        }
    }

    /**
     * 创建组
     * @param block
     */
    createGroup(block) {
        if (block instanceof Group) {
            this.$Groups.push(block);
        } else {
            throw new ReferenceError("createGroup block is not instance of Group");
        }
    }

    /**
     * 加载默认背景点击事件
     */
    loadDefaultEvent() {
        createMouseDown(
            document.body,
            () => {
                Object.values(this.$Blocks).map((i) => {
                    i.block.updateFocus(false);
                });
            },
            true
        );
        // this.clickBlock()
    }

    /**
     * 加载完事件并将fragment挂在到视图上
     * @param render
     * @param openDefaultFocusEvent
     */
    mount(render, openDefaultFocusEvent = true) {
        if (render instanceof Render) {
            render.load({
                blocks: this.$Blocks,
            }, render);
            openDefaultFocusEvent && this.loadDefaultEvent();
        }
    }

    /**
     * 转json
     * @returns {{Blocks: *[], Groups: *[], Containers: *[]}|string}
     */
    toJSON() {
        return {
            Containers: Object.values(this.$Containers).map((i) => {
                return i.container.toJSON();
            }),
            Blocks: Object.values(this.$Blocks).map((i) => {
                return i.block.fragmentToJSON();
            }),
            Groups: this.$Groups.map((i) => {
                return i.toJSON();
            }),
        };
    }

    /**
     * 加载json 配置项
     * @param sceneJSON
     */
    loadJSON(sceneJSON) {
        try {
            if (sceneJSON) {
                const {Containers, Blocks, Groups} = sceneJSON;
                if (paramsAllArray([Containers, Blocks, Groups])) {
                    Blocks.map((i) => {
                        const block = new Fragment();
                        block.insertCustomPack(i.pack);
                        block.setId(i.id);
                        block.initDeep(i.zIndex);
                        block.updateFocus(i.base.focus);
                        block.updateSize({
                            width: i.base.width,
                            height: i.base.height,
                            alone: true,
                        });
                        block.updatePosition({
                            x: i.base.x,
                            y: i.base.y,
                            alone: true,
                        });
                        block.updateDraggable(i.base.draggable);
                        i.base.lock
                            ? block.lock()
                            : block.unLock();
                        this.createBlock(block);
                    });
                    Containers.map((i) => {
                        const containerBlock = [];
                        const container = new Container(document.getElementById(i.DOM_ID));
                        container.setId(i._ID);
                        containerBlock.push(this.$Blocks[i._ID]);
                        container.pushBlocks(containerBlock);
                        this.createContainer(container);
                    });
                    Groups.map((i) => {
                        const group = new Group(i.id);
                        group.setDesc(i.desc);
                        i.children.map((child) => {
                            group.appendChild(this.$Blocks[child.id]);
                        });
                        this.createGroup(group);
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

}
