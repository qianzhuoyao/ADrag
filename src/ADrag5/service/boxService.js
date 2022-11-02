import Observation from "../observation";
import Render from "../render";

export default class BoxService {
    constructor() {
    }

    /**
     * 格式化key
     * @param type
     * @param pack
     * @param id
     * @returns {string}
     */
    formatKey(type, pack, id) {
        return `${type}-${pack}-${id}`
    }

    /**
     * 格式化pack id
     * @param id
     * @returns {string}
     */
    formatPack(id) {
        return this.formatKey('PACK', 'KEY', id)
    }

    /**
     * 格式化 fragment id
     * @param id
     * @returns {string}
     */
    formatFragment(id) {
        return this.formatKey('FRAGMENT', 'KEY', id)
    }

    /**
     * 格式化 fragment Origin id
     * @param id
     * @returns {string}
     */
    formatOrigin(id) {
        return this.formatKey('FRAGMENT', 'ORIGIN', id)
    }

    /**
     * 格式化 fragment Mover id
     * @param id
     * @returns {string}
     */
    formatMover(id) {
        return this.formatKey('FRAGMENT', 'MOVER', id)
    }

    /**
     * 格式化容器id
     * @param id
     * @returns {string}
     */
    formatProvider(id) {
        return this.formatKey('PROVIDER', 'KEY', id)
    }

    /**
     * 插入box
     * @param pre
     * @param _package
     * @param key
     */
    insertBox({pre, _package, key}) {
        new Render().insert({
            pre,
            _package,
            key
        })
    }

    /**
     * 创建box
     * @param _package
     * @param key
     */
    createBox({_package, key}) {
        new Render().create({
            _package,
            key,
        })
    }

    /**
     * 创建包含pack id 的富含事件的pack mixture
     * @param id
     * @param down
     * @param move
     * @param up
     */
    createPack({id, down, move, up}) {
        new Render().mixinPack({
            _key: this.formatPack(id),
            pre: 'root',
            _package: {},
            moveCallback: move,
            downCallback: down,
            overCallback: up
        })
    }

    /**
     * 查找某box 的value 内的 block
     * @param key
     * @returns {Block|*}
     */
    takeBlock(key) {
        const box = new Render().takeBox().find(key)
        return box && box.value._block
    }

    /**
     * 查找某box 的value 内的 Package
     * @param key
     * @returns {Block|*}
     */
    takePackage(key) {
        const box = new Render().takeBox().find(key)
        return box && box.value._package
    }

    /**
     * 更新某box 的value 内的 block
     * @param id
     * @param newBlock
     */
    updateBlock(id, newBlock) {
        const box = new Render().takeBox()
        box.updateValue({
            key: id,
            autoValue: (value) => this.autoBlock(value, newBlock)
        })
    }

    /**
     * 自动合并block
     * @param value
     * @param newBlock
     * @returns {(*&{_block: *})|*}
     */
    autoBlock(value, newBlock) {
        if (value && value._block) {
            return {
                ...value,
                _block: value._block.build({...value._block.take(), ...newBlock})
            }
        }
        return value
    }

    /**
     * 自动合并package
     * @param value
     * @param newPack
     * @returns {(*&{_package: (*)})|*}
     */
    autoPackage(value, newPack) {
        if (value && value._package) {
            return {
                ...value,
                _package: {...value._package, ...newPack}
            }
        }
        return value
    }

    /**
     * 更新pack mixtrue
     * @param id
     * @param newPack
     */
    updatePack(id, newPack) {
        const box = new Render().takeBox()
        box.updateValue({
            key: id,
            autoValue: (value) => this.autoPackage(value, newPack)
        })
    }

    /**
     * 更新 pack mixtrue 的 block
     * @param id
     * @param position
     */
    updatePackBlock(id, position) {
        this.updateBlock(
            this.formatPack(id),
            position
        )
    }

    /**
     * 更新 Fragment mixtrue 的 block
     * @param id
     * @param position
     */
    updateFragmentBlock(id, position) {
        this.updateBlock(
            this.formatFragment(id),
            position
        )
    }

    /**
     * 更新 Fragment mixtrue 的 Package
     * @param id
     * @param newPackage
     */
    updateFragmentPackage(id, newPackage) {
        this.updatePack(
            this.formatFragment(id),
            newPackage
        )
    }

    /**
     * 更新 pack mixtrue 的 Package
     * @param id
     * @param newPack
     */
    updatePackPackage(id, newPack) {
        this.updatePack(
            this.formatPack(id),
            newPack
        )
    }

    /**
     * 获取box
     * @returns {{}}
     */
    getBox() {
        return new Render().get()
    }

    /**
     * 创建标志fragment 的富含事件的 fragment mixture
     * @param id
     * @param down
     * @param move
     * @param up
     */
    createFragment({id, down, move, up}) {
        new Render().mixinFragment({
            _key: this.formatFragment(id),
            pre: 'root',
            _package: {},
            _originId: this.formatOrigin(id),
            _moverId: this.formatMover(id),
            downCallback: down,
            moveCallback: move,
            overCallback: up
        })
    }

    /**
     * 创建容器
     * @param id
     */
    createProvider(id) {
        new Render().mixinProvider({_providerId: this.formatProvider(id)})
    }

    /**
     * 绘制
     */
    paint() {
        new Observation().use()
    }

    /**
     * 捕获视图更新函数
     * @param fn
     */
    capture(fn) {
        new Observation().subscription(fn)
    }
}
