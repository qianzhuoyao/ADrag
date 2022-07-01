# ADrag3

这是一个拖拽与操作框架,可以帮助你管理并控制整个拖拽操作流程中的节点创建,更新,与记录

* ** hook 一个事件注册器,可以快速的通过id来给对应的DOM绑定拖拽中的开始,移动进行中,移动结束三个事件
* ** load 加载整个操作过程中的组件的节点信息,有静态配置文件config,转译为有效节点信息compiler,基础信息template,实例信息node
* ** render 一个调度渲染器，它可以有效的控制大量消耗资源或者耗时的组件渲染的时机,也可以对整个面板操作的一个记录

## process

* ** config(load) -> compiler(load) -> node(load)
* ** 借助 event(hook) 来对 所有有效的node(load 同第一行最后) 进行控制 并最终渲染在VUE的组件内

## example

创建节点

* ** 你需要显式的先声明一个渲染器并开启操作(start)

```JavaScript
//实例渲染器
this.render = new Render();
//构建一个模板,所有的node需要基于渲染器生成的模板来操作,start会返回一个模板的数组,该模板来源于LOAD内的compiler
this.templates = this.render.start();
//确保dom已经渲染上,为event准备，避免元素不存在
setTimeout(() => {
    //给每个模板绑定事件
    this.templates.forEach(i => {
        new PipeEvent()
            //设置拖拽元素
            .setDragElement(`drag${i.tag}`)
            //设置来源元素
            .setCopyElement(`origin${i.tag}`)
            //默认隐藏拖拽元素
            .dragElementHide()
            //操作回调
            .pipeEventStart({
                //按下 pipe 为PipeEvent该实例本身
                downCallback: (pipe) => {
                },
                //移动 pipe 为PipeEvent该实例本身
                moveCallback: (pipe) => {
                },
                //放起 pipeOver 为PipeEvent该实例本身 e为放弃的原生事件对象
                overCallback: (pipeOver, e) => {
                    //放起后隐藏拖拽元素
                    pipeOver.dragElementHide();
                    //开始依赖模板进行创建渲染流程 createAPI 返回一个promise,resolve其节点实例本身（注：所有的操作都应基于模板节点实例本身）
                    this.render.create(i, this.view.length + 1).then(tem => {
                        //设置节点位置
                        tem.setPosition({
                            x: e.x,
                            y: e.y
                        })
                        //设置节点大小
                        tem.setSize({
                            w: 100,
                            h: 100
                        })
                        //设置节点层级
                        tem.setZIndex(999)
                    }).then(() => {
                        //打个快照，方便undo
                        this.render.shot()
                        //更换vue组件的Array 指针，更新视图
                        this.view = this.render.getNodes()
                    })
                },
            });
    })
}, 0)
```