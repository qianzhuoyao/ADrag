<template>
  <div>
    <!-- <div id="container" style="display: flex">
      <div>
        <div style="width: 100px; height: 150px; background: #1990ff" class="f">
          正常元素，无拖拽
        </div>
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
          拖拽我可以拉出solt并放置在黄色容器区域
        </div>
        <div
          id="dragd"
          style="width: 100px; height: 100px; background: #42b983"
        >
          拖拽我可以把我放置在黄色容器区域
        </div>
      </div>
      <div
        id="provider"
        style="
          width: 1000px;
          height: 400px;
          background: bisque;
          left: 200px;
          position: absolute;
        "
      >
        容器
      </div>
    </div> -->
    <div v-html="html"></div>
  </div>
</template>

<script>
import { ASheet } from "@/ADrag";
//import tables from "./table.vue";
export default {
  name: "HelloWorld",
  // components: { tables },
  props: {
    msg: String,
  },
  data: () => {
    return {
      asheet: undefined,
      json: `[{"id":"drag","DOM":{},"__itemDOM":{"id":"drag","DOM":{}},"__itemDownObservable":{},"show":{"templateId":"dragSlot","slot":"dragImageId"},"slotDOM":{},"tempateDOM":{},"childs":[{"DOM":{},"stream":{},"copyBy":"dragSlot","id":"dragSlot0","isChildren":true}],"tempateStyle":{},"__slotDownObservable":{},"data":{"name":"arron","age":24},"x":8,"y":414,"width":100,"height":100},{"id":"dragd","DOM":{},"__itemDOM":{"id":"dragd","DOM":{}},"__itemDownObservable":{},"x":8,"y":514,"width":100,"height":100}]`,
      // html: `<div id="container" data-v-469af010="" style="display: flex;"><div data-v-469af010=""><div data-v-469af010="" style="width: 100px; height: 150px; background: rgb(25, 144, 255);"> 正常元素，无拖拽 </div><div id="dragSlot" data-v-469af010="" style="width: 400px; height: 200px; background: rgb(25, 144, 255); display: none; justify-content: center; padding: 20px; position: absolute; cursor: pointer;"><div class="el-table--fit el-table--enable-row-hover el-table--enable-row-transition el-table el-table--layout-fixed" data-prefix="el" data-v-469af010="" style="width: 100%; min-width: 400px;"><div class="el-table__inner-wrapper"><div class="hidden-columns"><div></div><div></div><div></div></div><div class="el-table__header-wrapper"><table class="el-table__header" border="0" cellpadding="0" cellspacing="0"><colgroup></colgroup><thead class=""><tr class=""></tr></thead></table></div><div class="el-table__body-wrapper"><div class="el-scrollbar"><div class="el-scrollbar__wrap el-scrollbar__wrap--hidden-default"><div class="el-scrollbar__view" style="display: inline-block; vertical-align: middle;"><table class="el-table__body" cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed;"><colgroup></colgroup><!--v-if--><tbody><tr class="el-table__row"></tr><tr class="el-table__row"></tr><tr class="el-table__row"></tr><tr class="el-table__row"></tr></tbody></table><!--v-if--><!--v-if--></div></div><div class="el-scrollbar__bar is-horizontal" style="display: none;"><div class="el-scrollbar__thumb" style="width: 0px; transform: translateX(0%);"></div></div><div class="el-scrollbar__bar is-vertical" style="display: none;"><div class="el-scrollbar__thumb" style="height: 0px; transform: translateY(0%);"></div></div></div></div><!--v-if--></div><!--v-if--><div class="el-table__column-resize-proxy" style="display: none;"></div></div></div><img id="dragImageId" src="/img/image.e5575506.jpg" alt="" data-v-469af010="" style="width: 200px; height: 200px; display: none; position: absolute; z-index: 999; cursor: pointer;"><div id="drag" data-v-469af010="" style="width: 100px; height: 100px; background: rgb(66, 185, 131); cursor: pointer;"> 拖拽我可以拉出solt并放置在黄色容器区域 </div><div id="dragd" data-v-469af010="" style="width: 100px; height: 100px; background: rgb(66, 185, 131); cursor: pointer; z-index: 999;"> 拖拽我可以把我放置在黄色容器区域 </div></div><div id="provider" data-v-469af010="" style="width: 1000px; height: 400px; background: bisque; left: 200px; position: absolute;"> 容器 </div></div>`,
      html: `<div id="container" data-v-469af010="" style="display: flex;"><div data-v-469af010=""><div class="f" data-v-469af010="" style="width: 100px; height: 150px; background: rgb(25, 144, 255);"> 正常元素，无拖拽 </div><div id="dragSlot" data-v-469af010="" style="width: 400px; height: 200px; background: rgb(25, 144, 255); display: none; justify-content: center; padding: 20px; position: absolute; cursor: pointer; left: 375px; top: 316px;"><div class="el-table--fit el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition el-table el-table--layout-fixed is-scrolling-right" data-prefix="el" data-v-469af010="" style="width: 100%; min-width: 400px;"><div class="el-table__inner-wrapper"><div class="hidden-columns"><div></div><div></div><div></div></div><div class="el-table__header-wrapper"><table class="el-table__header" border="0" cellpadding="0" cellspacing="0" style="width: 440px;"><colgroup><col name="el-table_1_column_1" width="180"><col name="el-table_1_column_2" width="180"><col name="el-table_1_column_3" width="80"></colgroup><thead class=""><tr class=""><th class="el-table_1_column_1 is-leaf el-table__cell" colspan="1" rowspan="1"><div class="cell">Date<!----><!----></div></th><th class="el-table_1_column_2 is-leaf el-table__cell" colspan="1" rowspan="1"><div class="cell">Name<!----><!----></div></th><th class="el-table_1_column_3 is-leaf el-table__cell" colspan="1" rowspan="1"><div class="cell">Address<!----><!----></div></th></tr></thead></table></div><div class="el-table__body-wrapper"><div class="el-scrollbar"><div class="el-scrollbar__wrap el-scrollbar__wrap--hidden-default"><div class="el-scrollbar__view" style="display: inline-block; vertical-align: middle;"><table class="el-table__body" cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed; width: 440px;"><colgroup><col name="el-table_1_column_1" width="180"><col name="el-table_1_column_2" width="180"><col name="el-table_1_column_3" width="80"></colgroup><!--v-if--><tbody><tr class="el-table__row"><td class="el-table_1_column_1 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->2016-05-03</div></td><td class="el-table_1_column_2 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->Tom</div></td><td class="el-table_1_column_3 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->No. 189, Grove St, Los Angeles</div></td></tr><tr class="el-table__row"><td class="el-table_1_column_1 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->2016-05-02</div></td><td class="el-table_1_column_2 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->Tom</div></td><td class="el-table_1_column_3 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->No. 189, Grove St, Los Angeles</div></td></tr><tr class="el-table__row"><td class="el-table_1_column_1 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->2016-05-04</div></td><td class="el-table_1_column_2 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->Tom</div></td><td class="el-table_1_column_3 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->No. 189, Grove St, Los Angeles</div></td></tr><tr class="el-table__row"><td class="el-table_1_column_1 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->2016-05-01</div></td><td class="el-table_1_column_2 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->Tom</div></td><td class="el-table_1_column_3 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->No. 189, Grove St, Los Angeles</div></td></tr></tbody></table><!--v-if--><!--v-if--></div></div><div class="el-scrollbar__bar is-horizontal" style="display: none;"><div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div></div><div class="el-scrollbar__bar is-vertical" style="display: none;"><div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div></div></div></div><!--v-if--></div><!--v-if--><div class="el-table__column-resize-proxy" style="display: none;"></div></div></div><img id="dragImageId" src="/img/image.e5575506.jpg" alt="" data-v-469af010="" style="width: 200px; height: 200px; display: block; position: absolute; z-index: 999; cursor: pointer; left: 375px; top: 316px;"><div id="drag" data-v-469af010="" style="width: 100px; height: 100px; background: rgb(66, 185, 131); cursor: pointer;"> 拖拽我可以拉出solt并放置在黄色容器区域 </div><div id="dragd" data-v-469af010="" style="width: 100px; height: 100px; background: rgb(66, 185, 131); cursor: pointer; z-index: 999;"> 拖拽我可以把我放置在黄色容器区域 </div></div><div id="provider" data-v-469af010="" style="width: 1000px; height: 400px; background: bisque; left: 200px; position: absolute;"> 容器 </div><div id="dragSlot0" data-v-469af010="" style="width: 400px; height: 200px; background: rgb(25, 144, 255); display: flex; justify-content: center; padding: 20px; position: absolute; cursor: pointer; left: 375px; top: 316px; z-index: 10;" copyby="dragSlot" resizeby="true"><div class="el-table--fit el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition el-table el-table--layout-fixed is-scrolling-right" data-prefix="el" data-v-469af010="" style="width: 100%; min-width: 400px;"><div class="el-table__inner-wrapper"><div class="hidden-columns"><div></div><div></div><div></div></div><div class="el-table__header-wrapper"><table class="el-table__header" border="0" cellpadding="0" cellspacing="0" style="width: 440px;"><colgroup><col name="el-table_1_column_1" width="180"><col name="el-table_1_column_2" width="180"><col name="el-table_1_column_3" width="80"></colgroup><thead class=""><tr class=""><th class="el-table_1_column_1 is-leaf el-table__cell" colspan="1" rowspan="1"><div class="cell">Date<!----><!----></div></th><th class="el-table_1_column_2 is-leaf el-table__cell" colspan="1" rowspan="1"><div class="cell">Name<!----><!----></div></th><th class="el-table_1_column_3 is-leaf el-table__cell" colspan="1" rowspan="1"><div class="cell">Address<!----><!----></div></th></tr></thead></table></div><div class="el-table__body-wrapper"><div class="el-scrollbar"><div class="el-scrollbar__wrap el-scrollbar__wrap--hidden-default"><div class="el-scrollbar__view" style="display: inline-block; vertical-align: middle;"><table class="el-table__body" cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed; width: 440px;"><colgroup><col name="el-table_1_column_1" width="180"><col name="el-table_1_column_2" width="180"><col name="el-table_1_column_3" width="80"></colgroup><!--v-if--><tbody><tr class="el-table__row"><td class="el-table_1_column_1 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->2016-05-03</div></td><td class="el-table_1_column_2 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->Tom</div></td><td class="el-table_1_column_3 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->No. 189, Grove St, Los Angeles</div></td></tr><tr class="el-table__row"><td class="el-table_1_column_1 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->2016-05-02</div></td><td class="el-table_1_column_2 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->Tom</div></td><td class="el-table_1_column_3 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->No. 189, Grove St, Los Angeles</div></td></tr><tr class="el-table__row"><td class="el-table_1_column_1 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->2016-05-04</div></td><td class="el-table_1_column_2 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->Tom</div></td><td class="el-table_1_column_3 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->No. 189, Grove St, Los Angeles</div></td></tr><tr class="el-table__row"><td class="el-table_1_column_1 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->2016-05-01</div></td><td class="el-table_1_column_2 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->Tom</div></td><td class="el-table_1_column_3 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!---->No. 189, Grove St, Los Angeles</div></td></tr></tbody></table><!--v-if--><!--v-if--></div></div><div class="el-scrollbar__bar is-horizontal" style="display: none;"><div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div></div><div class="el-scrollbar__bar is-vertical" style="display: none;"><div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div></div></div></div><!--v-if--></div><!--v-if--><div class="el-table__column-resize-proxy" style="display: none;"></div></div></div></div>`,
    };
  },
  methods: {
    ccc() {
      console.log("组件的click");
    },
  },
  mounted() {
    this.asheet = new ASheet(true, "container");
    console.log(
      this.asheet
        .container("provider")
        .trigger(["drag", "dragd"])
        .instanceBindData(
          (i) => i.id === "drag",
          { templateId: "dragSlot", slot: "dragImageId" },
          { name: "arron", age: 24 }
        )
        .zIndexChange("dragd", 999, true)
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
            this.asheet.exportHTML((v) => {
              console.log(v, "vv");
            });
            this.asheet.getTargets((v) => {
              console.log(JSON.stringify(v), "target");
            });
          },
          () => true
        )
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
