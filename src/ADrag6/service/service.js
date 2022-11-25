export class Service {
    constructor() {
        this.init();
    }

    autoGenKey() {
        return `node-${Object.keys(this.nodes).length}`;
    }

    insideCheck(key) {
        return key in this.nodes
    }

    getCommandHistory() {
        return this.commandHistory;
    }

    backUpCommand(from, to, patchOrder, payload) {
        if (this.commandHistory) {
            this.commandHistory.push({from, to, patchOrder, payload})
        }
    }

    /**
     * 增加
     * @param {} payload
     */
    create(from, to, payload) {
        const key = this.autoGenKey();
        this.edit(key, {
            body: payload,
            from,
            to,
            key: key,
        }, true);
        return key
    }

    /**
     * 他会终止消息传递时的变更
     * 当某个update命令执行时，你仅仅需要变更某一种条件
     * 假设你需要变更来自于node-0 到 node-1的命令
     * 此时同时来自node-2到node-1的命令如果不调用stop(),则会影响值（nodes）
     * 你在多个变更筛选时很有用
     */
    stop() {
        this._stopOperation = true;
    }

    /**
     * 解除禁止
     */
    unStop() {
        this._stopOperation = false;
    }

    init() {
        // this.msgKey = undefined;
        this.commandHistory = []
        this.nodes = {};
    }

    find(key) {
        return this.nodes[key];
    }

    getAll() {
        return JSON.parse(JSON.stringify(this.nodes));
    }

    // currentMsgKey(key) {
    //     this.msgKey = key;
    // }

    edit(key, payload, syncAdd = false) {
        if (!this._stopOperation) {
            if (key in this.nodes || syncAdd) {
                this.nodes[key] = {
                    ...this.nodes[key],
                    ...payload,
                };
            }
        }
        this.unStop();
    }

    clear() {
        this.nodes = {}
    }

    remove(key) {
        if (key in this.nodes) {
            delete this.nodes[key];
        }
    }
}
