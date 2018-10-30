<template>
  <div>
    <el-dialog title="Add new issue" width="90vw" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="Type" label-width="150px">
          <el-select v-model="form.issue_type" placeholder="Type" autocomplete="off">
            <el-option
              v-for="type in meta.issuetypes"
              :key="type.id"
              :value="type.id"
              :label="type.name"
            >
              <img class="type-icon" :src="type.iconUrl" alt=""> {{ type.name }}
            </el-option>
          </el-select>
        </el-form-item>
        <component
          :is="getComponentForField(field)"
          v-for="field in fields"
          :key="field.key"
          :field="field"
        />
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="submitForm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Select from './select'
import String from './string'
import DynamicSelect from './dynamicSelect'

export default {
  data () {
    return {
      dialogVisible: false,
      form: {},
      meta: {},
      allowedFields: [
        'summary', 'assignee', 'components', 'description', 'fixVersions', 'issuelinks', 'labels',
        'priority', 'reporter'
      ]
      //  project & issuetype would be default
    }
  },
  computed: {
    ...mapState({
      sprints: state => state.sprints.sprints,
      statuses: state => state.boards.statuses,
      selectedBoard: state => state.boards.selectedBoard
    }),
    ...mapGetters({
      selectedProjectId: 'boards/selectedProjectId'
    }),
    fields () {
      if (!this.form.issue_type) return []
      const selectedIssueType = this.meta.issuetypes.find(type => type.id === this.form.issue_type)
      const allowedFields = this.allowedFields.map(field => selectedIssueType.fields[field])
      return allowedFields.filter(field => field)
    }
  },
  methods: {
    openIssueForm (issue = {}) {
      this.$jira.issue.getCreateMetadata({
        projectIds: this.selectedProjectId,
        expand: 'projects.issuetypes.fields'
      }).then(response => {
        this.meta = response.projects[0]
      })
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
    },
    getComponentForField (field) {
      /*
      * TODO: parent field for subtasks
      * default values selecting (for projects and issue type)
      * sprint selecting
      * epics
      * */
      if (field.allowedValues !== undefined) {
        return Select
      } else if (field.autoCompleteUrl) {
        return DynamicSelect
      }
      return String
    }
  }
}
</script>
<style lang="scss" scoped>
  .type-icon {
    vertical-align: middle;
  }
</style>
