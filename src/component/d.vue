<template>
  <!--  <div :id="thisData.id" :style="{width:thisData.w+'px',height:thisData.h+'px'}"></div>-->
  <div class="fs" :style="{width:thisData.w+'px',height:thisData.h+'px'}">
    <div style="width: 5px;height: 5px;border-radius: 50%;background: black"></div>
  </div>
</template>

<script>
// import * as echarts from 'echarts';

export default {
  name: "view-c",
  props: {
    updateData: {
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
      option: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
          }
        ]
      },
      s: ''
    }
  },
  mounted() {

  },
  watch: {
    thisData: {
      handler() {
        // this.myChart && this.myChart.resize()
      }, immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
.fs {
  display: flex;
  justify-content: center;
  align-items: center
}
</style>
