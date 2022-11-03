import Message from "@/ADrag5/message";
import Controller from "@/ADrag5/controller";

/**
 * 新建BOX
 */
new Controller().createBox({
    key: 'keyA',
    pre: 'root',
    _package: {
        name: 'qzy',
        age: 23
    }
})
new Controller().createBox({
    key: 'keyB',
    pre: 'root',
    _package: {
        name: 'wj',
        age: 23
    }
})
console.log(new Controller().getBox())
/**
 * 在名为name的链接内接收名为update 的 消息 并执行console.log(arg, '接收成功')
 */
/**
 * Message传入参数后会自动创建对应的连接，如果相同名称连接已经存在则会加入其，当存在多个接收器时则都会被接收到
 * 即:
 * example Message 可以有限的广播,但仅限于同个链接下的相同msg可以接受
 * 当connect不同时，相同msg无法构建链接
 * 当connect相同 msg不同时可以构建链接但无法通讯
 * 本库内，接收者与发送者应与box的key相同，他们被controller绑定
 *
 */
//connectA 创建name 的连接 并接收来自keyD的名为update的消息,在收到update消息后执行函数fn
new Message('name').accept('keyD', 'update', (arg) => {
    console.log(arg, '接收成功1')
})
//connectB 创建name 的连接 并接收来自keyB的名为update的消息,在收到update消息后执行函数fn
new Message('name').accept('keyB', 'update', (arg) => {
    console.log(arg, '接收成功2')
})
//connectC 创建tag 的连接 并接收来自keyB的名为update的消息,在收到update消息后执行函数fn
new Message('tag').accept('keyB', 'update', (arg) => {
    console.log(arg, '接收成功3')
})
//connectD 不记名连接
new Message('noSender').accept(undefined, 'update', (arg) => {
    console.log(arg, '接收成功4')
})
/**
 * 在名为name的链接内发送update消息,发起者为keyB ，目标接收者为keyA
 * 此时connectB,connectA会接收到消息
 *
 */
new Message('name').send('keyB', 'keyA', 'update')
new Message('name').send('keyD', 'keyC', 'update')
/**
 * 由于没加入到连接内，此消息发送无效
 */
new Message().send('keyD', 'keyF', 'update')
/**
 * 由于无目标，此消息发送成功后将不会被接收
 */
new Message('noRecover').send('keyD', '', 'update')
/**
 * 由于无源头，此消息发送成功后将会被不记名连接接收器接收，connectD会接收到update的消息
 */
new Message('noSender').send('', 'keyH', 'update')
