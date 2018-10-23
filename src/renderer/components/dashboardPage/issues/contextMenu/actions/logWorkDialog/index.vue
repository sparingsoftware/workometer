<template>
  <div>
    <el-dialog title="Manual log work" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="Time spent">
          <el-input v-model="form.worklog.timeSpent" placeholder="1d 9h 12m" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="Date">
          <el-date-picker
            v-model="form.worklog.started"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss.000ZZ"
            placeholder="Started datetime"
          />
        </el-form-item>
        <!-- Adjust start time according to time spend -->
        <el-form-item label="Worklog comment">
          <el-input v-model="form.comment" type="textarea" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="submitForm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      form: {
        worklog: {}
      },
      issue: null
    }
  },
  methods: {
    logWork (issue) {
      this.issue = issue
      this.dialogVisible = true
    },
    submitForm () {
      this.$jira.issue.addWorkLog({
        issueId: this.issue.id,
        ...this.form
      }).then(response => {
        this.$notify({
          title: 'Success',
          message: 'Worklog saved',
          type: 'success'
        })
        this.closeDialog()
      }).catch(this.handleErrors)
    },
    closeDialog () {
      this.issue = null
      this.dialogVisible = false
    }
  }
}
</script>
