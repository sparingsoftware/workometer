<template>
  <div>
    <el-dialog
      :title="dialogLabel"
      top="0"
      width="90vw"
      :visible.sync="dialogVisible"
    >
      <el-form :model="form">
        <perfect-scrollbar class="form-wrapper">
          <el-form-item v-if="!isSubtask" label="Type" label-width="150px">
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
          <sprint-field v-if="selectedIssueType" v-model="sprint"/>
        </perfect-scrollbar>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" :loading="$wait.is('issueCreating')" @click="submitForm">
          Confirm
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MultipleSelectInput from './schemas/multipleSelect'
import SelectInput from './schemas/select'
import StringInput from './schemas/string'
import ParentInput from './schemas/parent'
import DynamicSelectInput from './schemas/dynamicSelect'
import service from '@/service'
import SprintField from './sprintField'

import clone from 'lodash.clonedeep'

export default {
  components: {
    SprintField
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        issuetype: {}
      },
      sprint: null,
      meta: {},
      isSubtask: false,
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
      const hideParentIfSubtask = field => !this.isSubtask || field !== 'parent'
      return this.allowedFields
        .filter(hideParentIfSubtask)
        .map(field => this.selectedIssueType.fields[field])
        .filter(field => field)
    },
    selectedIssueType () {
      if (!this.form.issuetype.name || !this.meta.issuetypes) return
      return this.meta.issuetypes.find(type => type.name === this.form.issuetype.name)
    },
    dialogLabel () {
      if (!this.selectedProject) return ''
      return this.isSubtask
        ? `Add new subtask to '${this.form.parent.fields.summary}'`
        : `Add new issue to '${this.selectedProject.projectName}'`
    }
  },
  methods: {
    ...mapActions({
      refreshIssues: 'issues/refreshIssues',
      waitStart: 'wait/start',
      waitEnd: 'wait/end'
    }),
    async openDialog (issue = { issuetype: {} }) {
      await this.initForm(issue)

      // on edit issue
      issue.issuetype.name && (this.form.issuetype.name = issue.issuetype.name)
    },
    async openSubtaskDialog (parent, issue = { issuetype: { name: '' } }) {
      this.isSubtask = true
      issue = {
        ...issue,
        parent
      }
      await this.initForm(issue)
      const subtaskType = this.meta.issuetypes.find(type => type.subtask)
      this.form.issuetype.name = subtaskType && subtaskType.name
    },
    async initForm (issue) {
      if (!this.selectedProject) return
      this.form = clone(issue)
      await this.fetchMetadata()
      this.dialogVisible = true
    },
    async fetchMetadata () {
      return this.$jira.issue.getCreateMetadata({
        projectIds: this.selectedProject.projectId,
        expand: 'projects.issuetypes.fields'
      }).then(response => {
        this.meta = response.projects[0]
      })
    },
    submitForm () {
      this.waitStart('issueCreating')
      service.createIssue({
        projectKey: this.selectedProject.projectKey,
        form: this.form
      }).then(response => {
        return this.handleSprint(response.key)
      }).then(response => {
        this.finishSuccessResponse()
      }).catch(this.handleErrors)
        .finally(() => {
          this.waitEnd('issueCreating')
        })
    },
    handleSprint (issueKey) {
      const sprintId = this.sprint && this.sprint.id
      if (!sprintId) return
      return service.moveIssueToSprint({ issueKey, sprintId })
    },
    finishSuccessResponse () {
      this.$notify({
        title: 'Success',
        message: 'Issue added',
        type: 'success'
      })
      this.closeDialog()
      this.refreshIssues()
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
        issuelink: ParentInput,
        priority: SelectInput
      }
      return schemas[field.schema.type] || StringInput
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/ .el-dialog {
    top: 50%;
    transform: translateY(-50%);
  }

  .type-icon {
    vertical-align: middle;
  }

  .form-wrapper {
    max-height: calc(70vh - 124px);
    padding-right: 15px;
  }
</style>
