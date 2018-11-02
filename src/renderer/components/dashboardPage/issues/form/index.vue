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
        <component
          :is="getComponentForField(field)"
          v-for="field in fields"
          :key="field.key"
          v-model="form[field.key]"
          :field="field"
          :all-fields="selectedIssueType.fields"
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
import { mapGetters } from 'vuex'
import Select from './schemas/select'
import String from './schemas/string'
import Parent from './schemas/parent'
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
        'parent', 'summary', 'assignee', 'components', 'description', 'fixVersions', 'issuelinks', 'labels',
        'priority', 'reporter'
      ]
    }
  },
  computed: {
    ...mapGetters({
      selectedProject: 'boards/selectedProject'
    }),
    fields () {
      if (!this.selectedIssueType) return []
      const allowedFields = this.allowedFields.map(field => this.selectedIssueType.fields[field])
      return allowedFields.filter(field => field)
    },
    selectedIssueType () {
      if (!this.form.issuetype.name) return
      return this.meta.issuetypes.find(type => type.name === this.form.issuetype.name)
    }
  },
  methods: {
    openIssueForm (issue = { issuetype: {} }) {
      this.fetchMetadata()
      this.form = JSON.parse(JSON.stringify(issue))
      this.dialogVisible = true
    },
    fetchMetadata () {
      this.$jira.issue.getCreateMetadata({
        projectIds: this.selectedProject.projectId,
        expand: 'projects.issuetypes.fields'
      }).then(response => {
        this.meta = response.projects[0]
      })
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
      const schemas = {
        array: Select,
        string: String,
        user: DynamicSelect,
        issuelink: Parent
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
