<template>
  <div>
    <context-menu ref="menuWrapper"/>
    <transition-group name="el-fade-in">
      <issue
        v-for="issue in issues"
        :key="issue.id"
        :issue="issue"
        @contextmenu.native.prevent="openMenu($event, issue)"
      />
    </transition-group>
  </div>
</template>

<script>
import issue from './issue/'
import ContextMenu from './contextMenu/'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    issue,
    ContextMenu
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
  methods: {
    ...mapActions({
      fetchIssuesForSprint: 'issues/fetchIssuesForSprint',
      fetchIssuesForBoard: 'issues/fetchIssuesForBoard'
    }),
    openMenu (event, issue) {
      this.$refs.menuWrapper.$refs.menu.open(event, issue)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
