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
          <sprint-field v-if="selectedIssueType && !isIssueEditing" v-model="sprint"/>
        </perfect-scrollbar>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button
          v-if="!isIssueEditing"
          type="primary"
          :loading="$wait.is('issueCreating')"
          @click="submitForm"
          v-text="'Submit'"
        />
        <el-button
          v-if="isIssueEditing"
          :loading="$wait.is('issueUpdating')"
          @click="updateForm"
          v-text="'Update'"
        />
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
      let title = ''
      if (this.isSubtask) {
        title = `Add new subtask to '${this.form.parent.fields.summary}'`
      } else if (this.isIssueEditing) {
        title = `Edit issue in '${this.selectedProject.projectName}'`
      } else if (this.selectedProject) {
        title = `Add new issue to '${this.selectedProject.projectName}'`
      }

      return title
    },
    isIssueEditing () {
      return this.editingIssue.id
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
      this.isSubtask = true
      issue = {
        ...issue,
        parent
      }
      await this.initForm(issue)
      const subtaskType = this.meta.issuetypes.find(type => type.subtask)
      this.form.issuetype.name = subtaskType && subtaskType.name
    },
    async editIssue (issue) {
      this.editingIssue = issue
      this.form = clone({ issuetype: {} })
      this.form.issuetype.name = issue.fields.issuetype.name
      await this.fetchMetadata()
      const filtredIssueFields = await this.filterIssueData(issue.fields)
      this.form = filtredIssueFields
      this.dialogVisible = true
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
    async filterIssueData (issue) {
      const fields = this.fields.map(field => field.key)
      fields.push('issuetype')

      return Object.keys(issue)
        .filter(key => fields.some(field => field === key))
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: issue[key]
          }
        }, {})
    },
    submitForm () {
      this.waitStart('issueCreating')
      service.createIssue({
        projectKey: this.selectedProject.projectKey,
        form: this.form
      }).then(response => {
        return this.handleSprint(response.key)
      }).then(() => {
        this.finishSuccessResponse()
      }).catch(this.handleErrors)
        .finally(() => {
          this.waitEnd('issueCreating')
        })
    },
    updateForm () {
      this.waitStart('issueUpdating')
      console.log('updateForm issue', this.form)
      service.editIssue({
        form: this.form,
        issueId: this.editingIssue.id
      }).then(response => {
        return this.handleSprint(response.key)
      }).then(() => {
        this.finishSuccessResponse()
      }).catch(this.handleErrors)
        .finally(() => {
          this.waitEnd('issueUpdating')
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
      console.log(field.name, ', schema:', field.schema.type)
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
