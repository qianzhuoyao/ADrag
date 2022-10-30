export default class Block {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.visible = true;
        this.dragble = true;
        this.resizable = true;
    }

    build(arg) {
        const {x, y, width, height, visible, dragble, resizable} = arg
        this.setX(x)
        this.setY(y)
        this.setResizable(resizable)
        this.setDragble(dragble)
        this.setWidth(width)
        this.setHeight(height)
        this.setVisible(visible)
    }

    setVisible(v) {
        this.visible = !!v
    }

    setDragble(d) {
        this.dragble = !!d
    }

    setResizable(r) {
        this.resizable = !!r
    }

    setX(x) {
        this.x = x
    }

    setY(y) {
        this.y = y
    }

    setWidth(w) {
        this.width = w
    }

    setHeight(h) {
        this.height = h
    }
}
