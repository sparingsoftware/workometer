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
      const getNumberBeforeLetter = letter => {
        const regex = new RegExp(`(\\d+)${letter}`, 'i')
        return +(regex.exec(inputValue) || [0, 0])[1]
      }
      const [days, hours, minutes] = ['d', 'h', 'm'].map(getNumberBeforeLetter)

      const startDate = moment().subtract({
        days,
        hours,
        minutes
      }).toDate()
      if (!this.form.worklog.started) {
        this.$set(this.form.worklog, 'started', startDate)
      }
    }
  }
}
</script>
