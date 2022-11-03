import {realBound} from "../../service/providerService";

const STYLE_ENUM = {
    _BORDER: '2px solid #1990ff'
}
const isObject = (obj) => Object.prototype.toString.call(obj) === '[Object Object]'

export class Armor {
    constructor(domId) {
        this.host = document.getElementById(domId)
        this.hostId = domId
        this.kernels = []
        this.kernelTemplate = ''
        this.sizeKernelCount = {
            left: 1,
            right: 1,
            top: 1,
            bottom: 1
        }
        this.setSizeKernel(this.sizeKernelCount)
    }

    setSizeKernel({left, right, top, bottom}) {
        if ([left, right, top, bottom].every(i => typeof i === "number")) {
            this.sizeKernelCount = {
                ...this.sizeKernelCount,
                left, right, top, bottom
            }
        }
        Object.keys(this.sizeKernelCount).map(i => {
            this.computeSizeKernel(this.sizeKernelCount[i], i)
        })

    }

    computeEdge(arrow) {
        const result = {min: null, max: null}
        const {width, left, top, height} = realBound(this.hostId)
        switch (arrow) {
            case 'left':
                result.min = {
                    left,
                    top,
                };
                result.max = {
                    left: left,
                    top: top + height,
                }
                break;
            case  'right':
                result.min = {
                    left: left + width,
                    top,
                };
                result.max = {
                    left: left + width,
                    top: top + height,
                }
                break;
            case 'top':
                result.min = {
                    left,
                    top,
                };
                result.max = {
                    left: left + width,
                    top: top,
                }
                break;
            case  'bottom':
                result.min = {
                    left: left,
                    top: top + height,
                };
                result.max = {
                    left: left + width,
                    top: top + height,
                }
                break;
            default:
                break;
        }
        return result
    }

    computeSizeKernel(count, arrow) {
        const {min: {left: minX, top: minY}, max: {left: maxX, top: maxY}} = this.computeEdge(arrow)
        const scopeX = maxX - minX
        const scopeY = maxY - minY
        const itemX = Math.ceil(scopeX / count)
        const itemY = Math.ceil(scopeY / count)
        for (let i = 0; i < count + 2; i++) {
            const x = minX + i * itemX
            const y = minY + i * itemY
            if (this.kernels.length) {
                if (!this.kernels.some(i => i.x === x && i.y === y)) {
                    this.kernels.push({x, y})
                }
            } else {
                this.kernels.push({x, y})
            }
        }
    }


    setStyle(style) {
        if (isObject(style)) {
            this.host.style.border = style.border
        }
    }

    defineKernelStyle(kernelDom) {
        if (typeof kernelDom === "string") {
            this.kernelTemplate = kernelDom
        }
    }

    paint(display = 'block') {
        const doc = document.createDocumentFragment()
        this.kernels.map(i => {
            doc.appendChild(
                document.createRange().createContextualFragment(`
                <div style="display:${display} ;position:absolute;left:${i.x}px;top:${i.y}px">
                ${this.kernelTemplate}
</div>
                `)
            )
        })
        this.host.appendChild(doc)
    }

    armorMake() {
        if (this.host) {
            this.setStyle({
                border: STYLE_ENUM._BORDER
            })
            this.paint()
        }
    }

    armorHide() {
        this.setStyle({})

        this.paint('none')
    }

}
