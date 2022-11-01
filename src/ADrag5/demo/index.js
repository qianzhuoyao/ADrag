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
 * 创建名为name的链接
 */
new Message().createConnect('name')
/**
 * 在名为name的链接内接收名为update 的 消息 并执行console.log(arg, '接收成功')
 */
/**
 * example Message 可以有限的广播,但仅限于同个链接下的相同msg可以接受
 * 当connect不同时，相同msg无法构建链接
 * 当connect相同 msg不同时可以构建链接但无法通讯
 * 本库内，接收者与发送者应与box的key相同，他们被controller绑定
 *
 */
new Message('name').accept('keyD', 'update', (arg) => {
    console.log(arg, '接收成功1')
})
new Message('name').accept('keyB', 'update', (arg) => {
    console.log(arg, '接收成功2')
})
new Message('tag').accept('keyB', 'update', (arg) => {
    console.log(arg, '接收成功2')
})
/**
 * 在名为name的链接内发送update消息,发起者为keyB ，目标接收者为keyA
 */
new Message('name').send('keyB', 'keyA', 'update')
new Message('name').send('keyD', 'keyC', 'update')
