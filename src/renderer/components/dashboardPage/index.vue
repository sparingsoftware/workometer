<template>
  <div class="view">
    <header-component/>
    <div class="pickers">
      <boards-picker/>
      <sprints-picker/>
    </div>
    <el-tabs v-model="currentTab" stretch @tab-click="changeTab">
      <el-tab-pane label="Issues" name="issues"/>
    </el-tabs>
    <issues v-if="currentTab === 'issues'"/>
    <recent-worklogs v-if="currentTab === 'worklogs'"/>
  </div>
</template>

<script>
import Issues from './issues/'
import RecentWorklogs from './recentWorklogs/'
import BoardsPicker from './pickers/boardsPicker/'
import SprintsPicker from './pickers/sprintsPicker/'
import HeaderComponent from '../header'
import { mapActions } from 'vuex'

export default {
  components: {
    HeaderComponent,
    BoardsPicker,
    RecentWorklogs,
    SprintsPicker,
    Issues
  },
  data () {
    return {
      currentTab: 'issues'
    }
  },
  created () {
    this.fetchUserDetails()
  },
  methods: {
    ...mapActions({
      fetchUserDetails: 'fetchUserDetails'
    }),
    changeTab (tab) {
      this.currentTab = tab.name
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-tabs__item {
    user-select: none;
  }

  .pickers {
    padding: 15px 15px 10px;
  }
</style>
