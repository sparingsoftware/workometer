<template>
  <div class="view">
    <boards-picker/>
    <el-tabs v-model="currentTab" stretch @tab-click="changeTab">
      <el-tab-pane label="Issues" name="issues"/>
      <el-tab-pane label="Recent Worklogs" name="worklogs"/>
    </el-tabs>
    <issues v-if="currentTab === 'issues'"/>
    <recent-worklogs v-if="currentTab === 'worklogs'"/>
  </div>
</template>

<script>
import Issues from './issues/'
import RecentWorklogs from './recentWorklogs/'
import BoardsPicker from './boardsPicker/'

export default {
  components: {
    BoardsPicker,
    RecentWorklogs,
    Issues
  },
  data () {
    return {
      currentTab: 'issues'
    }
  },
  methods: {
    changeTab (tab, event) {
      this.currentTab = tab.name
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-tabs__item {
    user-select: none;
  }
</style>
