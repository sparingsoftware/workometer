<template>
  <div>
    <issue v-for="issue in issues" :key="issue.id" :issue="issue"/>
  </div>
</template>

<script>
import issue from './issue/'
import { mapActions, mapState } from 'vuex'

export default {
  methods: mapActions({ fetchIssues: 'issues/fetchIssues' }),
  watch: {
    selectedSprint () {
      this.fetchIssues()
    },
    selectedBoard () {
      this.fetchIssues()
    }
  },
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
  }
}
</script>

<style lang="scss" scoped>

</style>
