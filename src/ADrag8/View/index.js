import { computeVertex, positionMap } from "@/ADrag8/Tools/compute";
import { BOUND_LENGTH, VERTEX_CLASS } from "@/ADrag8/Config/CONSTANT";

export const createDom = (id, parent = document.body) => {
  const DOM = document.createElement("div");
  DOM.id = id;
  if (parent instanceof HTMLElement) {
    parent.appendChild(DOM);
  }
  return DOM;
};
export const removeDomByIdList = (list) => {
  if (Array.isArray(list)) {
    list.map((i) => {
      document.getElementById(i).remove();
    });
  }
};
export const removeDomByClass = (className) => {
  if (typeof className === "string") {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      elements[i].remove();
    }
  }
};
export const syncVertexPosition = (DOM, target, key) => {
  if (DOM instanceof HTMLElement) {
    const Vertex = computeVertex(DOM, BOUND_LENGTH / 2);
    target.style.left = Object.values(Vertex)[key][0] + "px";
    target.style.top = Object.values(Vertex)[key][1] + "px";
    target.style.width = BOUND_LENGTH + "px";
    target.style.height = BOUND_LENGTH + "px";
    target.style.border = "1px solid";
    target.style.cursor = "pointer";
  }
};
export const computeDomPositionAndSize = (DOM) => {
  if (DOM instanceof HTMLElement) {
    const { left, top, bottom, right } = DOM.getBoundingClientRect();
    return {
      width: Math.abs(right - left),
      height: Math.abs(top - bottom),
      left,
      top,
      bottom,
      right,
    };
  }
};
/**
 * 绘制顶点
 */
export const vertex = (DOM, tag) => {
  const DOMList = [];
  if (DOM instanceof HTMLElement) {
    console.log(DOM, "vertexDom");
    const boundLength = BOUND_LENGTH;
    const Vertex = computeVertex(DOM, boundLength / 2);
    console.log(Vertex, "V");
    for (let i = 0; i < 8; i++) {
      const VDom = createDom(`${tag}${i}--vertex`, DOM);
      DOMList.push(VDom);
      VDom.classList.add(VERTEX_CLASS);
      VDom.style.position = "absolute";
      VDom.dataset.position = positionMap(Object.keys(Vertex)[i]);
      VDom.style.left = Object.values(Vertex)[i][0] + "px";
      VDom.style.top = Object.values(Vertex)[i][1] + "px";
      VDom.style.width = boundLength + "px";
      VDom.style.height = boundLength + "px";
      VDom.style.border = "1px solid";
      VDom.style.cursor = "pointer";
      //默认隐藏
      VDom.style.display = "none";
    }
  }
  return DOMList;
};
