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
        return {};
    },
    mounted() {
        // new Select().provider('123')
        const a = new ADRAG.Fragment()
        const b = new ADRAG.Fragment()
        const r = new ADRAG.Render()
        const s = new ADRAG.Scene()
        const c2 = new ADRAG.Container(document.getElementById('con'))
        s.createBlock(a)
        s.createBlock(b)
        s.createContainer(c2)
        a.updateSize({width: 100, height: 100})
        b.updateSize({width: 100, height: 100})
        b.updatePosition({x: 20, y: 20})
        a.updatePosition({x: 40, y: 40})
        c2.pushBlocks([a, b])
        s.mount(r)
        a.updateFocus(true)
        b.updateFocus(false)
        a.insertDom(document.getElementById('child'))
        a.getDom().style.background = '#1990ff'
        b.getDom().style.background = '#352562'
        a.getCallback('nodeClick', () => {
            console.log('click', a)
        })
    }

};
</script>

<style>
</style>
