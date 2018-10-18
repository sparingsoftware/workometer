<template>
  <div>
    <button class="start-tracking-button">
      <i
        v-if="issueTracked === issue"
        class="fa fa-stop-circle"
        @click="storeTrackingIssue"
      />
      <i
        v-else
        class="fa fa-play-circle"
        @click="startTracking"
      />
    </button>
    <div v-if="issueTracked === issue" class="elapsed-time">
      <elapsed-time/>
    </div>
  </div>
</template>

<script>
import ElapsedTime from './elapsedTime'
import { mapState, mapMutations, mapActions } from 'vuex'

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
  computed: mapState({
    issueTracked: state => state.tracker.issueTracked,
    trackingStartTime: state => state.tracker.trackingStartTime
  }),
  methods: {
    ...mapMutations({
      startIssueTracking: 'tracker/startIssueTracking',
      clearIssueTracked: 'tracker/clearIssueTracked',
      clearTrackingStartTime: 'tracker/clearTrackingStartTime'
    }),
    ...mapActions({
      stopIssueTracking: 'tracker/stopIssueTracking'
    }),
    startTracking () {
      if (this.issueTracked) {
        this.$confirm('Another issue is already tracked. Do you want to save worklog and start another one?', 'Warning', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }).then(() => {
          this.storeTrackingIssue()
          this.startIssueTracking(this.issue)
        }).catch(() => {})
      } else {
        this.startIssueTracking(this.issue)
      }
    },
    storeTrackingIssue () {
      this.stopIssueTracking().then(response => {
        this.$notify({
          title: 'Success',
          message: 'Worklog saved',
          type: 'success'
        })
        this.clearIssueTracked()
        this.clearTrackingStartTime()
      }).catch(this.handleErrors)
    }
  }
}
</script>

<style lang="scss" scoped>
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
    font-weight: 700
  }
</style>