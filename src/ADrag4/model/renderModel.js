import {cloneDeep} from "lodash";
import {Lines} from "../lines/lines";

const result = Symbol("items");
const shot = Symbol("shot");

export class RenderModel {
    constructor() {
        this.getInstance();
    }

    clearInstance() {
        RenderModel.instance = null;
    }

    getInstance() {
        if (!RenderModel.instance) {
            this.uuid = 0;
            this.adderId = 0;
            this[result] = [];
            this[shot] = [];
            RenderModel.instance = this;
        }
        return RenderModel.instance;
    }

    hasItemInsideProvider(item, DOMid) {
        const provider = document.getElementById(DOMid);
        const computedContainer = window.getComputedStyle(provider, null);
        const {height, width, left, top} = computedContainer;
        const area = this.computeArea({
            height: parseFloat(height),
            width: parseFloat(width),
            left: parseFloat(left),
            top: parseFloat(top),
        });
        return this.inside(area, item);
    }

    inside(area, item) {
        const {xL: leftNum, xR: rightNum, yT: topNum, yB: bottomNum} = area;
        const {w, h, x, y} = item;
        const l = x;
        const r = x + w;
        const t = y;
        const b = y + h;
        return l >= leftNum && r <= rightNum && t >= topNum && b <= bottomNum;
    }

    computeArea(args) {
        const {height, width, left, top} = args;
        if ([height, width, left, top].some((i) => typeof i !== "number")) {
            throw new Error("容器判断异常，参数类型错误");
        }
        return {
            leftTop: [left, top],
            leftBottom: [left, top + height],
            rightTop: [left + width, top],
            rightBottom: [left + width, top + height],
            xL: left,
            xR: left + width,
            yT: top,
            yB: top + height,
        };
    }

    getItems() {
        return cloneDeep(RenderModel.instance[result]);
    }

    getBackUpHistory() {
        return RenderModel.instance[shot];
    }

    backUp() {
        RenderModel.instance[shot].push(cloneDeep(RenderModel.instance[result]));
        new Lines().backUp();
    }

    setResult(data) {
        RenderModel.instance.clear();
        Array.isArray(data) &&
        data.length &&
        data.map((i) => {
            RenderModel.instance.create(i);
        });
    }

    iterateChange(fn) {
        if (typeof fn === "function") {
            const list = this.getItems();
            RenderModel.instance[result] = list.map((i, k) => fn.call(this, i, k));
        }
    }

    setShadow(id, openShadow) {
        this.iterateChange((i) => {
            if (i.id === id) {
                return {
                    ...i,
                    shadow: openShadow ? "drop-shadow(2px 2px 7px #1990ff)" : "",
                };
            } else {
                return i;
            }
        });
    }

    openShadow(id) {
        this.setShadow(id, true);
    }

    closeShadow(id) {
        this.setShadow(id, false);
    }

    hasConnect() {
        return RenderModel.instance[result].some((i) => !!i.shadow);
    }

    closeAllShadow() {
        this.iterateChange((i) => {
            return {...i, shadow: ""};
        });
    }

    clear() {
        RenderModel.instance[result] = [];
    }

    clearShots() {
        RenderModel.instance[shot] = [];
    }

    find(id) {
        return RenderModel.instance.getItems().filter((i) => i.id === id);
    }

    create(args) {
        /*
         * x x,
         * y y,
         * w 宽,
         * h 高,
         * f 聚焦,
         * z 层级,
         * c 组件,
         * m 弹窗组件
         * v 显示,
         * id 标识
         * renderData 数据
         * shadow 链接效果
         * renderKey 组件渲染标识
         * firstMounted 组件是否需要渲染，当你渲染的组件为图表时,这会很实用，你在组件的mounted状态内通过该属性来判断是否需要渲染，从而有效规避数据同步时组件数组指向变化导致的组件多次挂载渲染
         * nodeBackgroundColor 节点背景颜色 默认无，它会遮挡掉线
         */
        const {
            x, y, w, h, f, z, c, tag, m, id, renderKey, offsetX, providerOffsetY,
            providerOffsetX,
            offsetY
        } = args;
        const v = true;
        const renderData = Object.seal({});
        const onlyId = id || `node${RenderModel.instance.adderId++}`;
        const center = [x + w / 2, y + h / 2];
        //drop-shadow(2px 2px 7px #1990ff)'
        const shadow = "";
        const nodeBackgroundColor = "";
        const firstMounted = true;
        RenderModel.instance[result].push({
            x,
            y,
            w,
            h,
            f,
            z,
            c,
            v,
            m,
            id: onlyId,
            tag,
            renderData,
            center,
            shadow,
            firstMounted,
            renderKey,
            nodeBackgroundColor,
            offsetX,
            offsetY,
            providerOffsetY,
            providerOffsetX
        });
    }
}
