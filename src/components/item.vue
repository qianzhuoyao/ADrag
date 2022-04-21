<template>
  <div>
    <h3>{{ title }}</h3>
   <div style="    overflow: auto;
    height: 69%;
    left: 0px;
    width: 95%;
    margin: auto;
    top: 62px;">
         <slot></slot>
   </div>
  </div>
</template>

<script>
export default {
  name: "item-adrag",
  props: {
    title: String,
    default: () => {
      return "标题";
    },
  },
  data: () => {
    return {};
  },
};
</script>

<style></style>
