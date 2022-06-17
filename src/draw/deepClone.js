export const deepClone = (data, hash = new WeakMap()) => {
    if (typeof data !== 'object' || data === null) {
        throw new TypeError('传入参数不是对象')
    }
    if (hash.has(data)) {
        return hash.get(data)
    }
    let newData = {};
    const dataKeys = Object.keys(data);
    dataKeys.forEach(value => {
        const currentDataValue = data[value];
        if (typeof currentDataValue !== "object" || currentDataValue === null) {
            newData[value] = currentDataValue;
        } else if (Array.isArray(currentDataValue)) {
            newData[value] = [...currentDataValue];
        } else if (currentDataValue instanceof Set) {
            newData[value] = new Set([...currentDataValue]);
        } else if (currentDataValue instanceof Map) {
            newData[value] = new Map([...currentDataValue]);
        } else {
            hash.set(data, data)
            newData[value] = deepClone(currentDataValue, hash);
        }
    });
    return newData;
}