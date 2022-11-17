## 介绍

这是一个可视化的方案,目的是实现以下内容

| 目标                             | 完成 | 优先级 |
| -------------------------------  | ---- | ------ |
| 库支持 vue2                      |      | 1      |
| 面板内容可以拖拽                   |      | 1      |
| 面板内容可以删除                   |      | 1      |
| 面板内容可以更改尺寸             |      | 1      |
| 可以出现辅助线并自定义线         |      | 2      |
| 可以自定义关系线                 |      | 2      |
| 可以实现线动画并自定义动画       |      | 3      |
| 面板操作记录可以 redo/undo       |      | 1      |
| 面板可以自适应布局               |      | 1      |
| 面板可以全屏并自适应             |      | 1      |
| 面板内容可以辅助.复制有限内容    |      | 2      |
| 面板内容应该有层级关系           |      | 1      |
| 面板内容可以由开发者自己决定更新 |      | 1      |
| 面板支持画笔                     |      | 3      |
| 面板支持 PDF 导出                |      | 2      |
| 面板背景支持上传                 |      | 2      |
| 面板内容可以自定义形状           |      | 3      |
| 面包可以导出一个 vue 的页面      |      | 3      |
| 面板内容可以定义事件             |      | 3      |
| 面板内容间可以沟通并可以互相更改 |      | 3      |
| 面板内容应该可以支持 api 调用    |      | 3      |

### 实现
 - template定义模板，模板由render类+mixture生成（pack(基础滑动单元),fragment（颗粒度复制单元）,provider（操作台））//
 - render 会 调用block（渲染层面）+boxGraph（数据层面） + event(事件层面) 来生成基础单元 mixture 与编辑
 - controller 宏观调控provider与slider的关系
 - service 服务
 - message mixture间通讯
 - observation 负责 将数据与视图绑定，数据更新视图一并更新

   message<=>controller<=>service=!=>observation=>render(template)
  

   mixture
   --------
   template
   --------------
   block+boxGraph

    

    message
    ----------
    controller
    -------
    service
    -----------
    observation
    ------
    render


```typescript
//可拖拽的滑块 
interface block{
    id:string,//reandom
    x:number,//toFixed(2) default 0
    y:number,//toFixed(2) default 0
    visible:boolean,//default true
    dragble:boolean,//default true
    resizable:boolean,//default true
    //height 与 width 应该由component决定
    height:number,//default 0
    width:number,//default 0
 }
 //graph
interface box {
            key:boxGraph,
}
/**
{

    nodeA:{
        nodeB:{
            nodeC:{}
        },
        nodeD:{}
    }
 * }
 */
interface render{
    box: {
        key:{
            key:box,
        }
    } //数据
    hasKey(key)=>boolean //是否存在key
    coverBox:(key)=>boolean //覆盖数据
    onHandleBox:(key)=>boolean //编辑数据
    findBox:(key)=>mixture //查找数据 只读
    removeBox:(key)=>box //删除数据
    clearBox:()=>boolean //清空数据
    takeBox:()=>box  //拿到所有数据
    makeBox:(key,mixture)=>box //设置数据
}

interface observation{
    subscription:(fn:function)=>void //订阅
    use:()=>fn() //消费订阅函数
}

interface controller{
    ids:string[], // block id 集合
    find:(id:string)=>mixture,//查找 mixture 只读
}
interface message{
    sender:mixtrueId //mixture的mixtrueId
    call:(mixtrueId)=>controller //通知
    reUpdate:()=>void //更新
}
interface mixture extend block{
     mixtrueId:string,//唯一mixture的id,message的sender就是其
     package:any,//mixtrue 携带的数据
}
interface fragment{
    entrance:VUECOMPONENT,//
    conveyorBelt:VUECOMPONENT, //
    mixture:mixture //extend block
}

interface provider{
    //mounted处
    /**
     * new controller()
     */
    data:{},
    id:string, //容器的DOMid
    MESSAGE:()=>message, // 控制
}

```

```VUE
template:
<provider ref='provider'></provider>
script:
this.msg = this.$refs.provider.MESSAGE()
```
