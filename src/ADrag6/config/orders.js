export const ORDER = Object.freeze({
    /**
     * 创建
     */
    CREATE: "CREATE",
    /**
     * 升级
     */
    UPDATE: "UPDATE",
    /**
     * 删除
     */
    REMOVE: "REMOVE",
    /**
     * 清空
     */
    CLEAR: "CLEAR",
    /**
     * 查找
     */
    FIND: "FIND",
    /**
     * 获取全部
     */
    GET: "GET",
    /**
     * 备份命令
     */
    HISTORY_COMMAND: "HISTORY_COMMAND",
    /**
     * 获取备份
     */
    GET_HISTORY_COMMAND: "GET_HISTORY_COMMAND",
    /**
     *获取上一步数据
     */
    BACK_TO_HISTORY_COMMAND: "BACK_TO_HISTORY_COMMAND",
    /**
     * 重置历史指针
     */
    RESET_POINTER:"RESET_POINTER"
});
