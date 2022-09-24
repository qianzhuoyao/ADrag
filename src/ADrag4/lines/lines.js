import {RenderModel} from "../model/renderModel";

export class Lines {
    constructor() {
        this.getInstance();
    }

    backUp() {
        Lines.instance.linesShot.push(Lines.instance.lines);
    }

    getBackUp() {
        return Lines.instance.linesShot;
    }

    setLines(lines) {
        Lines.instance.lines = lines;
    }

    clearInstance() {
        Lines.instance = null;
    }

    getInstance() {
        if (!Lines.instance) {
            this.lines = [];
            this.linesShot = [];
            this.adderId = 0;
            Lines.instance = this;
        }
        return Lines.instance;
    }

    getLines() {
        return this.lines;
    }

    deleteById(id) {
        this.lines = this.lines.filter((i) => i.id !== id);
    }

    deleteByNodeId(id) {
        this.lines = this.lines.filter((i) => ![i.AId, i.ZId].includes(id));
    }

    findLineByNodeId(id) {
        return this.lines.filter((i) => [i.AId, i.ZId].includes(id));
    }

    createLine(nodeAID, nodeZID, lineParams = {}) {
        const line = this.buildLine(nodeAID, nodeZID, lineParams);
        this.lines.push({...line, AId: nodeAID, ZId: nodeZID});
    }

    checkRole(nodeId) {
        let role = undefined;
        this.lines.map((i) => {
            if (i.AId === nodeId) {
                role = "A";
            } else if (i.ZId === nodeId) {
                role = "Z";
            }
        });
        return role;
    }

    getWillDeleteLineParams() {
        return {
            lineColor: "red",
            willDelete: true,
        };
    }

    getNormalLineParams() {
        return {
            lineColor: "black",
            willDelete: false,
        };
    }

    sharkEmptyNodeForLines() {
        const nodesId = new RenderModel().getItems().map((i) => i.id);
        this.lines = this.lines.filter(
            (i) => nodesId.includes(i.AId) && nodesId.includes(i.ZId)
        );
        return nodesId;
    }

    buildDashLine1({id, length, speed, buoyWidth}) {
        if (typeof length === 'number') {
            document.getElementById(`${id}Line1Path`).style.strokeDasharray = `${length - buoyWidth}`
            document.getElementById(`${id}Line1Path`).style.strokeDashoffset = `${buoyWidth * 2}`
            document.getElementById(`${id}Line1Path`).style.animation = `dashLine1${id} ${Math.abs(Math.floor(length / speed))}s linear infinite forwards`;
        }
        return `@keyframes dashLine1${id}{
                  from {
                       stroke-dashoffset: ${length};
                       }
                  to {
                       stroke-dashoffset: ${buoyWidth * 2};
                     }
               }`
    }

    buildDashLine2({id, length, speed, buoyWidth}) {
        if (typeof length === 'number') {
            document.getElementById(`${id}Line2Path`).style.strokeDasharray = `${length - buoyWidth}`
            document.getElementById(`${id}Line2Path`).style.strokeDashoffset = `${length - buoyWidth}`
            document.getElementById(`${id}Line2Path`).style.animation = `dashLine2${id} ${Math.abs(Math.floor(length / speed))}s linear infinite forwards`;
        }
        return `@keyframes dashLine2${id} {
                  from {
                       stroke-dashoffset: ${length - 30};
                       }
                  to {
                       stroke-dashoffset: -${buoyWidth * 2};
                     }
               }`
    }

