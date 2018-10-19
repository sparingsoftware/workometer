<template>
  <div>
    <vue-context ref="menu">
      <ul slot-scope="child" class="actions">
        <p class="separator">Actions</p>
        <li
          @click="logWork(child.data)"
        >
          Log Work
        </li>
        <p class="separator">Change status</p>
        <li
          v-for="status in statuses(child.data)"
          @click="setIssueStatus({ issue: child.data, status })"
        >
          {{ status.name }}
        </li>
      </ul>
    </vue-context>
    <log-work-dialog ref="logWorkDialog"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { VueContext } from 'vue-context'
import LogWorkDialog from './actions/logWorkDialog/'

export default {
  components: {
    VueContext,
    LogWorkDialog
  },
  props: {
    issue: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState({
      statusesMap: state => state.boards.statusesMap
    })
  },
  methods: {
    ...mapActions({
      setIssueStatus: 'issues/setIssueStatus'
    }),
    logWork (issue) {
      this.$refs.logWorkDialog.logWork(issue)
    },
    statuses (issue) {
      return issue
        ? this.statusesMap[issue.fields.issuetype.name]
        : []
    }
  }
}
</script>

<style lang="scss" scoped>
  .v-context {
    border: 1px solid #e2e2e2 !important;
    outline: none !important;
  }

  .separator {
    margin-left: 20px;
    cursor: default;
  }
</style>
