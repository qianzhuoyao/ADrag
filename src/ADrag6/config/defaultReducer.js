import {ORDER} from "@/ADrag6/config/orders";


export const defaultReducer=(instance, service, order, payload)=>{
   const{from,to,body}=payload
   if(order===ORDER.HISTORY_COMMAND){
      service.backUpCommand(from,to,order,body)
   }
}
