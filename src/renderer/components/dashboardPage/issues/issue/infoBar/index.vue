<template>
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
</template>

<script>
import Status from './status'
import open from 'open'

export default {
  components: {
    Status
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
  }
</style>
