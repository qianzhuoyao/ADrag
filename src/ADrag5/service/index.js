import Observation from "../observation";
import Render from "../render";

export default class Service {
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

    updateBlock(id, newBlock) {
        const box = new Render().takeBox()
        box.updateValue({
            key: id,
            autoValue: (value) => {
                if (value && value._block) {
                    return {
                        ...value,
                        _block: value._block.build(newBlock)
                    }
                }
                return value
            }
        })
    }

    updatePack(id, newPack) {
        const box = new Render().takeBox()
        box.updateValue({
            key: id,
            autoValue: (value) => {
                if (value && value._package) {
                    return {
                        ...value,
                        _package: newPack
                    }
                }
                return value
            }
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
