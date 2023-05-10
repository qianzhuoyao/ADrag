## Install and basic usage
### 一个可以帮助你控制并管理拖拽流程的开箱即用的VUE组件(vue2)
![](https://media.giphy.com/media/kZcIgukLK6qHv5pKjg/giphy.gif)
```bash
$ npm i -s adrag
```


Register the component:

```js
import {fragment,provider} from "adrag";
Vue.component('provider', provider)
Vue.component('fragment', fragment)
```

Use the component:

```vue
<template>
  <div>
    <div @click="aiderComputed">aider开启</div>
    <div @click="aiderClear">aider关闭</div>
    <div @click="undo">undo</div>
    <div @click="zoomOut">放大</div>
    <div @click="zoomIn">缩小</div>
    <fragment
        tag="1"
        render-key="123"
        :put-component="components[0]"
        :modal-component="components[2]"
        :default-component-height="100"
        :default-component-width="100"
        :put-offset-x="10"
        :put-offset-y="20"
        :move-offset-y="0"
        :move-offset-x="0"
        :default-component-z-index="999"
        @fragmentDown="fragmentDown"
        @fragmentMove="fragmentMove"
        @fragmentOver="fragmentOver"
    >
      <template #display>
        <div>123</div>
      </template>
      <template #hide>
        <div>345</div>
      </template>
    </fragment>
    <provider ref="provider"
              :tags="['1']"
              :modal-offset-x="0"
              :modal-offset-y="0"
              style="background: antiquewhite;top:300px">
    </provider>
  </div>
</template>

<script>
import fragment from "@/ADrag4/view/fragment";
import provider from "@/ADrag4/view/provider";
import drag from '@/component/d'
import o from '@/component/o'
import f from '@/component/p'

export default {
  name: "App",
  components: {fragment, provider},
  data: () => {
    return {
      aider: false,
      components: [drag, o, f],
    };
  },
  mounted() {
    this.beforeStart()
    this.$refs.provider.on('componentClick', (o) => {
      console.log(o, 'componentClick')
    })
    this.$refs.provider.on('dragging', (o) => {
      console.log(o, 'dragging')
    })
    this.$refs.provider.on('dragStop', (o) => {
      console.log(o, 'dragStop')
    })
    this.$refs.provider.on('resizing', (o) => {
      console.log(o, 'resizing')
    })
    this.$refs.provider.on('areaClick', (o) => {
      console.log(o, 'areaClick')
    })
    this.$refs.provider.on('resizeStop', (o) => {
      console.log(o, 'resizeStop')
    })
    this.$refs.provider.on('hover', (o) => {
      console.log(o, 'hover')
    })
    this.$refs.provider.on('leave', (o) => {
      console.log(o, 'leave')
    })
    this.$refs.provider.on('lineClick', (o) => {
      console.log(o, 'lineClick')
    })
    this.$refs.provider.on('menuItemClick', (o) => {
      console.log(o, 'menuItemClick')
    })
  },
  methods: {
    zoomOut() {
      this.$refs.provider.amplification(10)
    },
    zoomIn() {
      this.$refs.provider.narrow(10)
    },
    toConnect() {
    },
    undo() {
      this.$refs.provider.undo()
      if (this.aider) {
        this.$refs.provider.openAider()
      } else {
        this.$refs.provider.closeAider()
      }
    },
    aiderClear() {
      this.aider = false
      this.$refs.provider.closeAider()
    },
    aiderComputed() {
      this.aider = true
      this.$refs.provider.openAider()
    },
    fragmentMove(p) {
      console.log(p, 'fragmentMove')
    },
    fragmentDown(p) {
      console.log(p, 'fragmentDown')
    },
    fragmentOver(p) {
      console.log(p, 'fragmentOver')
    },
  },

};
</script>

<style>
</style>

```

### Props of fragment

#### tag
Type: `Boolean`|`String`|`Number` <br>
Required: `false`<br>
Default: `a_default_fragment`

确定组件标识 用于被 容器区分 (provider)

```html
<fragment tag='tag'>
```

#### moveOffsetX
Type: `Number`<br>
Required: `false`<br>
Default: `0`

鼠标绑定的拖拽DOM的横向偏移量

```html
<fragment :moveOffsetX="10">
```

#### moveOffsetY
Type: `Number`<br>
Required: `false`<br>
Default: `0`

鼠标绑定的拖拽DOM的纵向偏移量

```html
<fragment :moveOffsetY="10">
```

#### putOffsetX
Type: `Number`<br>
Required: `false`<br>
Default: `0`

容器内第一次放置组件时的横向偏移量,一般与moveOffsetX相同

```html
<fragment :putOffsetX="10">
```
#### putOffsetY
Type: `Number`<br>
Required: `false`<br>
Default: `0`

容器内第一次放置组件时的纵向偏移量,一般与moveOffsetY相同

```html
<fragment :putOffsetY="10">
```
#### renderKey
Type: `String`<br>
Required: `true`<br>
Default: `''`

用于渲染标识，它必须是truth的
```html
<fragment renderKey="renderKey">
```

#### defaultComponentWidth
Type: `Number`<br>
Required: `false`<br>
Default: `100`

定义组件放置后的初始长度。


```html
<fragment :defaultComponentWidth="100">
```

#### defaultComponentHeight
Type: `Number`<br>
Required: `false`<br>
Default: `100`

定义组件放置后的初始高度。


```html
<fragment :defaultComponentHeight="100">
```
#### defaultComponentZIndex
Type: `Number`<br>
Required: `false`<br>
Default: `999`

定义组件放置后的初始层级。


```html
<fragment :defaultComponentZIndex="100">
```
#### putComponent
Type: `VUEcomponent`<br>
Required: `true`<br>
Default: `{}`

放置的组件
```JavaScript
import COMPONENT from 'COMPONENT'
components:{COMPONENT}
```
```html
<fragment :putComponent="COMPONENT">
```

#### modalComponent
Type: `VUEcomponent`<br>
Required: `false`<br>
Default: `{}`


绑定的弹窗组件
```JavaScript
import COMPONENT from 'COMPONENT'
components:{COMPONENT}
```
```html
<fragment :modalComponent="COMPONENT">
```
### event of fragment
- EventPipe 是封装的事件类,它可以修改拖拽过程中的元素
  详细见<a href="https://www.npmjs.com/package/adragging">addraging(npm)</a>
#### fragmentDown
params: `pipe`<br>
paramsType: `EventPipe`<br>
开始拖拽，鼠标按下

```html
<fragment @fragmentDown="fragmentDown">
```
```JavaScript
methods:{
    fragmentDown(pipe){
        ...
    }
}
```
#### fragmentMove
params: `pipe`<br>
paramsType: `EventPipe`<br>
拖拽中

```html
<fragment @fragmentMove="fragmentMove">
```
```JavaScript
methods:{
    fragmentMove(pipe){
        ...
    }
}
```
#### fragmentOver
params: `pipe`<br>
paramsType: `EventPipe`<br>
拖拽结束

```html
<fragment @fragmentOver="fragmentOver">
```
```JavaScript
methods:{
    fragmentOver(pipe){
        ...
    }
}
```
### Props of provider

#### tags
Type: `Array` <br>
Required: `true`<br>
Default: `[a_default_fragment]`

用于容纳对应tag在tags内的组件，如果组件tag不在其tags内，那么那个组件将不能在其上放置

```html
<provider :tags="['tag']"">
```
#### pid
Type: `String` <br>
Required: `false`<br>
Default: `providerId`

同容器的id

```html
<provider pid="id">
```
#### modalOffsetY
Type: `Number` <br>
Required: `false`<br>
Default: `0`

容器上组件触发的弹窗纵向偏移量

```html
<provider :modalOffsetY="0">
```
#### modalOffsetX
Type: `Number` <br>
Required: `false`<br>
Default: `0`

容器上组件触发的弹窗横向偏移量

```html
<provider :modalOffsetX="0">
```

#### parentH
Type: `Number` <br>
Required: `false`<br>
Default: `2000`

容器高度

```html
<provider :parentH="2000">
```
#### parentW
Type: `Number` <br>
Required: `false`<br>
Default: `2000`

容器宽度

```html
<provider :parentW="2000">
```

### refs function of provider
- provider内的所有内容是不可见的，当你需要修改内容时，你需要通过$refs调用函数的方式来达到目的
- 数据结构
```TypeScript
 /*
         * x x,
         * y y,
         * w 宽,
         * h 高,
         * f 聚焦,
         * z 层级,
         * c 组件,
         * m 弹窗组件
         * v 显示,
         * id 标识
         * renderData 数据
         * shadow 链接效果
         * firstMounted 组件是否需要渲染，当你渲染的组件为图表时,这会很实用，你在组件的mounted状态内通过该属性来判断是否需要渲染，从而有效规避数据同步时组件数组指向变化导致的组件多次挂载渲染
         */
        interface render {
             x:number, 
             y:number, 
             w:number,
             h:number, 
             f:boolean, 
             z:number, 
             c:VueCompoent, 
             v:boolean, 
             m:VueCompoent,
             id:(number|string)[],
             tag:number|string|boolean, 
             renderData:any,
             center:number[],
             shadow:string,
             firstMounted:boolean
}
```
#### openAnimation
params: `(speed,buoyWidth)`<br>
paramsNote: `(动画速度默认30,动点长度默认10)`<br>
paramsType: `(number,number)`<br>
开启动画

```JavaScript
 this.$refs.provider.openAnimation()
```
#### closeAnimation
params: `-`<br>
paramsNote: `无`<br>
paramsType: `undefined`<br>
关闭动画

```JavaScript
 this.$refs.provider.openAnimation()
```
#### amplification
params: `px`<br>
paramsNote: `放大的像素`<br>
paramsType: `number`<br>
同步放大所有组件

```JavaScript
this.$refs.provider.amplification(10)//放大10像素
```
#### narrow
params: `px`<br>
paramsNote: `缩小的像素`<br>
paramsType: `number`<br>
同步缩小所有组件

```JavaScript
this.$refs.provider.narrow(10)//缩小10像素
```

#### remove
params: `-`<br>
paramsNote: `无参数`<br>
paramsType: `undefined`<br>
销毁provider,销毁后 provider将无任何作用，用于重置

```JavaScript
this.$refs.provider.remove()
```
#### sharkHiddenNodes
params: `-`<br>
paramsNote: `无参数`<br>
paramsType: `undefined`<br>
获取所有非隐藏的节点

```JavaScript
this.$refs.provider.sharkHiddenNodes()
```

#### getAllData
params: `-`<br>
paramsNote: `无参数`<br>
paramsType: `undefined`<br>
获取所有节点包含隐藏的

```JavaScript
this.$refs.provider.getAllData()
```

#### draw
params: `data`<br>
paramsNote: `需要绘制的数据`<br>
paramsType: `render[]`<br>
绘制

```JavaScript
this.$refs.provider.draw(renderData)
```
#### updateComponent
params: `(key, fn, tag)`<br>
paramsNote: `(属性名，回调，tag)`<br>
paramsType: `(Object.keys(render).filter(i=>i!=='renderData'),fn,tag)`<br>
仅更新组件除了renderData的所有属性，返回值更新到对应组件的属性值

```JavaScript
props:{
    thisData:{} //所有组件都会被注入的本组件信息
}
this.$refs.provider.updateComponent('v',(i)=>{
    if(i.id===this.thisData.id){
        return ...
    ...
}},this.thisData.tag)
```

#### updateData
params: `(fn, tag)`<br>
paramsNote: `(回调，tag)`<br>
paramsType: `(fn,tag)`<br>
仅更新renderData属性,返回值更新到对应组件的renderData

```JavaScript
props:{
    thisData:{} //所有组件都会被注入的本组件信息
}
this.$refs.provider.updateData((i)=>{
    if(i.id===this.thisData.id){
        return {...}
    ...
}},this.thisData.tag)
```
#### undo
params: `-`<br>
paramsNote: `无参数`<br>
paramsType: `undefined`<br>
回退，注意，在辅助线开启期间无法使用本功能（todo）

```JavaScript
this.$refs.provider.undo()
```
#### openAider
params: `-`<br>
paramsNote: `无参数`<br>
paramsType: `undefined`<br>
开启辅助线，此时在组件与被移动组件接近时会自动吸附

```JavaScript
this.$refs.provider.openAider()
```
#### closeAider
params: `-`<br>
paramsNote: `无参数`<br>
paramsType: `undefined`<br>
关闭辅助线，

```JavaScript
this.$refs.provider.closeAider()
```
#### on
- 它所有容器内触发事件的回调，下文见on详细介绍
  params: `(event, callback)`<br>
  paramsNote: `(事件名，回调)`<br>
  paramsType: `(string,fn)`<br>
  callbackParams:`用的时候打印下吧`<br>
  触发事件
```JavaScript
const _event={
    //弹窗点击
 _MIC: 'menuItemClick',
 //弹窗鼠标抬起，与menuItemClick区别为menuItemClick会接受弹窗组件的发出值，而menuUp不会
  _MEU: 'menuUp',
  //鼠标放起
  _MU: 'mouseUp',
  //连线点击
  _LC: 'lineClick',
  //组件点击
  _CL: 'componentClick',
  //组件拖动中
  _DI: 'dragging',
  //组件拖动结束
  _DS: 'dragStop',
  //组件缩放中
  _RI: 'resizing',
  //面板点击
  _AC: 'areaClick',
  //组件缩放结束
  _RS: 'resizeStop',
  //组件鼠标悬浮
  _HO: 'hover',
  //鼠标离开组件上
  _LE: 'leave'
}
//event 是_event 的对应的value，注意下
```
```JavaScript

this.$refs.provider.on('hover',(args)=>{
  console.log(args,'hover');
})
```
#### getAllLines
params: `-`<br>
paramsNote: `无参数`<br>
paramsType: `undefined`<br>
获取所有线

```JavaScript
this.$refs.provider.getAllLines()
```

### props of component
- 包含 putComponent/modalComponent
```vue
<template>
  <ul>
    <li @click="onConnect">
      <a>onConnect</a>
    </li>
    <li @click="disConnect">
      <a>disConnect</a>
    </li>
    <li @click="clearConnectSelf">
      <a>clearConnect</a>
    </li>
    <li @click="closeOverSelf">
      <a>closeOver</a>
    </li>
    <li @click="del">
      <a>del</a>
    </li>
    <li @click="menuItemClickSelf">
      <a>上传一个对象</a>
    </li>
  </ul>
</template>

<script>
export default {
  name: "view-c",
  props: {
    clearConnect: {
      type: Function,
      default: new Function('')
    },
    updateData: {
      type: Function,
      default: new Function('')
    },
    closeConnect: {
      type: Function,
      default: new Function('')
    },
    //menuItemClick仅modalComponent具备
    menuItemClick: {
      type: Function,
      default: new Function('')
    },
    closeOver: {
      type: Function,
      default: new Function('')
    },
    connect: {
      type: Function,
      default: new Function('')
    },
    change: {
      type: Function,
      default: new Function('')
    },
    thisData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data: () => {
    return {
      ns: {},
    };
  },
  watch: {
    thisData: {
      handler(n) {
        console.log(n, 'nnn')
      }, deep: true,
      immediate: true
    }
    // node: {
    //   handler(n) {
    //     this.ns = n;
    //     console.log(n, "view");
    //     setTimeout(() => {
    //      this.$emit('finished',n.instance.tag)
    //     }, 2000);
    //   },
    //   immediate:true,
    //   deep:true
    // },
  },
  mounted() {
  },
  methods: {
    //发出值，会被on的event为"menuItemClick"的回调接受为其参数
    menuItemClickSelf(){
      this.menuItemClick({
        a:1
      })
    },
    //隐藏该节点
    del() {
      this.change('v', (i) => {
        console.log(213)
        if (i.id === this.thisData.id) {
          return {
            ...i,
            v: false
          }
        } else {
          return i
        }
      }, this.thisData.tag)
    },
    //关闭点击删除线状态
    closeOverSelf(e) {
      this.closeOver(e)
    },
    //开启点击删除线
    disConnect(e) {
      this.closeConnect(e)
    },
    //删除全部连线
    clearConnectSelf() {
      this.clearConnect()
    },
    //开启连线
    onConnect(e) {
      //开启连线
      console.log(e, 'e')
      this.connect(e)
    },
    log1() {
      console.log(this.updateData, 'updateView')
      this.updateData((i) => {
        console.log('123')
        if (i.id === this.thisData.id) {
          return {
            text: 1
          }
        }
      }, this.thisData.tag)
      console.log(1)
    }
  }
};
</script>

<style scoped>
</style>


```
## server
``` bash
git clone https://github.com/qianzhuoyao/ADrag.git
npm i
# serve with hot reload at localhost:8081
npm run serve
# distribution build
npm run build
```

## License

[MIT license]
