<template>
  <div>
    <vue-context ref="menu">
      <ul slot-scope="child">
        <li @click="logWork(child.data)">Log Work</li>
      </ul>
    </vue-context>
    <log-work-dialog ref="logWorkDialog"/>
  </div>
</template>

<script>
import { VueContext } from 'vue-context'
import LogWorkDialog from './actions/logWorkDialog/'

export default {
  components: {
    VueContext,
    LogWorkDialog
  },
  props: {
    issue: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    logWork (issue) {
      this.$refs.logWorkDialog.logWork(issue)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
