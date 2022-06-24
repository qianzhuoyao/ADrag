const CONFIG = {
  scene: [
    {
      //匹配到template的接收器receiver
      launcher: "quxian",
      components: {
        ORIGIN: "XXX",
        DRAG: "DDDD",
        PUZZLE: "RRRR",
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
        ORIGIN: "XXX",
        DRAG: "DDDD",
        PUZZLE: "RRRR",
      },
      //template与components内组件共享数据 ORIGIN/DRAG/PUZZLE
      state: {
        DRAG: "sdasfafasfg",
      },
    },
  ],
};
export default Object.seal(CONFIG);
