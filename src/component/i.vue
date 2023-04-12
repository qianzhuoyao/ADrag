<template>
    <div class="rule-manager">
        <h2>规则管理</h2>
        <div>
            <label for="start-date">生效开始时间：</label>
            <input type="date" id="start-date" v-model="startDate" />
            <label for="end-date">生效结束时间：</label>
            <input type="date" id="end-date" v-model="endDate" />
        </div>

        <div>
            <rule-group v-model="ruleGroup" />
        </div>

        <button @click="addRuleGroup">新增规则组</button>
    </div>
</template>

<script>
import RuleGroup from "./d.vue";

export default {
    name: "RuleManager",
    components: {
        RuleGroup
    },
    data() {
        return {
            startDate: "",
            endDate: "",
            ruleGroup: {}
        };
    },
    methods: {
        addRuleGroup() {
            this.ruleGroup = {
                operator: "",
                conditions: [],
                groups: []
            };
        }
    }
};
</script>

<style scoped>
.rule-manager {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
}
</style>
