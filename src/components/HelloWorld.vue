<template>
  <div id="container" style="width: 1000px; height: 400px; background: bisque">
    <div style="width: 100px; height: 150px; background: #1990ff">不是</div>
    <div
      id="dragSlot"
      style="
        width: 400px;
        height: 200px;
        background: #1990ff;
        display: flex;
        justify-content: center;
        padding: 20px;
      "
    >
      <tables @click="ccc" />
    </div>
    <img
      id="dragImageId"
      :src="require('@/image.jpg')"
      alt=""
      style="width: 200px; height: 200px"
    />
    <div id="drag" style="width: 100px; height: 100px; background: #42b983">
      测
    </div>
    <div id="dragd" style="width: 100px; height: 100px; background: #42b983">
      实
    </div>
  </div>
</template>

<script>
import { ASheet } from "@/ADrag";
import tables from "./table.vue";
export default {
  name: "HelloWorld",
  components: { tables },
  props: {
    msg: String,
  },
  data: () => {
    return {};
  },
  methods: {
    ccc() {
      console.log("组件的click");
    },
  },
  mounted() {
    console.log(
      new ASheet(true, "container")
        .container("container")
        .trigger(["drag", "dragd"])
        .instanceBindData(
          (i) => i.id === "drag",
          { templateId: "dragSlot", slot: "dragImageId" },
          { name: "arron", age: 24 }
        )
        .registryEvents({
          down: (event) => {
            console.log("按下了", event);
          },
        })
        .dragStartOnDown(
          () => true,
          (i) => {
            console.log(i, "down");
          }
        )
        .dragStartOnMove((i) => {
          console.log(i, "move");
        })
        .dragStartOnUp(
          (i) => {
            console.log(i, "up");
          },
          () => true
        )
        .getTargets()
    );
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
