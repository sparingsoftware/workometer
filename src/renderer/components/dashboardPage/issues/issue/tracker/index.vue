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
        @click="startTracking"
      />
    </button>
  </div>
</template>

<script>
import ElapsedTime from './elapsedTime'
import { mapState, mapMutations, mapActions } from 'vuex'
// import moment from 'moment'

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
    }
  },
  methods: {
    ...mapMutations({
      startIssueTracking: 'tracker/startIssueTracking',
      clearIssueTracked: 'tracker/clearIssueTracked',
      clearTrackingStartTime: 'tracker/clearTrackingStartTime'
    }),
    ...mapActions({
      saveWorklog: 'tracker/saveWorklog'
    }),
    confirmationBelow60Seconds () {
      this.$confirm('Worklogs must be over 60 seconds. Do you want to cancel tracking?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        this.clearIssueTracked()
        this.clearTrackingStartTime()
      }).catch(() => {})
    },
    confirmationWhileAnotherIssueTracked () {
      this.$confirm(
        'Another issue is already tracked. Do you want to save worklog and start another one?',
        'Warning', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }).then(() => {
        this.stopIssueTracking()
        this.startIssueTracking(this.issue)
      }).catch(() => {})
    },
    startTracking () {
      if (this.issueTracked) {
        this.confirmationWhileAnotherIssueTracked()
      } else {
        this.startIssueTracking(this.issue)
      }
    },
    stopIssueTracking () {
      if (+this.elapsedTime / 1000 < 60) {
        this.confirmationBelow60Seconds()
      } else {
        this.loading = true
        this.saveWorklog().then(response => {
          this.$notify({
            title: 'Success',
            message: 'Worklog saved',
            type: 'success'
          })
          this.loading = false
          this.clearIssueTracked()
          this.clearTrackingStartTime()
        }).catch(this.handleErrors)
      }
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
