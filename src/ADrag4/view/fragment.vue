﻿
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

import PipeEvent from "@/views/visualization/ADrag4/event/event";

import {Controller} from "@/views/visualization/ADrag4/controller/controller";


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

        screenContainerId: {

            type: String,

            default: () => "",

        },

        modalComponent: {

            type: Object,

            default: () => {

            },

        },

    },

    watch: {

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

        screenContainerId: {

            handler(n) {

                this.containerId = n;

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

            moveY: 0,

            height: 0,

            zIndex: 999,

            containerId: '',

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

            return `${thi s.renderKey}-display`;

        },

        hideKey() {

            return `${this.renderKey}-hide`;

        },

        computeScreenOffset() {

            let xOffset = 0

            let yOffset = 0

            if (this.containerId && typeof this.containerId === 'string') {

                xOffset = document.getElementById(this.containerId).scrollLeft || 0

                yOffset = document.getElementById(this.containerId).scrollTop || 0

            }

            return {xOffset, yOffset}

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

                        const {xOffset, yOffset} = this.computeScreenOffset()

                        const readyX = parseFloat(pipe.dragElement.style.left) - this.offsetX + xOffset

                        const readyY = parseFloat(pipe.dragElement.style.top) - this.offsetY + yOffset

                        //位置校验

                        if (this.controller.checkMoveTargetInside({

                            x: readyX,

                            y: readyY,

                            w: this.width,

                            h: this.height,

                        })) {

                            this.controller.updateForCreate({

                                renderKey: this.renderKey,

                                c: this.putComponent,

                                m: this.modalComponent,

                                tag: this.tag,

                                x: readyX,

                                y: readyY,

                                w: this.width,

                                h: this.height,

                                z: this.zIndex,

                                f: true,

                                offsetX: this.offsetX,

                                offsetY: this.offsetY,

                                providerContainerId: this.containerId

                            });

                            this.$emit("fragmentOver", pipe, e);

                        }

                        pipe.dragElementHide();

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
