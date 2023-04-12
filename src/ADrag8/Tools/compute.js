import {POSITION_MAP} from "@/ADrag8/Config/CONSTANT";

export const computeOffset = (origin, mouse) => {
    if (origin instanceof HTMLElement) {
        const {left, top} = origin.getBoundingClientRect()
        const {pageX, pageY} = mouse
        return {
            offsetX: pageX - left,
            offsetY: pageY - top
        }
    }
}
export const positionMap = (code) => {
    return POSITION_MAP[code]
}
//计算vectex顶点的坐标 顺时针
export const computeVertex = (DOM, offset = 0) => {
    const {width, height} = window.getComputedStyle(DOM, null)
    const w = parseFloat(width)
    const h = parseFloat(height)
    return {
        //左上
        a: [0 - offset, 0 - offset],
        //上中
        b: [w / 2 - offset, 0 - offset],
        //右上
        c: [w - offset, 0 - offset],
        //左中
        e: [0 - offset, h / 2 - offset],
        //右中
        f: [w - offset, h / 2 - offset],
        //左下
        g: [0 - offset, h - offset],
        //下中
        h: [w / 2 - offset, h - offset],
        //右下
        i: [w - offset, h - offset]
    }
}
