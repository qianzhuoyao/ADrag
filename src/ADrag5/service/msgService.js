export default class MsgService {
    constructor(service) {
        this.singleton(service)
    }

    singleton(service) {
        if (!MsgService.instance) {
            /**
             * {
             *     connectName1:{
             *         update:[
             *             {...},
             *             {...}
             *         ]
             *     }
             * }
             * @type {{}}
             */
            this.instructions = {}
            this.service = service
            MsgService.instance = this;
        }
        return MsgService.instance;
    }

    acceptMsg(initiator, connect, msg, fn) {
        if (connect && typeof fn === "function" && MsgService.instance.service) {
            MsgService.instance.instructions[connect] = MsgService.instance.instructions[connect] || {}
            MsgService.instance.instructions[connect][msg] = MsgService.instance.instructions[connect][msg] || []
            if (Array.isArray(MsgService.instance.instructions[connect][msg])) {
                const callItem = {
                    connect,
                    initiator,
                    reactive: (sender, recipient) => fn({
                        connect,
                        sender,
                        recipient,
                        senderBlock: MsgService.instance.service.takeBlock(sender),
                        senderPackage: MsgService.instance.service.takePackage(sender),
                        recipientBlock: MsgService.instance.service.takeBlock(recipient),
                        recipientPackage: MsgService.instance.service.takePackage(recipient),
                    })
                }
                MsgService.instance.instructions[connect][msg].push(callItem)
            }

        }
    }

    sendMsg(connectName, from, to, msg) {
        console.log(MsgService.instance.instructions[connectName])
        if (MsgService.instance.instructions[connectName]) {
            if (Array.isArray(MsgService.instance.instructions[connectName][msg])) {
                MsgService.instance.instructions[connectName][msg].map(i => {
                    if (i.initiator === from || [null, undefined].includes(i.initiator)) {
                        i.reactive(from, to)
                    }
                })
            }
        }
    }
}
