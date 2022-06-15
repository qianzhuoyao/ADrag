import Vue from 'vue'
import VueDragResize from 'vue-drag-resize'
import App from "./App.vue";
new Vue({
    render: h => h(App)
}).$mount("#app");

Vue.component('vue-drag-resize', VueDragResize)