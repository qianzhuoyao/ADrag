import Controller from "../controller";

export default class Message {
    constructor(connect) {
        this.singleton()
        if (connect) {
            this.connect = connect
        }
    }

    singleton() {
        if (!Message.instance) {
            this.connect = undefined
            Message.instance = this;
        }
        return Message.instance;
    }

    /**
     * 发起消息
     * @param from
     * @param to
     * @param msg
     */
    send(from, to, msg) {
        if (this.connect) {
            new Controller().runInstructions(this.connect, from, to, msg)
        }
    }

    /**
     *
     * @param initiator 发起人限定，只有发起人匹配的消息才可以被执行，null或者undefined则标识无差别匹配
     * @param msg 消息
     * @param fn 消息内容
     * @param cover 覆盖消息
     */
    accept(initiator, msg, fn, cover) {
        if (this.connect) {
            new Controller().defineInstructions(initiator, this.connect, msg, fn, cover)
        }
    }
}


