<template>
  <ul>
    <li @click="onConnect">
      <a>onConnect</a>
    </li>
    <li @click="disConnect">
      <a>disConnect</a>
    </li>
    <li @click="clearConnectSelf">
      <a>clearConnect</a>
    </li>
    <li>
      <a>Option 2</a>
    </li>
  </ul>
</template>

<script>
export default {
  name: "view-c",
  props: {
    clearConnect: {
      type: Function,
      default: new Function('')
    },
    updateData: {
      type: Function,
      default: new Function('')
    },
    closeConnect: {
      type: Function,
      default: new Function('')
    },
    connect: {
      type: Function,
      default: new Function('')
    },
    thisData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data: () => {
    return {
      ns: {},
    };
  },
  watch: {
    thisData: {
      handler(n) {
        console.log(n, 'nnn')
      }, deep: true,
      immediate: true
    }
    // node: {
    //   handler(n) {
    //     this.ns = n;
    //     console.log(n, "view");
    //     setTimeout(() => {
    //      this.$emit('finished',n.instance.tag)
    //     }, 2000);
    //   },
    //   immediate:true,
    //   deep:true
    // },
  },
  mounted() {
  },
  methods: {
    disConnect(e) {
      this.closeConnect(e)
    },
    clearConnectSelf() {
      this.clearConnect()
    },
    onConnect(e) {
      //开启连线
      console.log(e, 'e')
      this.connect(e)
    },
    log1() {
      console.log(this.updateData, 'updateView')
      this.updateData((i) => {
        console.log('123')
        if (i.id === this.thisData.id) {
          return {
            text: 1
          }
        }
      }, this.thisData.tag)
      console.log(1)
    }
  }
};
</script>

<style scoped>
</style>
