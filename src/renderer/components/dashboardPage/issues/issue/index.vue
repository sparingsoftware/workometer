<template>
  <div
    class="issue fluid"
    :class="{'issue--subtask': issue.fields.issuetype.subtask}"
  >
    <preloader-bar v-wait:visible="[`issueStatusChange_${issue.id}`, `issueAssignChange_${issue.id}`]"/>
    <div class="issue__details">
      <div class="issue__key">{{ issue.key }}</div>
      <div class="issue__description">
        {{ issue.fields.summary }}
      </div>
      <info-bar :issue="issue"/>
    </div>
    <tracker class="issue__tracking" :issue="issue"/>
  </div>
</template>

<script>
import Tracker from './tracker/'
import InfoBar from './infoBar/'

export default {
  components: {
    Tracker,
    InfoBar
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
    position: relative;
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
    &__key {
      font-weight: 700;
    }
    &__description {
      margin: 0 0 5px;
    }
    &__tracking {
      margin-left: 15px;
      text-align: right;
    }
  }
</style>
