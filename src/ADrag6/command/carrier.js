//输送包
import {Controller} from "../controller/controller";

export const carrier = (from, to, payload, origin) => {
    const {operation} = payload;
    if (origin) {
        /**
         * default check reducer
         */
        return new Controller().assigned(from, to).originAccept(operation, payload);
    } else {
        /**
         * custom check reducer
         */
        return new Controller().assigned(from, to).accept(operation, payload);
    }
};
