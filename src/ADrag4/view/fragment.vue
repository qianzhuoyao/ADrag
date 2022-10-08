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
import PipeEvent from "@/ADrag4/event/event";
import {Controller} from "@/ADrag4/controller/controller";

export default {
  name: "a-fragment",
  props: {
    tag: {
      type: [String, Number, Boolean],
      default: "a_default_fragment",
    },
    moveOffsetX: {
      type: [Number],
      default: 0,
    },
    moveOffsetY: {
      type: [Number],
      default: 0,
    },
    putOffsetX: {
      type: [Number],
      default: 0,
    },
    putOffsetY: {
      type: [Number],
      default: 0,
    },
    renderKey: {
      display: {
        type: String,
        default: "",
      },
    },
    defaultComponentWidth: {
      type: Number,
      default: 100,
    },
    defaultComponentHeight: {
      type: Number,
      default: 100,
    },
    defaultComponentZIndex: {
      type: Number,
      default: 999,
    },
    putComponent: {
      type: Object,
      default: () => {
      },
    },
    modalComponent: {
      type: Object,
      default: () => {
      },
    },
    providerContainerId: {
      type: String,
      default: () => '',
    },
  },
  watch: {
    providerContainerId: {
      handler(n) {
        this.screenOffset = n;
      },
      immediate: true,
    },
    moveOffsetX: {
      handler(n) {
        this.moveX = n;
      },
      immediate: true,
    },
    moveOffsetY: {
      handler(n) {
        this.moveY = n;
      },
      immediate: true,
    },
    putOffsetX: {
      handler(n) {
        this.offsetX = n;
      },
      immediate: true,
    },
    putOffsetY: {
      handler(n) {
        this.offsetY = n;
      },
      immediate: true,
    },
    defaultComponentWidth: {
      handler(n) {
        this.width = n;
      },
      immediate: true,
    },
    defaultComponentHeight: {
      handler(n) {
        this.height = n;
      },
      immediate: true,
    },
    defaultComponentZIndex: {
      handler(n) {
        this.zIndex = n;
      },
      immediate: true,
    },
    renderKey: {
      handler(n) {
        this.checkRenderKey(n);
      },
      immediate: true,
    },
  },
  data: () => {
    return {
      render: null,
      controller: null,
      width: 0,
      offsetX: 0,
      offsetY: 0,
      moveX: 0,
      screenOffset: '',
      moveY: 0,
      height: 0,
      zIndex: 999,
    };
  },
  mounted() {
    this.getController();
    this.registryEvent();
  },
  methods: {
    getController() {
      this.controller = new Controller();
    },
    displayKey() {
      return `${this.renderKey}-display`;
    },
    hideKey() {
      return `${this.renderKey}-hide`;
    },
    computedScreenOffset() {
      let x = 0;
      let y = 0;
      if (this.screenOffset && typeof this.screenOffset === 'string') {
        x = document.getElementById(this.screenOffset).scrollLeft || 0
        y = document.getElementById(this.screenOffset).scrollTop || 0
      }
      return {x, y}
    },
    registryEvent() {
      new PipeEvent()
          .setDragElement(this.hideKey())
          //设置来源元素
          .setCopyElement(this.displayKey())
          .dragElementHide()
          .pipeEventStart({
            downCallback: (pipe) => {
              pipe.setOffsetDrag({x: this.moveX, y: this.moveY});
              this.$emit("fragmentDown", pipe);
            },
            moveCallback: (pipe) => {
              pipe.dragElementShow();
              this.$emit("fragmentMove", pipe);
            },
            overCallback: (pipe, e) => {
              const {x: xOffset, y: yOffset} = this.computedScreenOffset()
              pipe.dragElementHide();
              this.controller.updateForCreate({
                renderKey: this.renderKey,
                c: this.putComponent,
                m: this.modalComponent,
                tag: this.tag,
                x: e.x - this.offsetX + xOffset,
                y: e.y - this.offsetY + yOffset,
                w: this.width,
                h: this.height,
                z: this.zIndex,
                f: true,
                offsetX: this.offsetX,
                offsetY: this.offsetY
              });
              this.$emit("fragmentOver", pipe);
            },
          });
    },
    checkRenderKey(value) {
      if (!value) {
        throw new Error(`${value} must be truth`);
      }
    },
  },
};
</script>

<style scoped>
</style>
