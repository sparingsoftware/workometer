<template>
  <div>
    <context-menu ref="menuWrapper"/>
    <search key="search" class="search"/>
    <div class="issues">
      <transition-group name="el-fade-in">
        <issue
          v-for="issue in getFilteredIssues"
          :key="issue.id"
          :issue="issue"
          @contextmenu.native.prevent="openMenu($event, issue)"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import issue from './issue/'
import ContextMenu from './contextMenu/'
import search from './search/'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  components: {
    search,
    issue,
    ContextMenu
  },
  computed: {
    ...mapState({
      selectedSprint: state => state.sprints.selectedSprint,
      selectedBoard: state => state.boards.selectedBoard
    }),
    ...mapGetters({
      getIssues: 'issues/getIssues',
      getFilteredIssues: 'filters/getFilteredIssues'
    })
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
  .search {
    padding: 0 15px 15px;
  }

  .issues {
    height: calc(100vh - 221px); // 221px = boards picker, sprint picker, tabs, search input height
    overflow-y: scroll;
  }
</style>
