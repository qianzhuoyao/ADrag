import {RenderModel} from "../model/renderModel";

export class Lines {
    constructor() {
        this.getInstance()
    }

    getInstance() {
        if (!Lines.instance) {
            this.lines = []
            this.adderId = 0
            Lines.instance = this;
        }
        return Lines.instance;
    }

    getLines() {
        return this.lines
    }


    deleteById(id) {
        this.lines = this.lines.filter(i => i.id !== id)
    }

    deleteByNodeId(id) {
        this.lines = this.lines.filter(i => ![i.AId, i.ZId].includes(id))
    }

    findLineByNodeId(id) {
        return this.lines.filter(i => [i.AId, i.ZId].includes(id))
    }

    createLine(nodeAID, nodeZID, lineParams = {}) {
        const line = this.buildLine(nodeAID, nodeZID, lineParams)
        this.lines.push({...line, AId: nodeAID, ZId: nodeZID})
    }

    checkRole(nodeId) {
        let role = undefined
        this.lines.map(i => {
            if (i.AId === nodeId) {
                role = 'A'
            } else if (i.ZId === nodeId) {
                role = 'Z'
            }
        })
        return role
    }

    syncMove(nodeId, newCoordinate) {
        console.log('sync')
        const {x1, y1, x3, y3} = newCoordinate
        for (let i = 0; i < this.lines.length; i++) {
            if (nodeId === this.lines[i].AId) {
                console.log(this.lines[i], 'A')
                this.lines[i].x1 = x1 || x3
                this.lines[i].y1 = y1 || y3
            }
            if (nodeId === this.lines[i].ZId) {
                console.log(this.lines[i], 'Z')
                this.lines[i].x3 = x3 || x1
                this.lines[i].y3 = y3 || y1
            }
            const {x2, y2} = this.computedCenter(this.lines[i].x1, this.lines[i].y1, this.lines[i].x3, this.lines[i].y3)
            this.lines[i].x2 = x2
            this.lines[i].y2 = y2
        }
    }

    computedCenter(x1, y1, x3, y3) {
        let x2, y2
        console.log(x1, y1, x3, y3, 'x1, y1, x3, y3')
        if (x1 >= x3) {
            x2 = x3 + (x1 - x3) / 2
        } else {
            x2 = x1 + (x3 - x1) / 2
        }
        if (y1 >= y3) {
            y2 = y3 + (y1 - y3) / 2
        } else {
            y2 = y1 + (y3 - y1) / 2
        }
        return {x2, y2}
    }

    buildLineParamsById(lineId, lineParams = {}) {
        this.lines = this.lines.map(i => {
            return i.id === lineId ? {
                ...i,
                ...lineParams
            } : i
        })
    }

    buildLine(nodeAID, nodeZID, lineParams = {}) {
        const {lineColor, isDashed, width} = lineParams
        const nodes = new RenderModel().getItems()
        let A = null
        let Z = null
        nodes.map(i => {
            if (i.id === nodeAID) {
                A = i
            }
            if (i.id === nodeZID) {
                Z = i
            }
        })
        console.log({A, Z}, 'az')
        if (A && Z) {
            const x1 = A.center[0]
            const y1 = A.center[1]
            const x3 = Z.center[0]
            const y3 = Z.center[1]
            const {x2, y2} = this.computedCenter(x1, y1, x3, y3)
            const id = `line${Lines.instance.adderId++}`
            return {
                x1,
                y1,
                x2,
                y2,
                x3,
                y3,
                id,
                lineColor: lineColor || 'black',
                isDashed: !!isDashed,
                willDelete:false,
                width: parseFloat(String(width)) || 1
            }
        }
    }
}