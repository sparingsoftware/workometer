<template>
  <div>
    <vue-context ref="menu">
      <ul slot-scope="child" class="actions">
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
  .v-context {
    border: 1px solid #e2e2e2 !important;
    outline: none !important;
  }
</style>
