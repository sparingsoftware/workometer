<template>
  <div>
    <el-input
      v-model="filterQuery"
      clearable
      placeholder="Search for key or summary"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"/>
    </el-input>
  </div>
</template>

<script>
export default {
  computed: {
    filterQuery: {
      get () {
        return this.$store.state.filters.query
      },
      set (query) {
        this.$store.commit('filters/setFilterQuery', query)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
