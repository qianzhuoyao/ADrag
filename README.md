# [ADRAG](https://github.com/qianzhuoyao/ADrag) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)]()

这是一个简单的可视化模板,可以帮助你管理操作流程与整个可视化模块间的更新与操作。

* **依赖:**
  [学习RXJS](https://cn.rx.js.org/).
  [学习vue](https://cn.vuejs.org/index.html).
  [vueContext说明](https://www.npmjs.com/package/vue-context).
  [vuedragresize说明](https://www.npmjs.com/package/vue-drag-resize).
* **说明:** 数据层面由VUE2.X代劳。rxjs实现事件模型用以用户的操作句柄。vueContext用于组件操作返回的弹窗。vuedragresize为操作面板上可编辑的组件容器。

## 文档

todo

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

这个例子会在页面上画出provider一个antiquewhite颜色2000*
2000的矩形容器与一个内容为123的文本，此时拖动123文本时会在鼠标上出现一个随鼠标移动的345文本，当此时鼠标拖动到provider容器内时放开鼠标则会在provider上显示一个putComponent组件，该组件默认加持一个右击事件，右击时会显示modalComponent的组件。

组件(putComponent/modalComponent)都是会被传入两个属性分别为thisData（Object）与updateData（function）。其中调用updateData时，其参数
是一个回调以及thisData的tag，回调参数为每一项组件的数据（也就是其thisData），此时更新其可以有效更新其余所有组件的renderData

- updateData不被允许修改所有thisData的除renderData的属性。

```javascript
 <template>
    <ul>
        <li
        @click="log1">
        <a>Option 1</a>
    </li>
    <li>
        <a>Option 2</a>
    </li>
</ul>
</template>

<script>
    export default {
    name: "component",
    props: {
    updateData: {
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
},
    mounted() {
},
    methods: {
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

## 组件特性

provider 组件可提供undo[x]/redo功能与事件监听on[x]事件有'dragging', 'dragStop', 'resizing', 'areaClick', 'resizeStop', '
componentClick', 'hover'

provider也可以帮助你对组件进行更进一步的操控，比如帮你画出辅助线以及自动吸附！this.$refs.provider.openAider()
/关闭this.$refs.provider.closeAider()
