export class Service {
    constructor() {
        this.init();
    }

    autoGenKey() {
        return `node-${this.upCount++}`;
    }

    roleCheck(key) {
        return key in this.nodes
    }

    resetPointer() {
        this.prePointer = undefined
    }

    /**
     * redo
     */
    reDo() {
        if (typeof this.prePointer === "number") {
            const pointer = this.prePointer < 0 ? 0 : this.prePointer + 1
            this.prePointer++
            this.nodes = JSON.parse(JSON.stringify(this.commandHistory[pointer] || {}))
            return this.nodes
        }
    }

    /**
     * undo
     * @returns {*}
     */
    backToPre() {
        if (this.prePointer === undefined) {
            this.prePointer = this.commandHistory.length - 1
        }
        const pointer = this.prePointer < 0 ? 0 : this.prePointer - 1
        this.prePointer--
        this.nodes = JSON.parse(JSON.stringify(this.commandHistory[pointer] || {}))
        console.log(this.prePointer, 'this.prePointer')
        return this.nodes
    }

    /**
     * 获取备份
     * @returns {[]}
     */
    getCommandHistory() {
        return this.commandHistory;
    }

    /**
     * 备份命令
     * @param payload
     */
    backUpCommand() {
        console.log(this.commandHistory, 'this.nodes备份')
        this.commandHistory.push(JSON.parse(JSON.stringify(this.nodes)))
    }

    /**
     * 增加
     * @param from
     * @param to
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
        this.commandHistory = [];
        this.upCount = 0;
        this.prePointer = undefined;
        this.nodes = {};
    }

    find(key) {
        return this.nodes[key];
    }

    getAll() {
        return JSON.parse(JSON.stringify(this.nodes));
    }


    edit(key, payload, syncAdd = false) {
        if (!this._stopOperation) {
            if (key in this.nodes || syncAdd) {
                console.log(syncAdd)
                if (syncAdd) {
                    this.nodes[key] = {
                        body: {
                            value: {}
                        }
                    }
                }
                this.nodes[key] = {
                    ...JSON.parse(JSON.stringify(this.nodes[key] || {})),
                    ...payload,
                    body: {
                        value: Object.assign(this.nodes[key].body.value, payload.body.value)
                    }
                };
            }
        }
        this.resetPointer()
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
