<template>
  <div>
    <button class="start-tracking-button">
      <i class="fa fa-play-circle" aria-hidden="true"/>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    issue: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
.start-tracking-button {
  padding: 0;
  background: 0;
  border: 0;
  font-size: 40px;
  color: #409EFF;
  outline: none;
  &:hover {
    color: #86d8ff;
    cursor: pointer;
  }
}
</style>
