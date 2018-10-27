<template>
  <div>
    <el-dialog title="Add new issue" width="90vw" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="Summary">
          <el-input v-model="form.summary" placeholder="Title" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="Description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            placeholder="Description" 
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="Type">
          <el-select v-model="form.issue_type" placeholder="Type" autocomplete="off">
            <el-option
              v-for="status in statuses"
              :key="status.id"
              :value="status.id"
              :label="status.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Sprint">
          <el-select
            v-model="form.sprint"
            placeholder="Sprint"
            autocomplete="off"
            clearable
          >
            <el-option
              v-for="sprint in sprints"
              :key="sprint.id"
              :value="sprint.id"
              :label="sprint.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Components">
          <el-select v-model="form.component" placeholder="Components" autocomplete="off">
            <option value="a">Component</option>
          </el-select>
        </el-form-item>
        <el-form-item label="Epic">
          <el-select v-model="form.epic" placeholder="Epic" autocomplete="off">
            <option value="a">Epic 1</option>
          </el-select>
        </el-form-item>
        <el-form-item label="Assign to me">
          <el-checkbox v-model="form.assign_to_me"/>
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
import { mapState } from 'vuex'

export default {
  data () {
    return {
      dialogVisible: false,
      form: {}
    }
  },
  computed: {
    ...mapState({
      sprints: state => state.sprints.sprints,
      statuses: state => state.boards.statuses
    }),
    typess () {
      console.log(this.statuses)
      return []
    }
  },
  methods: {
    openIssueForm (issue = {}) {
      this.form = JSON.parse(JSON.stringify(issue))
      this.dialogVisible = true
    },
    submitForm () {
      this.$notify({
        title: 'Success',
        message: 'saved!',
        type: 'success'
      })
      this.closeDialog()
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>
