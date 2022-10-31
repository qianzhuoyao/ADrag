import Block from "@/ADrag5/block";

export default class BoxGraph {
    constructor() {
        this.boxGraph = {};
        this.keys = []
    }

    /**
     * 创建
     * @param {*} param0
     * key, value, cover,  pre,  next,  compare
     * key  值     是否覆盖  前指针 后指针  是否合并
     * @returns
     */
    create({key, value, cover, pre, next, compare}) {
        if (cover || !(key in this.boxGraph)) {
            const nextValue = compare ? this.boxGraph[key].next : [];
            this.boxGraph[key] = {
                _key: key,
                value: value,
                pre: pre,
                next: next || nextValue,
            };
            this.keys.push(key)
        }
        return this;
    }

    updateValue({key, autoValue}) {
        if (this.keys.includes(key)) {
            this.boxGraph[key] = {
                ...this.boxGraph[key],
                value: typeof autoValue === 'function' && autoValue(this.boxGraph[key].value)
            }
        }
    }

    /**
     * 创建根节点
     */
    root({value}) {
        this.create({key: "root", value});
        return this;
    }

    /**
     * 插入
     * @param {} param0
     * @returns
     */
    insert({pre, key, value, cover, compare}) {
        if (this.boxGraph[pre] && key) {
            this.create({
                pre,
                key,
                value,
                cover,
                compare,
            });
            this.boxGraph[pre].next.push(key);
        }
        return this;
    }

    /**
     * 最近一次被添加的key
     */
    recentKey() {
        const latest = this.takeKeys().length
        return this.takeKeys()[latest - 1]
    }

    /**
     * 移除元素
     * @param key 被删除的key
     * @param cutLink 是否断链
     */
    remove(key, cutLink = false) {
        if (this.boxGraph[key]) {
            if (cutLink) {
                this.boxGraph[key].next.map((i) => {
                    this.boxGraph[i].pre = undefined;
                });
            } else {
                const {pre} = this.boxGraph[key];
                this.boxGraph[key].next.map((i) => {
                    this.boxGraph[i].pre = pre;
                    //指针偏移
                    this.boxGraph[pre].next = this.boxGraph[pre].next.concat(
                        this.boxGraph[key].next
                    );
                    //避免复写时存在的指向首位
                    this.boxGraph[i].next = this.boxGraph[i].next.filter(
                        (i) => i !== key
                    );
                });
                //清除前指针内容的next节点存在的被删除的内容
                this.boxGraph[pre].next = this.boxGraph[pre].next.filter(
                    (i) => i !== key
                );
            }
            delete this.boxGraph[key];
            this.keys = this.keys.filter(i => i !== key)
        }
        return this;
    }

    find(key) {
        return Object.freeze(this.boxGraph[key]);
    }

    take() {
        return this.boxGraph;
    }

    takeKeys() {
        return this.keys
    }

}


