<template>
  <div>
    status: {{ status.name }}
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
