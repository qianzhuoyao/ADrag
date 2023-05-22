<template>
  <div>
    <div id="con" style="width: 500px;height: 500px;background: seagreen"></div>
    <div id="123" style="width: 400px;height: 400px;background: azure"></div>
    <div id="child">1231231</div>
  </div>
</template>

<script>
import * as ADRAG from "./ADrag8"

export default {
  name: "App",

  data: () => {
    return {
      a: null,
      b: null,
    };
  },
  mounted() {
    const a = new ADRAG.Fragment()
    const b = new ADRAG.Fragment()
    const c = new ADRAG.Fragment()
    const r = new ADRAG.Render()
    const s = new ADRAG.Scene()
    const c2 = new ADRAG.Container(document.getElementById('con'))
    //创建快
    s.createBlock(a)
    s.createBlock(c)
    s.createBlock(b)
    //创建容器
    s.createContainer(c2)
    //设置初始大小与位置
    a.updateSize({width: 100, height: 100})
    b.updateSize({width: 100, height: 100})
    b.updatePosition({x: 20, y: 20})
    c.updateSize({width: 100, height: 100})
    c.updatePosition({x: 50, y: 50})
    a.updatePosition({x: 40, y: 40})
    //将块载入容器中
    c2.pushBlocks([a, b, c])
    //挂载渲染器，将块渲染到浏览器上
    s.mount(r)
    //更新块状态，是否focus
    a.updateFocus(true)
    b.updateFocus(false)
    //将dom加到块内
    a.insertDom(document.getElementById('child'))
    //设置块css属性
    a.getDom().style.background = '#1990ff'
    b.getDom().style.background = '#352562'
    c.getDom().style.background = '#341214'
    //事件注册
    c.nodeClick(() => {
      a.remove()
      console.log('click', s.toJSON(), a)
    })

  },
};
</script>

<style>
</style>
