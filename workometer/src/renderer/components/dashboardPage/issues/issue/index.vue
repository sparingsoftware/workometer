<template>
  <div class="issue fluid">
    <div class="issue__details">
      <p class="issue__title">{{ issue.fields.summary }}</p>
      <status-bar :status="issue.fields.status"/>
    </div>
    <tracker class="issue__tracking" :issue="issue"/>
  </div>
</template>

<script>
import StatusBar from './statusBar'
import Tracker from './tracker/'

export default {
  components: {
    StatusBar,
    Tracker
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
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 20px 15px;
    border-top: 1px solid #e2e2e2;
    border-bottom: 1px solid #e2e2e2;
    &__title {
      font-weight: 700;
    }
    &__tracking {
      margin-left: 15px;
      text-align: right;
    }
  }
</style>
