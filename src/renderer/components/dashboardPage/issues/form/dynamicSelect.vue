<template>
  <div>
    <el-form-item :label="field.name" label-width="150px">
      <el-select
        v-model="val"
        filterable
        remote
        reserve-keyword
        placeholder="Please enter a keyword"
        :remote-method="fetchOptions"
        :loading="loading"
      >
        <el-option
          v-for="option in options"
          :key="option.id"
          :value="option.id"
          :label="option.name"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      options: [],
      loading: false,
      val: null
    }
  },
  methods: {
    fetchOptions (query) {
      const options = {
        uri: `${this.field.autoCompleteUrl}${query}`,
        method: 'GET',
        json: true,
        followAllRedirects: true
      }
      this.loading = true
      this.$jira.makeRequest(options).then(response => {
        console.log(response, 'response')
        this.options = response
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
