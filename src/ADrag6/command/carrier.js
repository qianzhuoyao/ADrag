//输送包
import {Controller} from "../controller/controller";

export const carrier = (from, to, payload) => {
    const {operation} = payload;
    console.log(payload,'payload')
    return new Controller().assigned(from, to).accept(operation, payload);
};
