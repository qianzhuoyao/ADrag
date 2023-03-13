<template>
  <div >
    <scene
        :container-height="300"
        :container-width="300"
        style="background:cadetblue"
    ></scene>
  </div>
</template>

<script>

/**
 * undo [x]
 * drag [x]
 * componentMap [x]
 */

// import drag from '@/component/d'
// import {Container} from "@/ADrag6/publicProvider/container";
// import {additionDragEvent} from "@/ADrag6/service/modify";
import scene from "@/ADrag6/component/scene.vue";

/**
 * 自定义命令用法
 * buildCustomOrder({
 *   order1:'...'
 * })
 * reducer((i,s,o,p,b)=>{
 * if(o===order1){
 *   s.xxx
 * }
 *   ....
 * })
 */
export default {
  name: "App",
  components: {scene},
  data: () => {
    return {};
  },


};
</script>

<style>
</style>
