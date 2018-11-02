<template>
  <div>
    <el-dialog :title="`Add new issue to ${selectedProject.projectName}`" width="90vw" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="Type" label-width="150px">
          <el-select v-model="form.issuetype.name" placeholder="Type" autocomplete="off">
            <el-option
              v-for="type in meta.issuetypes"
              :key="type.name"
              :value="type.name"
              :label="type.name"
            >
              <img class="type-icon" :src="type.iconUrl" alt=""> {{ type.name }}
            </el-option>
          </el-select>
        </el-form-item>
        {{ form }}
        <component
          :is="getComponentForField(field)"
          v-for="field in fields"
          :key="field.key"
          v-model="form[field.key]"
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
import Select from './schemas/select'
import String from './schemas/string'
import DynamicSelect from './schemas/dynamicSelect'

export default {
  data () {
    return {
      dialogVisible: false,
      form: {
        issuetype: {}
      },
      meta: {},
      allowedFields: [
        'summary', 'assignee', 'components', 'description', 'fixVersions', 'issuelinks', 'labels',
        'priority', 'reporter'
      ]
    }
  },
  computed: {
    ...mapState({
      sprints: state => state.sprints.sprints,
      statuses: state => state.boards.statuses,
      selectedBoard: state => state.boards.selectedBoard
    }),
    ...mapGetters({
      selectedProject: 'boards/selectedProject'
    }),
    fields () {
      if (!this.form.issuetype.name) return []
      const selectedIssueType = this.meta.issuetypes.find(type => type.name === this.form.issuetype.name)
      console.log(selectedIssueType.fields)
      const allowedFields = this.allowedFields.map(field => selectedIssueType.fields[field])
      return allowedFields.filter(field => field)
    }
  },
  methods: {
    openIssueForm (issue = { issuetype: {} }) {
      this.$jira.issue.getCreateMetadata({
        projectIds: this.selectedProject.projectId,
        expand: 'projects.issuetypes.fields'
      }).then(response => {
        this.meta = response.projects[0]
      })
      this.form = JSON.parse(JSON.stringify(issue))
      this.dialogVisible = true
    },
    submitForm () {
      this.$jira.issue.createIssue({
        fields: {
          ...this.form,
          project: {
            key: this.selectedProject.projectKey
          }
        }
      }).then(response => {
        this.$notify({
          title: 'Success',
          message: 'Issue added',
          type: 'success'
        })
        this.closeDialog()
      }).catch(this.handleErrors)
    },
    closeDialog () {
      this.dialogVisible = false
    },
    getComponentForField (field) {
      /*
      * TODO: parent field for subtasks
      * sprint selecting
      * epics
      *      * Creating a sub-task is similar to creating a regular issue, with two important differences:
     *
     * * the issueType field must correspond to a sub-task issue type (you can use /issue/createmeta to discover
     * sub-task issue types), and
     * * you must provide a parent field in the issue create request containing the id or key of the parent issue.
      * */
      const schemas = {
        array: Select,
        string: String,
        user: DynamicSelect
      }
      return schemas[field.schema.type] || String
    }
  }
}
</script>
<style lang="scss" scoped>
  .type-icon {
    vertical-align: middle;
  }
</style>
