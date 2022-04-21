<template>
  <div class='pss' :style="{top:y,left:x}" @click="clickss">{{ titles }}</div>
</template>

<script>
export default {
  name: "Table-s",
  props: {
    title: {
      type: String,
      default: () => {
        return "标题s";
      },
    },
    x: {
      type: String,
      default: () => {
        return "0px";
      },
    },
    y: {
      type: String,
      default: () => {
        return "0px";
      },
    },
  },
  watch: {
    title: {
      handler(n) {
        this.titles = n;
      },
      immediate: true,
    },
  },
  methods: {
    clickss() {
      console.log("click");
    },
  },
  data: () => {
    return {
      titles: "dsd",
      tableData: [
        {
          date: "2016-05-03",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-02",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-04",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-01",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
      ],
    };
  },
};
</script>

<style>
.pss{
  width: 100px; 
  height: 100px;
  background: #2c3e50;
  position: absolute;
  z-index: 999;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
