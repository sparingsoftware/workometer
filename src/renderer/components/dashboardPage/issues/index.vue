<template>
  <div>
    <transition-group name="el-fade-in">
      <issue v-for="issue in issues" :key="issue.id" :issue="issue"/>
    </transition-group>
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
      selectedSprint: state => state.sprints.selectedSprint,
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
    selectedSprint (id) {
      if (id) this.fetchIssuesForSprint(id)
    },
    selectedBoard (id) {
      if (id) this.fetchIssuesForBoard(id)
    }
  },
  methods: mapActions({
    fetchIssuesForSprint: 'issues/fetchIssuesForSprint',
    fetchIssuesForBoard: 'issues/fetchIssuesForBoard'
  })
}
</script>

<style lang="scss" scoped>

</style>
