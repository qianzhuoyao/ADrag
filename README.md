# [ADRAG](https://github.com/qianzhuoyao/ADrag) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)]()

这是一个简单的可视化模板,可以帮助你管理操作流程与整个可视化模块间的更新与操作。

* **依赖:** 
[学习RXJS](https://cn.rx.js.org/).
[学习vue](https://cn.vuejs.org/index.html).
[vueContext说明](https://www.npmjs.com/package/vue-context).
[vuedragresize说明](https://www.npmjs.com/package/vue-drag-resize).
* **说明:** 数据层面由VUE2.X代劳。rxjs实现事件模型用以用户的操作句柄。vueContext用于组件操作返回的弹窗。vuedragresize为操作面板上可编辑的组件容器。



## 文档

|组件|作用|props|slot|
|-|-|-|-|
|fragment|模板|<strong>tag:[String, Number, Boolean]</strong>:标识,与provider的tags一起使用,只有被provider的tags包含的tag的fragment才可以被绘制到provider</br><strong>renderKey:String</strong>:用于渲染用的标识</br><strong>defaultComponentWidth:Number</strong>:放置组件的默认宽</br><strong>defaultComponentHeight:Number</strong>:放置组件的默认高</br><strong>defaultComponentZIndex:Number</strong>:放置组件的默认层级</br><strong>putComponent:VNODE</strong>:放置的组件</br><strong>modalComponent:VNODE</strong>:默认放置组件右键触发的弹窗组件|<strong>display</strong>:明面上显示的</br><strong>hide</strong>:明面上隐藏的,会在拖动display时绑在鼠标上|
|provider|容器|<strong>tags:any[]</strong>:可放置的fragment的tag数组</br><strong>parentH:Number</strong>:容器边界高</br><strong>parentW:Number</strong>:容器边界长|-|

## 例子
下面是一个简单的例子,你可以将组件a拖拽并添加到容器上

```html
import putComponent = new Vue(...) 某个组件
import modalComponent = new Vue(...) 某个组件
 <fragment
        tag="1"
        render-key="123"
        :put-component="putComponent"
        :modal-component="modalComponent"
        :default-component-height="100"
        :default-component-width="100"
        :default-component-z-index="999">
      <template #display>
        <div>123</div>
      </template>
      <template #hide>
        <div>345</div>
      </template>
    </fragment>
    <provider ref="provider" :tags="['1']" style="background: antiquewhite">
    </provider>
```

这个例子会在页面上画出provider一个antiquewhite颜色2000*2000的矩形容器与一个内容为123的文本，此时拖动123文本时会在鼠标上出现一个随鼠标移动的345文本，当此时鼠标拖动到provider容器内时放开鼠标则会在provider上显示一个putComponent组件，该组件默认加持一个右击事件，右击时会显示modalComponent的组件。

