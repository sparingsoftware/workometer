<template>
  <div>
    <button class="start-tracking-button">
      <i
        v-if="issueTracked === issue"
        class="fa fa-stop-circle"
        @click="stopIssueTracking"
      />
      <i
        v-else
        class="fa fa-play-circle"
        @click="startIssueTracking"
      />
    </button>
  </div>
</template>

<script>
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
          this.$store.dispatch('tracker/stopIssueTracking')
          this.$store.commit('tracker/startIssueTracking', this.issue)
        }).catch(() => {
        })
      } else {
        this.$store.commit('tracker/startIssueTracking', this.issue)
      }
    },
    stopIssueTracking () {
      this.$store.dispatch('tracker/stopIssueTracking')
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
