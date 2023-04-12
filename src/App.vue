<template>
    <div>
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
        a.$BaseObserver.updateSize({width: 100, height: 100})
        b.$BaseObserver.updateSize({width: 100, height: 100})
        s.createBlock(a)
        s.createBlock(b)
        s.mountBlocks(r)
        a.$BaseObserver.updateFocus(true)
        b.$BaseObserver.updateFocus(true)
        a.insertDom(document.getElementById('child'))
        a.getDom().style.background = '#1990ff'
        b.getDom().style.background = '#352562'
        a.$BaseObserver.$Event.nodeClick(() => {
            console.log('click', a)
        })
    }

};
</script>

<style>
</style>
