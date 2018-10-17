<template>
  <div class="issue fluid" :class="{'issue--subtask': issue.fields.issuetype.subtask}">
    <div class="issue__details">
      <p class="issue__title">
        <strong>{{ issue.key }}</strong> {{ issue.fields.summary }}
      </p>
      <div class="issue__info">
        <img class="issue__icon" :src="issue.fields.issuetype.iconUrl" :title="issue.fields.issuetype.name">
        <status class="issue__status" :status="issue.fields.status"/>
        <a
          class="issue__link"
          @click="openInBrowser(issue.self)"
        >
          <i class="fa-external-link" title="Go to issue on Jira"/>
        </a>
      </div>
    </div>
    <tracker class="issue__tracking" :issue="issue"/>
  </div>
</template>

<script>
import Status from './status'
import Tracker from './tracker/'
import open from 'open'

export default {
  components: {
    Status,
    Tracker
  },
  props: {
    issue: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    openInBrowser (url) {
      open(url)
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
      margin-right: 5px;
    }
    &__status {
      vertical-align: middle;
      margin-right: 5px;
    }
    &__link {
      & i {
        font-style: normal;
      }
      vertical-align: middle;
      font-size: 16px;
      cursor: pointer;
    }
    &__tracking {
      margin-left: 15px;
      text-align: right;
    }
  }
</style>
