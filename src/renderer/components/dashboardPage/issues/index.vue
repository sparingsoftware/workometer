<template>
  <div>
    <filters ref="filtersDialog"/>
    <context-menu ref="contextMenu"/>
    <div class="filters-bar">
      <search class="search"/>
      <el-button
        class="filters-button"
        title="Set filters"
        :type="filterType"
        @click="openFilters"
      >
        <i class="fa fa-filter"/>
      </el-button>
      <el-button
        v-if="filtersSet"
        class="remove-filters-button"
        icon="el-icon-close"
        size="mini"
        title="Clear filters"
        circle
        @click="clearFilters"
      />
    </div>
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
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import filters from './filters/'

export default {
  components: {
    search,
    issue,
    ContextMenu,
    filters
  },
  computed: {
    ...mapState({
      selectedSprintId: state => state.sprints.selectedSprintId,
      selectedBoardId: state => state.boards.selectedBoardId
    }),
    ...mapGetters({
      getIssues: 'issues/getIssues',
      getFilteredIssues: 'filters/getFilteredIssues',
      filtersSet: 'filters/filtersSet'
    }),
    filterType () {
      return this.filtersSet ? 'primary' : ''
    }
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
    ...mapMutations({
      clearFilters: 'filters/clearFilters'
    }),
    openMenu (event, issue) {
      this.$refs.contextMenu.$refs.vueContext.open(event, issue)
    },
    openFilters () {
      this.$refs.filtersDialog.openFiltersDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
  .filters-bar {
    padding: 0 15px 15px;
    display: flex;
    justify-content: space-between;
    position: relative;
  }

  .search {
    width: 100%;
    margin-right: 15px;
  }

  .issues {
    height: calc(100vh - 221px); // 221px = boards picker, sprint picker, tabs, search input height
    overflow-y: scroll;
  }

  .remove-filters-button {
    position: absolute;
    top: -11px;
    right: 4px;
  }
</style>
