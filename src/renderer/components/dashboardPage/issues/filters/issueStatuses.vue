<template>
  <el-form-item label="Status">
    <el-checkbox-group v-model="selectedStatuses">
      <el-checkbox v-for="status in availableStatuses" :key="status" :label="status"/>
    </el-checkbox-group>
  </el-form-item>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      getIssues: 'issues/getIssues'
    }),
    ...mapState({
      storeStatuses: state => state.filters.statuses
    }),
    availableStatuses () {
      const statuses = this.getIssues.map(issue => issue.fields.status.name)
      return [...new Set(statuses)]
    },
    selectedStatuses: {
      get () {
        return this.storeStatuses
      },
      set (value) {
        this.setStatusesFilter(value)
      }
    }
  },
  methods: {
    ...mapMutations({
      setStatusesFilter: 'filters/setStatusesFilter'
    })
  }
}
</script>
