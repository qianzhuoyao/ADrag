import Origin from "@/component/o.vue";
import Drag from "@/component/d.vue";
import Puzzle from "@/component/p.vue";
const CONFIG = {
  scene: [
    {
      //匹配到template的接收器receiver
      launcher: "quxian",
      components: {
        ORIGIN: Origin,
        DRAG: Drag,
        PUZZLE: Puzzle,
      },
      //template与components内组件共享数据 ORIGIN/DRAG/PUZZLE
      state: {
        DRAG: "cxcccccccc",
      },
    },
    {
      //匹配到template的接收器receiver
      launcher: "ditu",
      components: {
        ORIGIN: Origin,
        DRAG: Drag,
        PUZZLE: Puzzle,
      },
      //template与components内组件共享数据 ORIGIN/DRAG/PUZZLE
      state: {
        DRAG: "sdasfafasfg",
      },
    },
  ],
};
export default Object.seal(CONFIG);
