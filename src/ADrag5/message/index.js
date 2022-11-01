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
            this.connect = {}
            this.nameList = []
            Message.instance = this;
        }
        return Message.instance;
    }

    find(name) {
        return Message.instance.connect[name]
    }

    createConnect(name) {
        if (name && !(name in Message.instance.connect)) {
            Message.instance.connect[name] = this.createMsg({})
            Message.instance.nameList.push(name)
            return true
        }
        return false
    }

    createMsg({from, to, msg}) {
        return {
            from,
            to,
            msg
        }
    }

    /**
     * 通知某pack组件主动更新
     * @param to
     * @param Block
     * @param Package
     */
    callPackToUpdate(to, Block, Package) {
        if (this.connect) {
            new Controller().updateMsgPackPackage(to, Package)
            new Controller().updateMsgPackBlock(to, Block)
        }
    }

    /**
     * 通知某fragment组件主动更新
     * @param to
     * @param Block
     * @param Package
     */
    callFragmentToUpdate(to, Block, Package) {
        if (this.connect) {
            new Controller().updateMsgFragmentPackage(to, Package)
            new Controller().updateMsgFragmentBlock(to, Block)
        }
    }

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


