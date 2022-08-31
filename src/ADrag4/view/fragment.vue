<template>
  <div>
    <div :id="displaySlot">
      <slot name="display"/>
    </div>
    <div :id="hideSlot">
      <slot name="hide"/>
    </div>
  </div>
</template>

<script>
import {PipeEvent} from '../event/event'
import {Controller} from "@/ADrag4/controller/controller";

const DISPLAY = 'display'
const HIDE = 'hide'
export default {
  name: "a-fragment",
  props: {
    tag: {
      type: [String, Number, Boolean],
      default: 'a_default_fragment'
    },
    display: {
      type: String,
      default: ''
    },
    hide: {
      type: String,
      default: ''
    },
    putComponent: {
      type: Object,
      default: () => {
      }
    }
  },
  watch: {
    display: {
      handler(n) {
        this.checkProp(DISPLAY, n)
      },
      immediate: true
    },
    hide: {
      handler(n) {
        this.checkProp(HIDE, n)
      },
      immediate: true
    }
  },
  data: () => {
    return {
      render: null,
      controller: null,
      displaySlot: '',
      hideSlot: ''
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
    registryEvent() {
      new PipeEvent()
          .setDragElement(this.hideSlot)
          //设置来源元素
          .setCopyElement(this.displaySlot)
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
                tag: this.tag,
                x: e.x,
                y: e.y,
                w: 100,
                h: 100,
                z: 999,
                f: true
              })
            },
          });
    },
    checkProp(prop, value) {
      const TACTICS = [DISPLAY, HIDE]
      if (TACTICS.includes(prop)) {
        if (!value) {
          throw new Error(`${prop} must be truth`)
        } else {
          this[`${prop}Slot`] = value
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
