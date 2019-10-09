<template>
  <div>
    <el-dialog title="Manual log work" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="Time spent">
          <el-input
            v-model="form.timeSpent"
            placeholder="1d 9h 12m"
            autocomplete="off"
            @blur="handleBlur"
          />
        </el-form-item>
        <el-form-item label="Date">
          <el-date-picker
            v-model="form.started"
            :readonly="false"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
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
import service from '@/service'

const getWorkedTimeParsed = timeSpent => {
  const getNumberBeforeLetter = letter => {
    const regex = new RegExp(`(\\d+)${letter}`, 'i')
    return +(regex.exec(timeSpent) || [0, 0])[1]
  }
  return ['d', 'h', 'm'].map(getNumberBeforeLetter)
}

const parseToSeconds = timeSpent => {
  const [days, hours, minutes] = getWorkedTimeParsed(timeSpent)

  const minute = 60
  const hour = minute * 60
  const day = hour * 24

  return (days * day) + (hours * hour) + (minutes * minute)
}

export default {
  data () {
    return {
      dialogVisible: false,
      form: {
        timeSpent: null,
        started: null
      },
      issue: null
    }
  },
  methods: {
    openDialog (issue) {
      this.issue = issue
      this.dialogVisible = true
      this.form = {
        timeSpent: null,
        started: null
      }
    },
    submitForm () {
      const timeSpentSeconds = parseToSeconds(this.form.timeSpent)
      service.addWorkLog(this.issue.id, moment(this.form.started), timeSpentSeconds)
        .then(() => {
          this.$notify({
            title: 'Success',
            message: 'Worklog saved',
            type: 'success'
          })
          this.closeDialog()
        })
        .catch(this.handleErrors)
    },
    closeDialog () {
      this.issue = null
      this.dialogVisible = false
    },
    handleBlur () {
      const [days, hours, minutes] = getWorkedTimeParsed(this.form.timeSpent)
      const startDate = moment().subtract({ days, hours, minutes }).toDate()
      if (!this.form.started) this.$set(this.form, 'started', startDate)
    }
  }
}
</script>
