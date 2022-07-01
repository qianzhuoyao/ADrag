import Template from "./template";

const EVENT_CLICK = "click";
const EVENT_DOWN = "down";
const EVENT_UP = "up";
const EVENT_DRAGGING = "dragging";
const EVENT_DRAGSTOP = "dragstop";
const EVENT_RESIZESTOP = "resizestop";
const EVENT_RESIZING = "resizing";
export default class Node extends Template {
    constructor(prop) {
        super(prop);
        this.originComponent = null;
        this.dragComponent = null;
        this.renderComponent = null;
        this.events = {};
        this.data = null;
    }

    setData(d) {
        this.data = d;
    }

    getData() {
        return this.data;
    }

    setTag(t) {
        this.tag = t;
    }

    match(tag) {
        this.matchReceiver(tag);
    }

    checkEvent(eventName) {
        return [
            EVENT_CLICK,
            EVENT_DOWN,
            EVENT_UP,
            EVENT_DRAGGING,
            EVENT_DRAGSTOP,
            EVENT_RESIZESTOP,
            EVENT_RESIZING,
        ].includes(eventName);
    }

    createEvent(eventName, e) {
        if (this.checkEvent(eventName)) {
            const event = this.events[eventName] || [];
            event.push(e);
        }
    }

    runEvent(eventName, params) {
        const event = this.events[eventName];
        if (Array.isArray(event)) {
            event.forEach((i) => {
                typeof i === "function" && i.call(this, params);
            });
        }
    }

    runClick() {
        this.runEvent(EVENT_CLICK);
    }

    runDOWN() {
        this.runEvent(EVENT_DOWN);
    }

    runUp() {
        this.runEvent(EVENT_UP);
    }

    runDragging() {
        this.runEvent(EVENT_DRAGGING);
    }

    runDragStop() {
        this.runEvent(EVENT_DRAGSTOP);
    }

    runResizing() {
        this.runEvent(EVENT_RESIZING);
    }

    runResizeStop() {
        this.runEvent(EVENT_RESIZESTOP);
    }

    registryClickEvent(e) {
        this.createEvent(EVENT_CLICK, e);
    }

    registryDownEvent(e) {
        this.createEvent(EVENT_DOWN, e);
    }

    registryDraggingEvent(e) {
        this.createEvent(EVENT_DRAGGING, e);
    }

    registryUpEvent(e) {
        this.createEvent(EVENT_UP, e);
    }

    registryDragStopEvent(e) {
        this.createEvent(EVENT_DRAGSTOP, e);
    }

    registryResizeStopEvent(e) {
        this.createEvent(EVENT_RESIZESTOP, e);
    }

    registryResizingStopEvent(e) {
        this.createEvent(EVENT_RESIZING, e);
    }

    setOriginComponent(o) {
        this.originComponent = o;
    }

    setDragComponent(d) {
        this.dragComponent = d;
    }

    setRenderComponent(r) {
        this.renderComponent = r;
    }

    setZIndex(z) {
        this.setZ(z);
    }

    setSize({w, h}) {
        w && this.setW(w);
        h && this.setH(h);
    }

    setPosition({x, y}) {
        x && this.setX(x);
        y && this.setY(y);
    }

    hide() {
        this.setV(false);
    }

    display() {
        this.setV(true);
    }
}
