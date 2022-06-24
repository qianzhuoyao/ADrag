import CONFIG from "./config";
import Node from "./node";
export const complier = () => {
  const { scene } = CONFIG;
  console.log(scene, "scene");
  return scene.map((i, k) => {
    const node = new Node();
    node.matchReceiver(i.launcher);
    node.setDragComponent(i.components.DRAG);
    node.setOriginComponent(i.components.ORIGIN);
    node.setRenderComponent(i.components.PUZZLE);
    node.setShareData(i.state);
    node.setPosition({ x: 0, y: 0 });
    node.setSize({ w: 0, h: 0 });
    node.setZIndex(0);
    node.setTag(k);
    return node;
  });
};
