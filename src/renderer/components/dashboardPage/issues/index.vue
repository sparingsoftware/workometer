<template>
  <div>
    <pinned-tracker v-if="issueTracked" class="pinned-tracker"/>
    <filters ref="filtersDialog"/>
    <issue-form ref="issueForm"/>
    <issue-details-dialog ref="detailsDialog"/>
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
        icon="el-icon-refresh"
        size="mini"
        :loading="$wait.is('issueRefreshing')"
        title="Refetch issues"
        @click="refreshIssues"
      />
      <el-button
        icon="fa fa-plus"
        size="mini"
        title="Create issue"
        @click="createNewIssue"
      />
      <el-button
        icon="fa fa-sign-out"
        type="warning"
        size="mini"
        :loading="$wait.is('logout')"
        title="Logout"
        @click="logout"
      />
    </div>
    <div ref="issuesContainer" class="issues">
      <no-results v-if="noIssues"/>
      <preloader-bar v-wait:visible="'issuesLoading'" main/>
      <transition-group name="el-fade-in" mode="out-in" tag="div">
        <issue
          v-for="(issue, i) in getFilteredIssues"
          :id="issue.key"
          :key="issue.key"
          class="issue"
          :class="{'padding-for-tracker': i === 0 && issueTracked}"
          :issue="issue"
          @keyClicked="openIssueDetails(issue)"
          @contextmenu.native.prevent="openMenu($event, issue)"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import scrollToIssue from '@/utils/scrollToIssue'
import issue from './issue/'
import ContextMenu from './contextMenu/'
import IssueForm from './form/'
import search from './search/'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import filters from './filters/'
import IssueDetailsDialog from './details/'
import NoResults from './noResults'
import PinnedTracker from './pinned-tracker/'

export default {
  components: {
    search,
    issue,
    ContextMenu,
    filters,
    IssueForm,
    IssueDetailsDialog,
    NoResults,
    PinnedTracker
  },
  computed: {
    ...mapState({
      selectedSprintId: state => state.sprints.selectedSprintId,
      selectedBoardId: state => state.boards.selectedBoardId,
      issueTracked: state => state.tracker.issueTracked
    }),
    ...mapGetters({
      getIssues: 'issues/getIssues',
      getFilteredIssues: 'filters/getFilteredIssues',
      filtersSet: 'filters/filtersSet'
    }),
    filterType () {
      return this.filtersSet ? 'primary' : ''
    },
    noIssues () {
      const loadingFinished = !this.$wait.is(['sprintIssuesLoading', 'boardIssuesLoading'])
      const emptyResults = !this.getFilteredIssues.length
      return loadingFinished && emptyResults
    }
  },
  watch: {
    selectedSprintId (id) {
      if (id) {
        this.$nextTick(() => {
          scrollToIssue(this.issueTracked)
        })
        this.fetchIssuesForSprint(id).then(scrollToIssue(this.issueTracked))
      }
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
      fetchStatusesForProject: 'boards/fetchStatusesForSelectedBoard',
      logout: 'logout'
    }),
    ...mapMutations({
      clearFilters: 'filters/clearFilters'
    }),
    openMenu (event, issue) {
      this.$refs.contextMenu.$refs.vueContext.open(event, issue)
    },
    openFilters () {
      this.$refs.filtersDialog.openDialog()
    },
    createNewIssue () {
      this.$refs.issueForm.openDialog()
    },
    openIssueDetails (issue) {
      this.$refs.detailsDialog.openDialog(issue)
    }
  }
}
</script>

<style lang="scss" scoped>
  $topbar-height: 262px; // 262px = title, boards picker, sprint picker, tabs, search input height

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

  .pinned-tracker {
    left: 0;
    top: $topbar-height;
  }

  .issues {
    height: calc(100vh - #{$topbar-height});
    padding-right: 5px;
    overflow-y: scroll;
  }

  .remove-filters-button {
    position: absolute;
    top: -11px;
    right: 167px;
  }

  .create-issue-button {
    position: fixed;
    bottom: 15px;
    right: 10px;
  }

  .padding-for-tracker {
    padding-top: 57px;
  }
</style>
