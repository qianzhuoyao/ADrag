import { Controller } from "./controller";
export const reducer = (makeFn) => {
  if (typeof makeFn === "function") {
    return new Controller().make(makeFn);
  }
};
export const buildOrder=(order)=>{
    return new Controller().order(order);
}
