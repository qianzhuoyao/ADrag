import Fragment from "@/ADrag8/Fragment";


export default class Group {
    constructor(id) {
        this.$GroupId = id
        this.$GroupChildren = []
    }

    createChild(child) {
        if (child instanceof Fragment) {
            this.$GroupChildren.push(child)
        }
    }

    updateGroupChildren(condition) {
        if (typeof condition === 'function') {
            this.$GroupChildren = this.$GroupChildren.filter(i => condition(i))
        }
    }

    removeChild(childId) {
        if (childId) {
            this.updateGroupChildren(item => {
                return item.$Id !== childId
            })
        }
    }
}
