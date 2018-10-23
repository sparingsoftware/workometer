<template>
  <el-form-item label="Assignee" label-width="100px">
    <el-select v-model="issueAssigneeSelected" placeholder="Assignee" clearable>
      <el-option
        v-for="assignee in availableAssignees"
        :key="assignee.accountId"
        :label="assignee.displayName"
        :value="assignee.accountId"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import uniqBy from 'lodash.uniqby'
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      storeAssignee: state => state.filters.issueAssignee
    }),
    ...mapGetters({
      getIssues: 'issues/getIssues'
    }),
    availableAssignees () {
      const assigneedIssues = this.getIssues.filter(issue => issue.fields.assignee)
      const users = assigneedIssues.map(issue => issue.fields.assignee)
      const uniqUsers = uniqBy(users, 'accountId')
      const unassignedUser = { accountId: 'unassigned', displayName: 'Unassigned' }
      return [...uniqUsers, unassignedUser]
    },
    issueAssigneeSelected: {
      get () {
        return this.storeAssignee
      },
      set (value) {
        this.setIssueAssigneeFilter(value)
      }
    }
  },
  methods: {
    ...mapMutations({
      setIssueAssigneeFilter: 'filters/setIssueAssigneeFilter'
    })
  }
}
</script>
