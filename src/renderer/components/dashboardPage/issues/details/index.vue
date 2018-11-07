<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      width="90vw"
      center
      :visible.sync="dialogVisible"
    >
      <info :issue="issue"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Info from './info'

export default {
  components: {
    Info
  },
  data () {
    return {
      dialogVisible: false,
      issue: null
    }
  },
  computed: {
    dialogTitle () {
      if (!this.issue) return ''
      return `${this.issue.key} - ${this.issue && this.issue.fields && this.issue.fields.summary}`
    }
  },
  methods: {
    openDialog (issue) {
      this.issue = issue
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
      this.issue = null
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/ .el-dialog__body {
    overflow-x: hidden;
  }
</style>
