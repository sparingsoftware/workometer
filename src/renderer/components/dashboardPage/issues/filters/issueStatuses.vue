<template>
  <el-form-item label="Status" label-width="100px">
    <el-checkbox-group v-model="selectedStatuses">
      <el-checkbox v-for="status in availableStatuses" :key="status" :label="status"/>
    </el-checkbox-group>
  </el-form-item>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      storeStatuses: state => state.filters.statuses
    }),
    ...mapGetters({
      getIssues: 'issues/getIssues'
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
