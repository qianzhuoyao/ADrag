export const VERTEX_CLASS = '__VERTEX__CLASS__'
export const DRAG_STATE = '__DRAG__'
export const RESIZE_STATE = '__RESIZE__'
export const BOUND_LENGTH = 4
export const DEFAULT_DEEP = 10
export const MAX_VALUE = 999999
export const MAX_DEEP = MAX_VALUE
export const POSITION_MAP = {
    a: 'top-left',
    b: 'top',
    c: 'top-right',
    e: 'left',
    f: 'right',
    g: 'bottom-left',
    h: 'bottom',
    i: 'bottom-right'
}
export const BLOCK_TYPE = {
    group: '__GROUP__',
    fragment: '__FRAGMENT__',
    container: '__CONTAINER__'
}
//操作误差
export const OPERATING_DIFFERENCE = 2

export const MOVE_STATUS = {
    pending: '__pending__',
    movable: '__movable__',
    reject: '__reject__'
}
/**
 * nodeClick
 * nodeResize
 * nodeResizeStart
 * nodeDragging
 * nodeDragStart
 * nodeDragFinish
 */
export const EVENT_LIST = ['nodeClick', 'nodeResize', 'nodeResizeStart', 'nodeDragging', 'nodeDragStart', 'nodeDragFinish']
