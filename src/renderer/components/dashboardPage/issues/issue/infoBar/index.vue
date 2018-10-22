<template>
  <div class="issue__info">
    <img
      v-if="issue.fields.assignee"
      class="issue__avatar"
      :src="issue.fields.assignee.avatarUrls['48x48']"
      :title="`Assignee: ${issue.fields.assignee.displayName}`"
    >
    <img class="issue__icon" :src="issue.fields.issuetype.iconUrl" :title="issue.fields.issuetype.name">
    <status class="issue__status" :status="issue.fields.status"/>
    <a
      class="issue__link"
      @click="openInBrowser(issue.key)"
    >
      <i class="fa fa-external-link" title="Go to issue on Jira"/>
    </a>
  </div>
</template>

<script>
import Status from './status'
import open from 'open'
import { mapState } from 'vuex'

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
  computed: mapState({ host: state => state.login.host }),
  methods: {
    openInBrowser (issueKey) {
      const link = `http://${this.host}/browse/${issueKey}`
      open(link)
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
    &__avatar {
      display: inline-block;
      vertical-align: middle;
      width: 30px;
      margin-right: 6px;
      border-radius: 50%;
    }
  }
</style>
