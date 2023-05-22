import {isFunc} from "@/ADrag8/Tools/typeCheck";

/**
 * 更新队列
 */
export class UpdateQueue {
    constructor() {
        this.task = []
        this.syncFn = null
    }

    /**
     * 任务
     * @param taskName updateBlockNow 立即更新块
     */
    addTask(taskName) {
        this.task.push(taskName)
    }

    emitRemove(id) {
        console.log(this.syncFn({id}),id,'this.syncFn')
        isFunc(this.syncFn) && this.syncFn(id)
    }

    syncRemove(fn) {
        isFunc(fn) && (this.syncFn = fn)
    }

    runTask() {

    }
}
