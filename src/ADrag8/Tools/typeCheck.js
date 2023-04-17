export const truthIncludesZero = (value) => !!value || value === 0
export const isArray = (anything) => Array.isArray(anything)
export const listEachTruthIncludesZero = (list) => {
    if (isArray(list)) {
        return list.every(i => truthIncludesZero(i))
    } else {
        throw new TypeError(`params of listEachTruthIncludesZero is not a Array please check it,it is ${JSON.stringify(list)}`)
    }
}
export const isFunc = (a) => typeof a === "function"
export const paramsAllArray = (paramsList) => Array.isArray(paramsList) && paramsList.every(p => Array.isArray(p))
