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
      <el-button
        class=""
        icon="el-icon-refresh"
        size="mini"
        :loading="$wait.is('issueRefreshing')"
        title="Fetch issues and sprints again"
        @click="refreshIssues"
      />
    </div>
    <perfect-scrollbar class="issues">
      <preloader-bar v-wait:visible="'issuesLoading'" main/>
      <transition-group name="el-fade-in">
        <issue
          v-for="issue in getFilteredIssues"
          :key="issue.id"
          :issue="issue"
          @contextmenu.native.prevent="openMenu($event, issue)"
        />
      </transition-group>
    </perfect-scrollbar>
  </div>
</template>

<script>
import issue from './issue/'
import ContextMenu from './contextMenu/'
import search from './search/'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
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
      refreshIssues: 'issues/refreshIssues',
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
    padding-right: 5px;
  }

  .remove-filters-button {
    position: absolute;
    top: -11px;
    right: 63px;
  }
</style>
