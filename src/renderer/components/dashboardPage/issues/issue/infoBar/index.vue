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
    <estimate :issue="issue"/>
    <a class="issue__link" @click="openInBrowser(issue.key)">
      <i class="fa fa-external-link" title="Go to issue on Jira"/>
    </a>
    <el-tag
      v-for="component in issue.fields.components"
      :key="component.id"
      size="mini"
      title="Component"
      type="info"
      class="text-uppercase status"
    >
      {{ component.name }}
    </el-tag>
  </div>
</template>

<script>
import Status from './status'
import { mapState } from 'vuex'
import { shell } from 'electron'
import Estimate from './estimate'

export default {
  components: {
    Status,
    Estimate
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
      shell.openExternal(`http://${this.host}/browse/${issueKey}`)
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
      vertical-align: middle;
      margin-right: 5px;
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
