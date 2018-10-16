<template>
  <div class="issue fluid">
    <p class="issue__title">{{ issue.fields.summary }}</p>
    <status-bar :status="issue.fields.status"/>
  </div>
</template>

<script>
import StatusBar from './statusBar'

export default {
  components: {
    StatusBar
  },
  props: {
    issue: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
  .issue {
    box-sizing: border-box;
    padding: 20px 15px;
    border-top: 1px solid #e2e2e2;
    border-bottom: 1px solid #e2e2e2;
    &__title {
      font-weight: 700;
    }
  }
</style>
