<template>
  <div>
    <el-dialog :title="dialogLabel" width="90vw" :visible.sync="dialogVisible">
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
import { mapGetters, mapState } from 'vuex'
import MultipleSelectInput from './schemas/multipleSelect'
import SelectInput from './schemas/select'
import StringInput from './schemas/string'
import ParentInput from './schemas/parent'
import DynamicSelectInput from './schemas/dynamicSelect'
import service from '@/service'

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
    ...mapState({
      sprints: state => state.sprints.sprints
    }),
    fields () {
      if (!this.selectedIssueType) return []
      const allowedFields = this.allowedFields.map(field => this.selectedIssueType.fields[field])
      return allowedFields.filter(field => field)
    },
    selectedIssueType () {
      if (!this.form.issuetype.name) return
      return this.meta.issuetypes.find(type => type.name === this.form.issuetype.name)
    },
    dialogLabel () {
      return this.selectedProject
        ? `Add new issue to ${this.selectedProject.projectName}`
        : ''
    },
    sprintField () {
      return {
        key: 'sprint',
        name: 'Sprint',
        required: false,
        schema: {
          type: 'select'
        },
        allowedValues: this.sprints.filter(sprint => sprint.name !== 'Backlog')
      }
    }
  },
  methods: {
    openIssueForm (issue = { issuetype: {} }) {
      if (!this.selectedProject) return
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
      service.createIssue({
        projectKey: this.selectedProject.projectKey,
        form: this.form
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
        array: MultipleSelectInput,
        select: SelectInput,
        string: StringInput,
        user: DynamicSelectInput,
        issuelink: ParentInput
      }
      return schemas[field.schema.type] || StringInput
    }
  }
}
</script>
<style lang="scss" scoped>
  .type-icon {
    vertical-align: middle;
  }
</style>
