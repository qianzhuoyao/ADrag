/**
 * 信息头
 * @param from
 * @param to
 * @returns {{from, msgKey: string, to}}
 */
export const messageHead = (from, to) => {
    const msgKey = `${JSON.parse(JSON.stringify(new Date().getTime()))}`;
    return {
        from,
        to,
        msgKey,
    };
};

/**
 * 信息体
 * @param value
 * @param msgKey
 * @returns {{msgKey, value}}
 */
export const messagesBody = (value, msgKey) => {
    return {
        msgKey,
        value,
    };
};
