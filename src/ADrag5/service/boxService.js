import Observation from "../observation";
import Render from "../render";

export default class BoxService {
    constructor() {
    }

    formatKey(type, pack, id) {
        return `${type}-${pack}-${id}`
    }

    formatPack(id) {
        return this.formatKey('PACK', 'KEY', id)
    }

    formatFragment(id) {
        return this.formatKey('FRAGMENT', 'KEY', id)
    }

    formatOrigin(id) {
        return this.formatKey('FRAGMENT', 'ORIGIN', id)
    }

    formatMover(id) {
        return this.formatKey('FRAGMENT', 'MOVER', id)
    }

    formatProvider(id) {
        return this.formatKey('PROVIDER', 'KEY', id)
    }

    insertBox({pre, _package, key}) {
        new Render().insert({
            pre,
            _package,
            key
        })
    }

    createBox({_package, key}) {
        new Render().create({
            _package,
            key,
        })
    }

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

    takeBlock(key) {
        const box = new Render().takeBox().find(key)
        return box && box.value._block
    }

    takePackage(key) {
        const box = new Render().takeBox().find(key)
        return box && box.value._package
    }

    updateBlock(id, newBlock) {
        const box = new Render().takeBox()
        box.updateValue({
            key: id,
            autoValue: (value) => this.autoBlock(value, newBlock)
        })
    }

    autoBlock(value, newBlock) {
        if (value && value._block) {
            return {
                ...value,
                _block: value._block.build({...value._block.take(), ...newBlock})
            }
        }
        return value
    }

    autoPackage(value, newPack) {
        if (value && value._package) {
            return {
                ...value,
                _package: {...value._package, ...newPack}
            }
        }
        return value
    }

    updatePack(id, newPack) {
        const box = new Render().takeBox()
        box.updateValue({
            key: id,
            autoValue: (value) => this.autoPackage(value, newPack)
        })
    }

    updatePackBlock(id, position) {
        this.updateBlock(
            this.formatPack(id),
            position
        )
    }

    setZIndexByFragment({id, z}) {
        this.updateFragmentBlock(id, {
            z
        })
    }

    setZIndexByPack({id, z}) {
        this.updatePackBlock(id, {
            z
        })
    }

    moveByFragment({id, x, y}) {
        this.updateFragmentBlock(id, {
            x,
            y
        })
    }

    moveByPack({id, x, y}) {
        this.updatePackBlock(id, {
            x,
            y
        })
    }

    updateFragmentBlock(id, position) {
        this.updateBlock(
            this.formatFragment(id),
            position
        )
    }

    updateFragmentPackage(id, newPackage) {
        this.updatePack(
            this.formatFragment(id),
            newPackage
        )
    }

    updatePackPackage(id, newPack) {
        this.updatePack(
            this.formatPack(id),
            newPack
        )
    }

    getBox() {
        return new Render().get()
    }

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

    createProvider(id) {
        new Render().mixinProvider({_providerId: this.formatProvider(id)})
    }

    paint() {
        new Observation().use()
    }

    capture(fn) {
        new Observation().subscription(fn)
    }
}
