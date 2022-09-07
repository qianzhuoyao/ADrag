import {RenderModel} from "@/ADrag4/model/renderModel";

export class Aider {
    constructor() {
        this.getInstance()
    }

    getInstance() {
        if (!Aider.instance) {
            this.aiderLines = {}
            Aider.instance = this;
        }
        return Aider.instance;
    }

    computeAiderLines() {
        const items = new RenderModel().getItems()
        if (Array.isArray(items) && items.length) {
            items.map(i => {
                const {h: height, w: width, x: left, y: top} = i
                const {xL, xR, yB, yT} = new RenderModel().computeArea({
                    height,
                    width,
                    left,
                    top
                })
                Aider.instance.aiderLines[i.id] = {xL, xR, yB, yT}
            })
        }
    }


    getAiderLines() {
        console.log(Aider.instance.aiderLines, 'Aider.instance.aiderLines')
        return Aider.instance.aiderLines
    }

    computeClosestItem() {

    }
}