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
import flatMap from 'lodash.flatmap'

export default {
  computed: {
    ...mapState({
      storeIssueComponents: state => state.filters.issueComponents
    }),
    ...mapGetters({
      getIssues: 'issues/getIssues'
    }),
    availableComponents () {
      const components = flatMap(this.getIssues, issue => issue.fields.components)
      return uniqBy(components, 'id')
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
