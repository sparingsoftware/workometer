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
          <sprint-field v-if="selectedIssueType && !isIssueEditing && !isSubtask" v-model="sprint"/>
        </perfect-scrollbar>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-checkbox
          v-if="!isIssueEditing"
          v-model="createAnother"
          class="dialog-footer__checkbox"
        >
          Create another
        </el-checkbox>
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button
          type="primary"
          :loading="$wait.is('formSubmitting')"
          @click="submitForm"
          v-text="'Submit'"
        />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import pick from 'lodash.pick'
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
      createAnother: false,
      sprint: null,
      meta: {},
      isSubtask: false,
      editingIssue: {},
      allowedFields: [
        'parent', 'summary', 'assignee', 'components', 'description', 'fixVersions', 'labels',
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
      const hideParentIfSubtask = field => !this.isSubtask || (field !== 'parent')
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
      if (this.isSubtask && !this.isIssueEditing) {
        return `Add new subtask to '${this.form.parent.fields.summary}'`
      } else if (this.isIssueEditing) {
        return `Edit issue in '${this.selectedProject.projectName}'`
      } else if (this.selectedProject) {
        return `Add new issue to '${this.selectedProject.projectName}'`
      }
    },
    isIssueEditing () {
      return Object.keys(this.editingIssue).length !== 0
    }
  },
  methods: {
    ...mapActions({
      refreshIssues: 'issues/refreshIssues',
      waitStart: 'wait/start',
      waitEnd: 'wait/end'
    }),
    openDialog (issue = { issuetype: {} }) {
      this.initForm(issue)
    },
    async openSubtaskDialog (parent, issue = { issuetype: { name: '' } }) {
      issue = {
        ...issue,
        parent
      }
      await this.initForm(issue)
      this.isSubtask = true
      const subtaskType = this.meta.issuetypes.find(type => type.subtask)
      this.form.issuetype.name = subtaskType && subtaskType.name
    },
    async editIssue (issue) {
      this.editingIssue = issue
      await this.fetchMetadata()
      this.isSubtask = issue.fields.issuetype.subtask
      if (!this.isSubtask) {
        this.meta.issuetypes = this.meta.issuetypes.filter(issuetype => !issuetype.subtask)
      }

      this.form.issuetype = { name: issue.fields.issuetype.name }
      const filtredFields = this.filterIssueData(issue.fields)
      const form = clone(filtredFields)
      this.form = {
        ...form,
        issuetype: {
          name: issue.fields.issuetype.name
        }
      }

      this.dialogVisible = true
    },
    async initForm (issue) {
      if (!this.selectedProject) return
      this.clearData()
      this.form = clone(issue)
      await this.fetchMetadata()
      this.dialogVisible = true
    },
    clearData () {
      this.isSubtask = false
      this.editingIssue = {}
    },
    async fetchMetadata () {
      return this.$jira.issue.getCreateMetadata({
        projectIds: this.selectedProject.projectId,
        expand: 'projects.issuetypes.fields'
      }).then(response => {
        this.meta = response.projects[0]
      })
    },
    filterIssueData (issue) {
      const fields = this.fields.map(field => field.key)
      return pick(issue, fields)
    },
    submitForm () {
      this.waitStart('formSubmitting')
      const formService = this.isIssueEditing
        ? service.editIssue({
          form: this.form,
          issueId: this.editingIssue.id
        })
        : service.createIssue({
          projectKey: this.selectedProject.projectKey,
          form: this.form
        })

      formService.then(response => {
        return this.handleSprint(response.key)
      }).then(() => {
        this.finishSuccessResponse()
      }).catch(this.handleErrors)
        .finally(() => {
          this.waitEnd('formSubmitting')
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
        message: 'Issue saved',
        type: 'success'
      })
      if (this.createAnother) {
        this.openDialog({
          ...this.form,
          summary: '',
          description: ''
        })
        this.$el.querySelector('.form-wrapper').scrollTop = 0
      } else {
        this.closeDialog()
      }
      this.refreshIssues()
    },
    closeDialog () {
      this.dialogVisible = false
      this.createAnother = false
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

  .dialog-footer {
    &__checkbox {
      margin-right: 15px;
    }
  }
</style>
