//输送包
import { Controller } from "../controller/controller";

export const carrier = (from, to, payload,origin) => {
  const { operation } = payload;
  if(origin){
    return new Controller().assigned(from, to).originAccept(operation, payload);
  }else{
    return new Controller().assigned(from, to).accept(operation, payload);
  }
};
