<template>
  <div class="tracker">
    <transition name="el-fade-in">
      <elapsed-time v-if="isIssueTracked" class="elapsed-time"/>
    </transition>
    <button class="start-tracking-button" :loading="loading">
      <i
        v-if="isIssueTracked"
        class="fa fa-stop-circle"
        @click="stopIssueTracking"
      />
      <i
        v-else
        class="fa fa-play-circle"
        @click="startNewTracking"
      />
    </button>
  </div>
</template>

<script>
import {remote} from 'electron'
import {mapActions, mapMutations, mapState} from 'vuex'
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
        'Do you want to exclude that period from your worklog?',
        'Warning',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      ).then(() => {
        if (this.saveAllowed) {
          const issue = this.issueTracked
          this.storeWorklog(idleSince).then(() => {
            this.startTracking(issue)
          })
        }
      }).catch(() => {
        inactivityMonitor.start(this.confirmationInactivity)
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
      return this.saveWorklog(trackingStopTime)
        .then(response => {
          this.$notify({
            title: 'Success',
            message: 'Worklog saved',
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
  }

  .start-tracking-button {
    padding: 0;
    background: 0;
    border: 0;
    font-size: 40px;
    color: #409EFF;
    outline: none;
    &:hover {
      color: #86d8ff;
      cursor: pointer;
    }
  }

  .elapsed-time {
    font-size: 20px;
    display: inline-block;
    margin-right: 8px;
  }
</style>
