<template>
  <div>
    <div :id="displayKey()">
      <slot name="display"/>
    </div>
    <div :id="hideKey()">
      <slot name="hide"/>
    </div>
  </div>
</template>

<script>
import {PipeEvent} from '../event/event'
import {Controller} from "../controller/controller";

export default {
  name: "a-fragment",
  props: {
    tag: {
      type: [String, Number, Boolean],
      default: 'a_default_fragment'
    },
    renderKey: {
      display: {
        type: String,
        default: ''
      },
    },
    defaultComponentWidth: {
      type: Number,
      default: 100
    },
    defaultComponentHeight: {
      type: Number,
      default: 100
    },
    defaultComponentZIndex: {
      type: Number,
      default: 999
    },
    putComponent: {
      type: Object,
      default: () => {
      }
    },
    modalComponent: {
      type: Object,
      default: () => {
      }
    }
  },
  watch: {
    renderKey: {
      handler(n) {
        this.checkRenderKey(n)
      },
      immediate: true
    },
  },
  data: () => {
    return {
      render: null,
      controller: null,
    }
  },
  mounted() {
    this.getController()
    this.registryEvent()
  },
  methods: {
    getController() {
      this.controller = new Controller()
    },
    displayKey() {
      return `${this.renderKey}-display`
    },
    hideKey() {
      return `${this.renderKey}-hide`
    },
    registryEvent() {
      new PipeEvent()
          .setDragElement(this.displayKey())
          //设置来源元素
          .setCopyElement(this.hideKey())
          .dragElementHide()
          .pipeEventStart({
            downCallback: () => {

            },
            moveCallback: (pipe, e) => {
              pipe.dragElementShow()
              pipe.dragElementPosition({x: e.x, y: e.y})
            },
            overCallback: (pipe, e) => {
              pipe.dragElementHide()
              this.controller.updateForCreate({
                c: this.putComponent,
                m: this.modalComponent,
                tag: this.tag,
                x: e.x,
                y: e.y,
                w: this.defaultComponentWidth,
                h: this.defaultComponentHeight,
                z: this.defaultComponentZIndex,
                f: true
              })
            },
          });
    },
    checkRenderKey(value) {
      if (!value) {
        throw new Error(`${value} must be truth`)
      }
    }
  }
}
</script>

<style scoped>

</style>
