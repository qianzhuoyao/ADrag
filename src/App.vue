<template>
  <div style="position: absolute">
    <pp
      v-if="tems.nodes[0].view.visible"
      :node="tems.nodes[0]"
      @finished="finished"
    />
    <pp
      v-if="tems.nodes[1].view.visible"
      :node="tems.nodes[1]"
      @finished="finished"
    />
    <!-- <div v-for="(i, k) in tems" :key="k">
      <component :id="`copy${k}`" :is="i.copyInstanceBy"></component>
      <component :id="`drag${k}`" :is="i.dragInstanceBy"></component>
      <div
        id="container"
        style="
          position: absolute;
          width: 1000px;
          height: 1000px;
          background: #2c3e50;
        "
      >
        <VueDragResize
          v-for="(k, index) in list.toJS()"
          :key="index"
          :x="
            k.attribute.get('position').x -
            parseFloat(String(computeContainer().offsetLeft))
          "
          :y="
            k.attribute.get('position').y -
            parseFloat(String(computeContainer().offsetTop))
          "
          :w="k.attribute.get('size').width"
          :h="k.attribute.get('size').height"
          :z="k.attribute.get('zIndex')"
          :isActive="k.focus"
          :parentH="parseFloat(String(computeContainer().styleOfHeight))"
          :parentW="parseFloat(String(computeContainer().styleOfWidth))"
          :parentLimitation="true"
          @clicked="() => clicked(k)"
          @activated="() => activated(k)"
          @deactivated="acrossFunction(k.blurCallback, k)"
          @resizing="(p) => resizing(k, p)"
          @resizestop="(p) => resizeStop(k, p)"
          @dragging="(p) => dragging(k, p)"
          @dragstop="() => dragStop(k)"
        >
          {{ k.attribute.get("position").x }}
          {{ k.attribute.get("position").y }}
          {{ k.attribute.get("size").width }}
          {{ k.attribute.get("size").height }}
          <component
            v-if="k.visisble"
            :is="k.attribute.get('renderInstanceBy')"
            :node="k"
          >
          </component>
        </VueDragResize>
      </div>
    </div> -->
  </div>
</template>

<script>
import Render from "./ADrag3/render/render";
//import VueDragResize from "vue-drag-resize";
import pp from "./component/p.vue";
export default {
  name: "App",
  components: {
    pp,
    //VueDragResize,
  },
  data: () => {
    return {
      list: [],
      tems: [],
      node: {},
    };
  },
  methods: {
    finished(tag) {
      console.log(tag, "finished");
      this.tems.finished(tag);
    },
  },
  mounted() {
    this.tems = new Render();
    const t = this.tems.start();
    this.tems.create(t[0], 1);
    this.tems.create(t[0], 2);
    this.tems.create(t[1], 3);
     this.tems.syncRender();
    // setTimeout(()=>{
    //   this.tems.nodes[1].instance.display()
    // },2000)
    // this.tems.nodes[0].view.x = 20
    this.node = this.tems.getIndexOfNodes(0);
    //this.tems.nodes[0].instance.setPosition({ x: 10, y: 10 });
    console.log(this.tems.nodes[0].view.visible, this.node, "Render()");
  },
};
</script>

<style>
</style>
