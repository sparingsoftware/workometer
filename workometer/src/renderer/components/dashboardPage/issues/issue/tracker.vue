<template>
  <div>
    <button class="start-tracking-button" @click="startIssueTracking">
      <i v-if="issueTracked" class="fa fa-stop-circle" aria-hidden="true"/>
      <i v-else class="fa fa-play-circle" aria-hidden="true"/>
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
      return this.$store.state.tracker.trackedIssue === this.issue
    }
  },
  methods: {
    startIssueTracking () {
      this.$store.commit('tracker/startIssueTracking', this.issue)
    },
    stopIssueTracking () {
      console.log('a')
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
