export default class Block {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 10;
        this.width = 0;
        this.height = 0;
        this.visible = true;
        this.dragble = true;
        this.resizable = true;
    }

    build(arg) {
        const {x, y, width, z, height, visible, dragble, resizable} = arg
        this.setX(x || this.x)
        this.setY(y || this.y)
        this.setResizable(resizable || this.resizable)
        this.setDragble(dragble || this.dragble)
        this.setWidth(width || this.width)
        this.setHeight(height || this.height)
        this.setVisible(visible || this.visible)
        this.setZ(z || this.z)
        return this
    }

    setVisible(v) {
        this.visible = !!v
    }

    setZ(z) {
        this.z = typeof z === 'number' ? z : 10
    }

    setDragble(d) {
        this.dragble = !!d
    }

    setResizable(r) {
        this.resizable = !!r
    }

    setX(x) {
        this.x = typeof x === 'number' ? x : 0
    }

    setY(y) {
        this.y = typeof y === 'number' ? y : 0
    }

    setWidth(w) {
        this.width = typeof w === 'number' ? w : 0
    }

    setHeight(h) {
        this.height = typeof h === 'number' ? h : 0
    }
}
