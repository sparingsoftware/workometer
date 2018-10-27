<template>
  <el-form-item label="Components" label-width="100px">
    <el-select v-model="issueComponentsSelected" multiple placeholder="Select">
      <el-option
        v-for="component in availableComponents"
        :key="component.id"
        :label="component.name"
        :value="component.name"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import uniqBy from 'lodash.uniqby'
import { mapGetters, mapMutations, mapState } from 'vuex'
import flatten from 'lodash.flatten'

export default {
  computed: {
    ...mapState({
      storeIssueComponents: state => state.filters.issueComponents
    }),
    ...mapGetters({
      getIssues: 'issues/getIssues'
    }),
    availableComponents () {
      const components = this.getIssues
        .filter(issue => issue.fields.components.length)
        .map(issue => issue.fields.components)
      return uniqBy(flatten(components), 'id')
    },
    issueComponentsSelected: {
      get () {
        return this.storeIssueComponents
      },
      set (value) {
        this.setIssueComponentFilter(value)
      }
    }
  },
  methods: {
    ...mapMutations({
      setIssueComponentFilter: 'filters/setIssueComponentFilter'
    })
  }
}
</script>
