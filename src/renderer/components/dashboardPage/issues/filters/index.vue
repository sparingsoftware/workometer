<template>
  <div>
    <el-dialog title="Set filters" :visible.sync="dialogVisible" width="80vw">
      <el-form>
        <issue-statuses/>
        <issue-types/>
        <issue-assignee/>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import IssueStatuses from './issueStatuses'
import IssueTypes from './issueTypes'
import IssueAssignee from './issueAssignee'

export default {
  components: {
    IssueAssignee,
    IssueStatuses,
    IssueTypes
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    openFiltersDialog () {
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
