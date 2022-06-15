import view from "@/draw/view";
import drag from "@/draw/drag";
import copy from "@/draw/copy";
//组件内必须在渲染结束后调用waitOver，否则直接阻塞
export const _config = {
    scene: [
        {
            tag: '组件模板唯一值',
            copyInstance: copy,
            dragInstance: drag,
            renderInstance: view,
            menu: [
                {
                    id: '弹窗唯一值',
                    popupInstance: '弹窗组件A',
                    title: '显示在菜单上的名称'
                }
            ],
        }
    ]
}