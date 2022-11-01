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
    _create({key, value, cover, pre, next, compare}) {
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
        this._create({key: "root", value});
        return this;
    }

    create({key, value}) {
        this._create({
            key,
            value,
        });
    }

    /**
     * 插入
     * @param {} param0
     * @returns
     */
    insert({pre, key, value, cover, compare}) {
        if (this.boxGraph[pre] && key) {
            this._create({
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
                //清除key组节点的所有pre节点
                this.clearTargetNodesPreParam(key)
            } else {
                const {pre} = this.boxGraph[key];
                //偏移key节点pre节点的next为当前key节点的next
                this.offsetPoint(key, pre)
                //清除前指针内容的next节点存在的被删除的内容
                this.shakeTargetPointKey(pre, key)
            }
            delete this.boxGraph[key];
            //同步更新keys
            this.filterSameKey(key)
        }
        return this;
    }

    clearTargetNodesPreParam(key) {
        this.boxGraph[key].next.map((i) => {
            this.boxGraph[i].pre = undefined;
        });
    }

    filterSameKey(key) {
        this.keys = this.keys.filter(i => i !== key)
    }

    shakeTargetPointKey(preKey, checkKey) {
        this.boxGraph[preKey].next = this.boxGraph[preKey].next.filter(
            (i) => i !== checkKey
        );
    }

    concatTargetNextKeys(preKey, currentKey) {
        this.boxGraph[preKey].next = this.boxGraph[preKey].next.concat(
            this.boxGraph[currentKey].next
        );
    }

    offsetPoint(currentKey, preKey) {
        if (this.boxGraph[currentKey]) {
            this.boxGraph[currentKey].next.map((i) => {
                this.boxGraph[i].pre = preKey;
                //指针偏移
                this.concatTargetNextKeys(preKey, currentKey)
                //避免复写时存在的指向首位
                this.shakeTargetPointKey(i, currentKey)
            });
        }
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


