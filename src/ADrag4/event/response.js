/**

 * question:不同组件间的订阅操作，不依赖vuex or redux 之类的全局状态

 * example:

 * component:AC,BC,Responder

 *

 * const Responder =new Responder()

 * const namespace = Responder.createNameSpace('NAMESPACE')

 * Responder.orientation(namespace)

 * AC:

 *  Responder.orientation(namespace).sender('dc').locatingReceiver('kc').notify(()=>{

 *   log('AC 组件发送了信息，信息内容为AC')

 *   return RESULT

 * })

 *  const flns = this.$Responder.createNameSpace('flowDetails')

 const fl = this.$Responder.orientation(flns)

 fl.sender('ac').locatingReceiver('kc').message(this.va_po).notify(() => {

        // log('AC 组件发送了信息，信息内容为AC')

        console.log(this.va_po, 'this.va_po')

        return {

          value: this.va_po

        }

      }).unset()

 * Responder.orientation(namespace).sender('ac').locatingReceiver('bc').notify(()=>{

 *   log('AC 组件发送了信息，信息内容为AC')

 *   return RESULT

 * })

 * BC:

 * Responder.orientation(namespace).receiver('bc').locatingSender('ac').subscribe((RESULT)=>{

 *   //RESULT 为notify callback结果

 * })

 */

export default class Responder {

    constructor() {

        this.target = {}

    }





    /**

     * 定位命名空间

     * @param namespace

     * @returns {*}

     */

    orientation(namespace) {

        return this.target[namespace]

    }



    remove(namespace) {

        this.target[namespace] = undefined

    }



    clear() {

        this.target = {}

    }



    /**

     * 创建命名空间

     * @param key

     * @returns {string}

     */

    createNameSpace(key) {

        const randomKey = key || String(Math.random())

        if (!this.target[randomKey]) {

            this.target[randomKey] = new ResponderTarget()

        }

        return randomKey

    }





}



class ResponderTarget {

    constructor() {

        this.group = []

        this.subscribtion = {}

        this.currentTag = 0

        this.payload = new Map()

        this.senderStruct = {}

        this.receiverStruct = {}

        this.finishSubTags = []

    }



    createPromoter(s) {

        this.senderStruct.sender = s

        return this

    }



    acceptRecipient(r) {

        this.receiverStruct.receiver = r

        return this

    }



    directSender(ls) {

        this.receiverStruct.locatingSender = ls

        return this

    }



    createRecipient(lr) {

        this.senderStruct.locatingReceiver = lr

        return this

    }



    unset() {

        this.senderStruct = {}

    }



    clear() {

        this.group = []

    }



    /**

     * 建立数据包管道

     * 当存在流场景

     * 即 数据流 1 12 123

     * subscribe 订阅的内容也必须为1 12 123时使用message函数定义传送包

     * @param obj

     */

    message(obj) {

        const {locatingReceiver} = this.senderStruct

        this.payload.set(locatingReceiver + this.currentTag++, {

            pack: JSON.parse(JSON.stringify(obj))

        })

        return this

    }



    /**

     * 通知

     * @param fn

     * @returns {ResponderTarget}

     */

    notify(fn) {

        if (typeof fn === 'function') {

            this.group.push({

                senderStruct: this.senderStruct,

                batch: fn.bind(this),

                tag: this.currentTag

            })

        } else {

            this.group.push({

                senderStruct: this.senderStruct,

                batch: new Function(''),

                tag: this.currentTag

            })

        }

        return this

    }





    payloadParams(receiver, tag) {

        return this.payload.get(receiver + tag)

    }



    destroy() {

        this.clear()

        this.reset()

        this.subscribtion = {}

        this.currentTag = 0

        this.payload = new Map()

        this.senderStruct = {}

        this.receiverStruct = {}

    }



    reset() {

        this.finishSubTags = []

    }



    run(receiverStruct) {

        const {receiver, sender: locatingSender} = receiverStruct

        console.log(this.group, this.subscribtion, this.finishSubTags, receiverStruct, 'aa')

        this.group.map(async (i) => {

            const {senderStruct, batch} = i

            const {sender, locatingReceiver} = senderStruct

            const fn = this.subscribtion[locatingReceiver]

            if (typeof fn === "function") {

                const notice = await batch()

                if (!this.finishSubTags.includes(i.tag)) {

                    if (locatingSender && locatingReceiver) {

                        if (sender === locatingSender && receiver === locatingReceiver) {

                            fn({

                                sender: sender,

                                receiver: receiver,

                                notice,

                                payload: this.payloadParams(locatingReceiver, i.tag - 1)

                            })

                            this.finishSubTags.push(i.tag)

                        }

                    } else if (locatingSender && sender === locatingSender) {

                        fn({

                            sender: sender,

                            receiver: receiver,

                            notice,

                        })

                        this.finishSubTags.push(i.tag)

                    } else if (locatingReceiver && receiver === locatingReceiver) {

                        fn({

                            sender: sender,

                            receiver: receiver,

                            notice,

                            payload: this.payloadParams(locatingReceiver, i.tag - 1)

                        })

                        this.finishSubTags.push(i.tag)

                    } else {

                        //广播

                        fn({

                            sender: sender,

                            receiver: receiver,

                            notice,

                            payload: this.payloadParams(locatingReceiver, i.tag - 1)

                        })

                        this.finishSubTags.push(i.tag)

                    }

                }

            }

        })

        // this.payload.clear()

        return 0



    }



    /**

     * 订阅

     * @param fn

     * @returns {Promise<number>}

     */

    async subscribe(fn) {

        this.subscribtion[this.receiverStruct.receiver] = fn

    }

}
