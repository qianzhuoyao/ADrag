<template>
  <div :id="thisData.id" :style="{width:thisData.w+'px',height:thisData.h+'px'}"></div>
</template>

<script>
import * as echarts from 'echarts';

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
    this.chartDom = document.getElementById(this.thisData.id);
    this.myChart = echarts.init(this.chartDom);
    console.log(this.thisData, this.chartDom, "view");
    this.option && this.myChart.setOption(this.option);
    this.s = this.thisData.id
  },
  watch: {
    thisData: {
      handler() {
        this.myChart && this.myChart.resize()
      }, immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
</style>
