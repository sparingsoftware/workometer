<template>
  <div>
    <boards-picker/>
    <el-tabs v-model="currentTab" @tab-click="changeTab" stretch>
      <el-tab-pane label="Recent Worklogs" name="worklogs"/>
      <el-tab-pane label="Issues" name="issues"/>
    </el-tabs>
    <recent-worklogs v-if="currentTab === 'worklogs'"/>
    <issues v-if="currentTab === 'issues'"/>
  </div>
</template>

<script>
  import issues from './issues'
  import recentWorklogs from './recentWorklogs/'
  import boardsPicker from './boardsPicker'

  export default {
    components: {
      boardsPicker,
      issues,
      recentWorklogs
    },
    methods: {
      changeTab (tab, event) {
        this.currentTab = tab.name
      }
    },
    data () {
      return {
        currentTab: 'worklogs'
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-tabs__item {
    user-select: none;
  }
</style>
