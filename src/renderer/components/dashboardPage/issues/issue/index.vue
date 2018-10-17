<template>
  <div class="issue fluid" :class="{'issue--subtask': issue.fields.issuetype.subtask}">
    <div class="issue__details">
      <p class="issue__title">
        <img class="issue__icon" :src="issue.fields.issuetype.iconUrl" :title="issue.fields.issuetype.name">
        <strong>{{ issue.key }}</strong> {{ issue.fields.summary }}
      </p>
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
    padding: 20px 15px;
    border-top: 1px solid #e2e2e2;
    border-bottom: 1px solid #e2e2e2;
    &:hover {
      background: #f8f8f8;
    }
    &--subtask {
      padding: 10px 15px 10px 40px;
    }
    &__title {
      margin: 0;
    }
    &__icon {
      vertical-align: middle;
      position: relative;
      bottom: 1px;
    }
    &__tracking {
      margin-left: 15px;
      text-align: right;
    }
  }
</style>
