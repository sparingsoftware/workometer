<template>
  <div>
    <context-menu ref="contextMenu"/>
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
      selectedSprintId: state => state.sprints.selectedSprintId,
      selectedBoardId: state => state.boards.selectedBoardId
    }),
    ...mapGetters({
      getIssues: 'issues/getIssues',
      getFilteredIssues: 'filters/getFilteredIssues'
    })
  },
  watch: {
    selectedSprintId (id) {
      if (id) this.fetchIssuesForSprint(id)
    },
    selectedBoardId: {
      immediate: true,
      handler (id) {
        if (id) {
          this.fetchIssuesForBoard(id)
          this.fetchStatusesForProject()
        }
      }
    }
  },
  methods: {
    ...mapActions({
      fetchIssuesForSprint: 'issues/fetchIssuesForSprint',
      fetchIssuesForBoard: 'issues/fetchIssuesForBoard',
      fetchStatusesForProject: 'boards/fetchStatusesForSelectedBoard'
    }),
    openMenu (event, issue) {
      this.$refs.contextMenu.$refs.vueContext.open(event, issue)
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
