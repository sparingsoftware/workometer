<template>
  <div>
    <el-dialog title="Manual log work" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="Time spent">
          <el-input
            v-model="form.worklog.timeSpent"
            placeholder="1d 9h 12m"
            autocomplete="off"
            @blur="handleBlur"
          />
        </el-form-item>
        <el-form-item label="Date">
          <el-date-picker
            v-model="form.worklog.started"
            :readonly="false"
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
import moment from 'moment'

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
    openDialog (issue) {
      this.issue = issue
      this.dialogVisible = true
      this.form = {
        worklog: {}
      }
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
    },
    handleBlur (event) {
      const inputValue = event.target.value
      const days = +this.removeLastCharacter(/([0-9]{1,2}d)+/ig.exec(inputValue))
      const hours = +this.removeLastCharacter(/([0-9]{1,2}h)+/ig.exec(inputValue))
      const minutes = +this.removeLastCharacter(/([0-9]{1,2}m)+/ig.exec(inputValue))

      const startDate = moment().subtract({
        days,
        hours,
        minutes
      }).format('YYYY-MM-DD HH:mm:ss')
      if (!this.form.worklog.started) {
        this.$set(this.form.worklog, 'started', new Date(startDate))
      }
    },
    removeLastCharacter (arr) {
      return (arr && arr[0].length) ? arr[0].slice(0, -1) : ''
    }
  }
}
</script>
