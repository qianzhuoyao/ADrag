
export const VERTEX_CLASS = "VERTEX_CLASS.__VERTEX__CLASS__";
export const DRAG_STATE = Symbol.for("DRAG_STATE.__DRAG__");
export const RESIZE_STATE = Symbol.for("RESIZE_STATE.__RESIZE__");
export const BOUND_LENGTH = 4;
export const DEFAULT_DEEP = 10;
export const VERTEX_BORDER_TYPE="1px solid #e1e1e1"

export const CONTAINER_MODEL_MOVE=Symbol.for("CONTAINER_MODEL_MOVE")
export const CONTAINER_MODEL_STATIC=Symbol.for('CONTAINER_MODEL_STATIC')
export const MAX_VALUE = 999;
export const MAX_DEEP = MAX_VALUE;
export const POSITION_MAP = {
    a: "POSITION_MAP.top-left",
    b: "POSITION_MAP.top",
    c: "POSITION_MAP.top-right",
    e: "POSITION_MAP.left",
    f: "POSITION_MAP.right",
    g: "POSITION_MAP.bottom-left",
    h: "POSITION_MAP.bottom",
    i: "POSITION_MAP.bottom-right",
};
export const BLOCK_TYPE = {
    group: Symbol.for("BLOCK_TYPE.__GROUP__"),
    fragment: Symbol.for("BLOCK_TYPE.__FRAGMENT__"),
    container: Symbol.for("BLOCK_TYPE.__CONTAINER__"),
};
//操作误差
export const OPERATING_DIFFERENCE = 2;

export const MOVE_STATUS = {
    pending: Symbol.for("MOVE_STATUS.__pending__"),
    movable: Symbol.for("MOVE_STATUS.__movable__"),
    reject: Symbol.for("MOVE_STATUS.__reject__"),
};
/**
 * nodeClick
 * nodeResize
 * nodeResizeStart
 * nodeDragging
 * nodeDragStart
 * nodeDragFinish
 */
export const EVENT_LIST = [
    "nodeClick",
    "nodeResize",
    "nodeResizeStart",
    "nodeDragging",
    "nodeDragStart",
    "nodeDragFinish",
];
