export const messageHead = (from, to) => {
    const msgKey = `${new Date().getTime()}`;
    return {
        from,
        to,
        msgKey,
    };
};
// 消息体内的数据是可以迁移的,方便群发
export const messagesBody = (value, msgKey) => {
    return {
        msgKey,
        value,
    };
};
