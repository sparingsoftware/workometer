<template>
  <div>
    <issue-form ref="issueForm"/>
    <vue-context ref="vueContext">
      <ul slot-scope="child" class="actions">
        <p class="separator">Actions</p>
        <li @click="editIssue({issue: child.data})">
          Edit issue
        </li>
        <li @click="logWork(child.data)">
          Log Work
        </li>
        <li @click="assignIssueToMe({issue: child.data})">
          Assign to me
        </li>
        <li @click="createSubtask({issue: child.data})">
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { VueContext } from 'vue-context'
import LogWorkDialog from './actions/logWorkDialog/'
import service from '@/service'
import IssueForm from '@/components/dashboardPage/issues/form/'

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
    statuses (issue) {
      return issue
        ? this.statusesMap[issue.fields.issuetype.name]
        : []
    },
    createSubtask ({ issue }) {
      this.$refs.issueForm.openSubtaskDialog(issue)
    },
    editIssue ({ issue }) {
      this.$refs.issueForm.editIssue(issue)
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
