<template>
  <div>view</div>
</template>

<script>
export default {
  name: "view-c",
  props: {
    node: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {
    console.log(this.node, 'view')
    this.node.toFocus()
    this.node.addClick((node) => {
      console.log('click', node)
    })
    setTimeout(() => {
      this.node.waitOver()
    }, 2000)
  }
}
</script>

<style scoped>

</style>