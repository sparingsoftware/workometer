<template>
  <div>
    <issue v-for="issue in issues" :key="issue.id" :issue="issue"/>
  </div>
</template>

<script>
import issue from './issue/'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    issue
  },
  computed: {
    ...mapState({
      selectedSprint: state => state.boards.selectedSprint,
      selectedBoard: state => state.boards.selectedBoard,
      issuesForSprint: state => state.issues.issuesForSprint,
      issuesForBoard: state => state.issues.issuesForBoard
    }),
    issues () {
      return this.selectedSprint
        ? this.issuesForSprint[this.selectedSprint]
        : this.issuesForBoard[this.selectedBoard]
    }
  },
  watch: {
    selectedSprint () {
      this.fetchIssues()
    },
    selectedBoard () {
      this.fetchIssues()
    }
  },
  methods: mapActions({ fetchIssues: 'issues/fetchIssues' })
}
</script>

<style lang="scss" scoped>

</style>
