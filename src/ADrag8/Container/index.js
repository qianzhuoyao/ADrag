import {Fragment} from "@/ADrag8";
import {computeDomPositionAndSize} from "@/ADrag8/View";
import BaseParam from "@/ADrag8/BaseParam";

export default class Container {
    constructor(containerDom = document.body) {
        this._ID = 0
        this.$ContainerDom = Object.seal(containerDom)
        this.$ContainerWidth = computeDomPositionAndSize(this.$ContainerDom).width
        this.$ContainerHeight = computeDomPositionAndSize(this.$ContainerDom).height
        this.$ContainerLeft = computeDomPositionAndSize(this.$ContainerDom).left
        this.$ContainerTop = computeDomPositionAndSize(this.$ContainerDom).top
        this._Children = []
    }

    setId(ID) {
        this._ID = ID
    }


    getId() {
        return this._ID
    }

    /**
     * 去除某个block
     * @param blockKey
     */
    removeBlocks(blockKey) {
        if (Array.isArray(this._Children)) {
            this._Children = this._Children.map(i => {
                if (i instanceof Fragment) {
                    //消除容器
                    if (blockKey === i.$Id) {
                        i.removeContainer()
                    }
                }
                return i
            })
        }
    }

    /**
     * 移除所有block
     */
    clearBlocks() {
        if (Array.isArray(this._Children)) {
            this._Children.map(i => {
                if (i instanceof Fragment) {
                    //消除容器
                    i.removeContainer()
                }
            })
            this._Children = []
        }
    }

    /**
     * 为容器添加blocks, 他会重置block的_Container属性,
     * @param blocks
     */
    pushBlocks(blocks) {
        if (Array.isArray(blocks)) {
            blocks.map(i => {
                if (i instanceof Fragment) {
                    this._Children.push(i)
                    //共享容器
                    i.setContainer(this)
                }
            })
        }
    }

    paint() {
        if (this.$ContainerDom instanceof HTMLElement) {
            this.$ContainerDom.style.position = 'absolute'
            this.$ContainerDom.style.left = this.$ContainerLeft + 'px'
            this.$ContainerDom.style.top = this.$ContainerTop + 'px'
            this.$ContainerDom.style.width = this.$ContainerWidth + 'px'
            this.$ContainerDom.style.height = this.$ContainerHeight + 'px'
        }
    }

    /**
     * 计算动态边界
     * @param x
     * @param y
     * @param width
     * @param height
     * @returns {{outBoundRight: boolean, outBoundTop: boolean, _In: boolean, outBoundBottom: boolean, outBoundLeft: boolean}}
     */
    calculateDynamicBound({x, y, width, height}) {
        const {left, top, right, bottom} = computeDomPositionAndSize(this.$ContainerDom)
        return {
            outBoundLeft: x <= left,
            outBoundRight: (x + width) >= right,
            outBoundTop: y <= top,
            outBoundBottom: (y + height) >= bottom,
            _In: x > left && (x + width) < right && y > top && (y + height) < bottom
        }
    }

    setSize({width, height}) {
        this.$ContainerWidth = width || this.$ContainerWidth
        this.$ContainerHeight = height || this.$ContainerHeight
        this.paint()
    }

    mouseInContainer(evt) {
        if (evt instanceof Event) {
            const {pageX, pageY} = evt
            const {left, top, right, bottom} = computeDomPositionAndSize(this.$ContainerDom)

            return pageX >= left && pageX <= right && pageY >= top && pageY <= bottom
        } else {
            throw new TypeError('evt not instanceOf Event please check it')
        }
    }

    /**
     * 计算静态边界
     * @param baseObserver
     * @param difference 操作导致的误差校验
     * @param baseObserver
     * @param difference
     * @returns {{outBoundRight: boolean, outBoundTop: boolean, _in: boolean, outBoundBottom: boolean, outBoundLeft: boolean}}
     */
    blockInContainer(baseObserver, difference = 0) {
        if (baseObserver instanceof BaseParam) {
            const {$Position: {$X, $Y}, $Size: {$Width, $Height}} = baseObserver
            const {left, top, right, bottom} = computeDomPositionAndSize(this.$ContainerDom)
            console.log($X, $Y, left, top, right, bottom, 'blockInContainer')
            return {
                left,
                top,
                right,
                bottom,
                outBoundLeft: $X <= (left - difference),
                outBoundRight: ($X + $Width) >= (right + difference),
                outBoundTop: $Y <= (top - difference),
                outBoundBottom: ($Y + $Height) >= (bottom + difference),
                //如果_restricted 为false 表明 无论何时 都算在容器内
                _in: $X > (left - difference) && ($X + $Width) < (right + difference) && $Y > (top - difference) && ($Y + $Height) < (bottom + difference)
            }
        } else {
            throw new TypeError('block not instanceOf Fragment please check it')
        }
    }

    setPosition({x, y}) {
        this.$ContainerLeft = x || this.$ContainerLeft
        this.$ContainerTop = y || this.$ContainerTop
        this.paint()
    }
}
