<template>
  <div class="tracker">
    <transition name="el-fade-in">
      <elapsed-time v-if="isIssueTracked" class="elapsed-time"/>
    </transition>
    <el-button 
      v-if="isIssueTracked" 
      class="tracking-button" 
      icon="fa fa-stop-circle" 
      title="Stop tracking" 
      :loading="loading"
      @click="stopIssueTracking"
    />
    <el-button 
      v-else 
      class="tracking-button" 
      icon="fa fa-play-circle" 
      title="Start tracking"
      :loading="loading"
      @click="startNewTracking"
    />
  </div>
</template>

<script>
import { remote } from 'electron'
import { mapActions, mapMutations, mapState } from 'vuex'
import moment from 'moment'
import ElapsedTime from './elapsedTime'
import inactivityMonitor from '@/inactivity'

export default {
  components: {
    ElapsedTime
  },
  props: {
    issue: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState({
      issueTracked: state => state.tracker.issueTracked,
      trackingStartTime: state => state.tracker.trackingStartTime,
      elapsedTime: state => state.tracker.elapsedTime
    }),
    isIssueTracked () {
      return this.issueTracked && this.issueTracked.id === this.issue.id
    },
    saveAllowed () {
      const secondsElapsed = +this.elapsedTime / 1000
      return secondsElapsed > 60
    },
    formattedElapsedTime () {
      return this.elapsedTime && this.elapsedTime.format('HH:mm:ss')
    }
  },
  methods: {
    ...mapMutations({
      startIssueTracking: 'tracker/startIssueTracking',
      clearIssueTracked: 'tracker/clearIssueTracked',
      clearTrackingStartTime: 'tracker/clearTrackingStartTime',
      setElapsedTime: 'tracker/setElapsedTime'
    }),
    ...mapActions({
      saveWorklog: 'tracker/saveWorklog'
    }),
    confirmationBelow60Seconds () {
      this.$confirm('Worklogs must be over 60 seconds. Do you want to cancel tracking?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(this.clearTracker).catch(() => {
      })
    },
    confirmationWhileAnotherIssueTracked () {
      this.$confirm(
        'Another issue is already tracked. Do you want to go home and start another one?',
        'Warning', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        })
        .then(() => {
          if (this.saveAllowed) {
            this.stopIssueTracking()
          } else {
            this.clearTracker()
          }
          this.startTracking(this.issue)
        })
    },
    confirmationInactivity (idleTimeSeconds) {
      remote.getCurrentWindow().show()
      const idleTime = moment.utc(idleTimeSeconds * 1000)
      const idleSince = moment().subtract(idleTimeSeconds, 'seconds')
      this.$confirm(
        `You were inactive for ${idleTime.format('HH:mm:ss')}. ` +
        'Do you want to include that period from your worklog?',
        'Warning',
        {
          confirmButtonText: 'Keep',
          cancelButtonText: 'Exclude',
          type: 'warning'
        }
      ).then(() => {
        inactivityMonitor.start(this.confirmationInactivity)
      }).catch(() => {
        const isSaveAllowed = (this.elapsedTime - idleTime) / 1000 > 60
        const issue = this.issueTracked
        if (isSaveAllowed) {
          this.storeWorklog(idleSince).then(() => {
            this.startTracking(issue)
          })
        } else {
          this.startTracking(issue)
        }
      })
    },
    startNewTracking () {
      if (this.issueTracked) {
        this.confirmationWhileAnotherIssueTracked()
      } else {
        this.startTracking(this.issue)
      }
    },
    startTracking (issue) {
      this.startIssueTracking(issue)
      inactivityMonitor.start(this.confirmationInactivity)
    },
    stopIssueTracking () {
      if (!this.saveAllowed) {
        this.confirmationBelow60Seconds()
      } else {
        this.storeWorklog()
      }
    },
    storeWorklog (trackingStopTime) {
      this.loading = true

      const endWorkTime = trackingStopTime || moment()
      const workedTime = endWorkTime.diff(this.trackingStartTime, 'seconds')
      const formattedWorkedTime = (moment.utc(workedTime * 1000)).format('HH:mm:ss')

      return this.saveWorklog(workedTime)
        .then(response => {
          this.$notify({
            title: 'Success',
            message: `Worklog saved. You have worked ${formattedWorkedTime}`,
            type: 'success'
          })
          this.loading = false
          this.clearTracker()
        }).catch(this.handleErrors)
    },
    clearTracker () {
      this.clearIssueTracked()
      this.clearTrackingStartTime()
      this.setElapsedTime(null)
      inactivityMonitor.stop()
    }
  }
}
</script>

<style lang="scss" scoped>
  .tracker {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tracking-button {
    padding: 0;
    background: 0;
    border: 0;
    font-size: 40px;
    color: #409EFF;
    outline: none;
    &:hover {
      background: 0;
      color: #86d8ff;
      cursor: pointer;
    }
  }

  .elapsed-time {
    font-size: 20px;
    margin-right: 8px;
  }
</style>
