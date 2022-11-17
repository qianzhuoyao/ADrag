export class Service {
    constructor() {
        this.init();
    }

    autoGenKey() {
        return `node-${Object.keys(this.nodes).length}`;
    }

    create(payload) {
        console.log(payload, 'createPayload')
        this.edit(this.autoGenKey(), {
            body: payload.body,
            key: payload.key
        });
    }

    init() {
        this.nodes = {};
    }

    find(key) {
        return this.nodes[key];
    }

    getAll() {
        console.log(this.nodes);
        return JSON.parse(JSON.stringify(this.nodes));
    }

    edit(key, payload) {
        if (key) {
            const {from, to} = payload;
            console.log("更新来源", from, "更新目标", to);
            this.nodes[key] = {...this.nodes[key], ...payload};
        }
    }

    remove(key) {
        if (key in this.nodes) {
            delete this.nodes[key];
        }
    }
}
