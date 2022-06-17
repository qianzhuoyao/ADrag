import {
    _config
} from "@/draw/config";
import Template from "@/draw/template";
/**
 * 解析
 */
export class Compiler {
    constructor(config) {
        this.templates = []
        this.compiler(config)
    }

    getTemplates() {
        return this.templates
    }

//解析config文件为模板列表
    compiler(config) {
        const {
            scene
        } = config
        this.templates = scene.map((i, k) => {
            return new Template(k)
                .frameOfReference({
                    x: 0,
                    y: 0
                })
                .size({
                    height: 0,
                    width: 0
                })
                .priority(0)
                .minSize({
                    minHeight: 0,
                    minWidth: 0
                })
                .popup(i.menu)
                .renderBy(i.renderInstance)
                .dragBy(i.dragInstance)
                .copyBy(i.copyInstance)
        })
    }
}

export const templates = new Compiler(_config).getTemplates()