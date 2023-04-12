<template>
    <div class="rule-group">
        <select v-model="internalValue.operator">
            <option value="">选择操作符</option>
            <option value="AND">与</option>
            <option value="OR">或</option>
        </select>

        <div class="conditions">
            <div v-for="(condition, index) in internalValue.conditions" :key="index">
                <input type="text" v-model="condition.field" placeholder="字段" />
                <select v-model="condition.operator">
                    <option value="">选择判断</option>
                    <option value="EQUALS">等于</option>
                    <option value="NOT_EQUALS">不等于</option>
                    <!-- 添加其他判断类型 -->
                </select>
                <input type="text" v-model="condition.value" placeholder="值" />
                <button @click="removeCondition(index)">删除条件</button>
            </div>
        </div>

        <button @click="addCondition">新增条件</button>

        <div class="sub-groups">
            <rule-group
                v-for="(group, index) in internalValue.groups"
                :key="index"
                v-model="internalValue.groups[index]"
            />
        </div>

        <button @click="addSubGroup">新增子规则组</button>
    </div>
</template>

<script>
export default {
    name: "RuleGroup",
    props: {
        value: {
            type: Object,
            default: () => ({
                operator: "",
                conditions: [],
                groups: []
            })
        }
    },
    computed: {
        internalValue: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit("input", value);
            }
        }
    },
    methods: {
        addCondition() {
            this.internalValue.conditions.push({
                field: "",
                operator: "",
                value: ""
            });
        },
        removeCondition(index) {
            this.internalValue.conditions.splice(index, 1);
        },
        addSubGroup() {
            this.internalValue.groups.push({
                operator: "",
                conditions: [],
                groups: []
            });
        }
    }
};
</script>

<style scoped>
.rule-group {
    margin-left: 1rem;
}
</style>