    setKeyFrame({id, length, speed, buoyWidth}) {
        if (id && typeof length === 'number' && typeof speed === 'number') {
            setTimeout(() => {
                const dashLine1 = Lines.instance.buildDashLine1({id, length, speed, buoyWidth});
                const dashLine2 = Lines.instance.buildDashLine2({id, length, speed, buoyWidth});
                const sheet = document.styleSheets[0];
                sheet.insertRule(dashLine1, 0);
                sheet.insertRule(dashLine2, 0);
            }, 0)
        }
    }
    deleteAnimation() {
        Lines.instance.lines.map(() => {
            [1, 2, 3].map(() => {
                const animation = Lines.instance.findAnimation('dashLine')
                if (animation.styleSheet) {
                    animation.styleSheet.deleteRule(animation.index)
                }
            })
        })
    }
    findAnimation(name) {
        const animation = {};
        // 获取所有的style
        const ss = document.styleSheets;
        for (let i = 0; i < ss.length; ++i) {
            const item = ss[i];
            if (item.cssRules[0] && item.cssRules[0].name && item.cssRules[0].name.indexOf(name) > -1) {
                animation.cssRule = item.cssRules[0];
                animation.styleSheet = ss[i];
                animation.index = 0;
            }
        }
        return animation;
    }
    computedLinePathTotal(speed, buoyWidth) {
        return Lines.instance.lines.map((i) => {
            const pathDom = document.getElementById(`${i.id}path`)
            if (pathDom) {
                const curNum = pathDom.getTotalLength();
                Lines.instance.setKeyFrame({id: i.id, length: Math.floor(curNum), speed, buoyWidth})
                return {
                    ...i,
                    pathTotal: curNum,
                };
            } else {
                return i
            }
        });
    }

    syncMove(nodeId, newCoordinate) {
        const nodes = new RenderModel().find(nodeId);
        this.sharkEmptyNodeForLines();
        if (nodes[0] && nodes[0].v) {
            const {x1, y1, x3, y3} = newCoordinate;
            for (let i = 0; i < this.lines.length; i++) {
                if (nodeId === this.lines[i].AId) {
                    this.lines[i].x1 = x1 || x3;
                    this.lines[i].y1 = y1 || y3;
                }
                if (nodeId === this.lines[i].ZId) {
                    this.lines[i].x3 = x3 || x1;
                    this.lines[i].y3 = y3 || y1;
                }
                const {x2, y2} = this.computedCenter(
                    this.lines[i].x1,
                    this.lines[i].y1,
                    this.lines[i].x3,
                    this.lines[i].y3
                );
                this.lines[i].x2 = x2;
                this.lines[i].y2 = y2;
            }
        } else {
            this.deleteByNodeId(nodeId);
        }
    }

    computedCenter(x1, y1, x3, y3) {
        let x2, y2;
        if (x1 >= x3) {
            x2 = x3 + (x1 - x3) / 2;
        } else {
            x2 = x1 + (x3 - x1) / 2;
        }
        if (y1 >= y3) {
            y2 = y3 + (y1 - y3) / 2;
        } else {
            y2 = y1 + (y3 - y1) / 2;
        }
        return {x2, y2};
    }

    buildLineParamsById(lineId, lineParams = {}) {
        this.lines = this.lines.map((i) => {
            return i.id === lineId
                ? {
                    ...i,
                    ...lineParams,
                }
                : i;
        });
    }

    changeParams(key, value) {
        this.lines = this.lines.map(i => {
            return {
                ...i,
                key: value
            }
        })
    }

    changeLineWidth(width) {
        this.changeParams('width', width);
    }

    changePointColor(color) {
        this.changeParams('floatPointColor', color);
    }

    changeLineColor(color) {
        this.changeParams('lineColor', color);

    }

    buildLine(nodeAID, nodeZID, lineParams = {}) {
        const {lineColor, width} = lineParams;
        const nodes = new RenderModel().getItems();
        let A = null;
        let Z = null;
        nodes.map((i) => {
            if (i.id === nodeAID) {
                A = i;
            }
            if (i.id === nodeZID) {
                Z = i;
            }
        });
        if (A && Z) {
            const x1 = A.center[0];
            const y1 = A.center[1];
            const x3 = Z.center[0];
            const y3 = Z.center[1];
            const {x2, y2} = this.computedCenter(x1, y1, x3, y3);
            const id = `line${Lines.instance.adderId++}`;
            return {
                x1,
                y1,
                x2,
                y2,
                x3,
                y3,
                id,
                lineColor: lineColor || "black",
                floatPointColor: "#1990ff",
                willDelete: false,
                pathTotal: 0,
                width: parseFloat(String(width)) || 1,
            };
        }
    }
}
