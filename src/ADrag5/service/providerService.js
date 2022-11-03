const aInB = (a, b) => {
    const {left: aLeft, top: aTop, width: aWidth, height: aHeight} = realBound(a)
    const {left: bLeft, top: bTop, width: bWidth, height: bHeight} = realBound(b)
    return aLeft >= bLeft && aTop <= bTop && (aLeft + aWidth) <= (bWidth + bLeft) && (aTop - aHeight) >= (bTop - bHeight)
}
const reactiveBound = (dom) => {
    return window.getComputedStyle(dom, null)
}
const toNumber = (a) => {
    return Number(String(a))
}
const realBound = (a) => {
    const DOM = document.getElementById(a)
    return {
        left: DOM ? toNumber(reactiveBound(DOM).left) : 0,
        top: DOM ? toNumber(reactiveBound(DOM).top) : 0,
        width: DOM ? toNumber(reactiveBound(DOM).width) : 0,
        height: DOM ? toNumber(reactiveBound(DOM).height) : 0,
    }
}
const boxInProvider = (boxId, providerId) => {
    if (!boxId || !providerId) {
        throw new Error('CHECK ERROR boxInProvider params >boxId/providerId< must be truth')
    }
    const box = document.getElementById(boxId)
    const provider = document.getElementById(providerId)
    return aInB(box, provider)
}
export {
    boxInProvider,
    realBound
}
