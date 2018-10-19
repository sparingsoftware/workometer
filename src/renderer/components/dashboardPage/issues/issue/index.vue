<template>
  <div
    class="issue fluid"
    :class="{'issue--subtask': issue.fields.issuetype.subtask}"
  >
    <div class="issue__details">
      <p class="issue__title">
        <strong>{{ issue.key }}</strong> {{ issue.fields.summary }}
      </p>
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
    &__tracking {
      margin-left: 15px;
      text-align: right;
    }
  }
</style>
