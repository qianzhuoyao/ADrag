import Fragment from "@/ADrag8/Fragment";


export default class Group {
    constructor(id) {
        this.$GroupId = id
        //说明
        this.$Desc = "this is a group"
        this.$GroupChildren = []
    }

    toJSON() {
        return {
            desc: this.$Desc,
            children: this.$GroupChildren.map(i => i.toJSON()),
            id: this.$GroupId
        }
    }

    setDesc(str) {
        this.$Desc = str
    }

    appendChild(child) {
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
