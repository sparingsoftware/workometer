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
        @click="startIssueTracking"
      />
      <p v-if="issueTracked === issue">{{ trackedTime }}</p>
    </button>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    issue: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    issueTracked () {
      return this.$store.state.tracker.issueTracked
    },
    trackedTime () {
      // TODO: make it reactive
      return moment().diff(this.$store.state.tracker.trackingStartTime, 'seconds')
    }
  },
  methods: {
    startIssueTracking () {
      if (this.issueTracked) {
        this.$confirm('Another issue is already tracked. Do you want to save worklog and start another one?', 'Warning', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }).then(() => {
          this.storeTrackingIssue()
          this.$store.commit('tracker/startIssueTracking', this.issue)
        }).catch(() => {
        })
      } else {
        this.$store.commit('tracker/startIssueTracking', this.issue)
      }
    },
    storeTrackingIssue () {
      this.$store.dispatch('tracker/stopIssueTracking').then(response => {
        this.$notify({
          title: 'Success',
          message: 'Worklog saved',
          type: 'success'
        })
        this.$store.commit('tracker/setIssueTracked', null)
        this.$store.commit('tracker/setTrackingStartTime', null)
      }).catch(err => {
        this.handleErrors(err)
      })
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
</style>
