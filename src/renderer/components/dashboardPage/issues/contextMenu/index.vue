<template>
  <div>
    <vue-context ref="vueContext">
      <ul slot-scope="child" class="actions">
        <p class="separator">Actions</p>
        <li @click="logWork(child.data)">
          Log Work
        </li>
        <li @click="assignIssueToMe({issue: child.data})">
          Assign to me
        </li>
        <li @click="createSubtask({ issuetype: child.data.fields.issuetype })">
          Create subtask
        </li>
        <li v-for="sprint in availableSprints" @click="moveToSprint({issue: child.data, sprint: sprint})">
          Move to {{ sprint.name }}
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
    <issue-form ref="issueForm"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { VueContext } from 'vue-context'
import LogWorkDialog from './actions/logWorkDialog/'
import IssueForm from '../form/'
import service from '@/service'

export default {
  components: {
    VueContext,
    LogWorkDialog,
    IssueForm
  },
  props: {
    issue: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState({
      statusesMap: state => state.boards.statusesMap,
      sprints: state => state.sprints.sprints,
      selectedSprintId: state => state.sprints.selectedSprintId
    }),
    availableSprints () {
      const notSelectedAndNotBacklog = sprint => sprint.name !== 'Backlog' && sprint.id !== this.selectedSprintId
      return this.sprints.filter(notSelectedAndNotBacklog)
    }
  },
  methods: {
    ...mapActions({
      setIssueStatus: 'issues/setIssueStatus',
      assignIssueToMe: 'issues/assignIssueToMe',
      refreshIssues: 'issues/refreshIssues'
    }),
    logWork (issue) {
      this.$refs.logWorkDialog.openDialog(issue)
    },
    moveToSprint ({issue, sprint}) {
      service.moveIssueToSprint({
        issueKey: issue.key,
        sprintId: sprint.id
      }).then(response => {
        this.refreshIssues()
      }).catch(this.handleErrors)
    },
    createSubtask (issue) {
      // console.log(issue)
      this.$refs.issueForm.openDialog(issue)
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
    & ul li {
      padding: 10px 20px !important;
      font-weight: 400;
      letter-spacing: 0.015em;
    }
  }

  .separator {
    margin-left: 20px;
    cursor: default;
    color: #939393;
  }
</style>
