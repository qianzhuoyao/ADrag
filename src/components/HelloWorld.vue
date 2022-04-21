<template>
  <div>
    <div id="f" style="width: 200px; height: 200px; background: red"></div>
    <img id="d" src="../image.jpg" alt="" style="width: 200px; height: 200px" />
    <Vtem
      v-for="(i, k) in coms"
      :key="k"
      :id="i.id"
      :title="1"
      :x="i.x"
      :y="i.y"
    />
<div @click="remove">删除</div>
  </div>
</template>

<script>
import { VDrag } from "@/VDrag";
import Vtem from "./table.vue";
export default {
  name: "HelloWorld",
  components: { Vtem },
  props: {
    msg: String,
  },
  data: () => {
    return {
      coms: [],
    };
  },
  methods: {
    remove(){
      this.coms = []
    }
  },
  mounted() {
    const Vd = new VDrag("k", "f", "d");
    Vd.mouseUp((i, drag, copys) => {
      !Vd.inCopys(drag.id) &&
        this.coms.push({
          x: drag.style.left,
          y: drag.style.top,
          id: "copy" + copys.length,
        });
      console.log(i, this.coms, copys, drag, "eventup");
      Vd.syncCopys(this.coms);
    });
    Vd.mouseDownWithCopy((e) => {
      console.log(e, "copyDoen");
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
