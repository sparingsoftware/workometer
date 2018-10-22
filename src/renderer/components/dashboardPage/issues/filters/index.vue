<template>
  <div>
    <el-dialog title="Set filters" :visible.sync="dialogVisible" width="80vw">
      <el-form>
        <el-form-item label="Status">
          <el-checkbox-group v-model="selectedStatuses">
            <el-checkbox v-for="status in availableStatuses" :key="status" :label="status"/>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Task type">
          <el-checkbox-group v-model="taskTypesSelected">
            <el-checkbox v-for="task in availableTaskTypes" :key="task" :label="task"/>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="submitForm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  data () {
    return {
      dialogVisible: false
    }
  },
  computed: {
    ...mapState({
      storeStatuses: state => state.filters.statuses,
      storeTaskTypes: state => state.filters.taskTypes
    }),
    ...mapGetters({
      getIssues: 'issues/getIssues'
    }),
    availableStatuses () {
      const statuses = this.getIssues.map(issue => issue.fields.status.name)
      return [...new Set(statuses)]
    },
    availableTaskTypes () {
      const types = this.getIssues.map(issue => issue.fields.issuetype.name)
      return [...new Set(types)]
    },
    selectedStatuses: {
      get () {
        return this.storeStatuses
      },
      set (value) {
        this.setStatusesFilter(value)
      }
    },
    taskTypesSelected: {
      get () {
        return this.storeTaskTypes
      },
      set (value) {
        this.setTaskTypeFilter(value)
      }
    }
  },
  methods: {
    ...mapMutations({
      setStatusesFilter: 'filters/setStatusesFilter',
      setTaskTypeFilter: 'filters/setTaskTypeFilter'
    }),
    openFiltersDialog () {
      this.dialogVisible = true
    },
    submitForm () {
      this.closeDialog()
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
