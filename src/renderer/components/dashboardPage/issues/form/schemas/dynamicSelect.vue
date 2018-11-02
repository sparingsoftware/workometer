<template>
  <div>
    <el-form-item :label="field.name" label-width="150px">
      <el-select
        v-model="inputValue"
        filterable
        remote
        clearable
        reserve-keyword
        placeholder="Please enter a keyword"
        :remote-method="fetchOptions"
        :loading="loading"
      >
        <el-option
          v-for="option in options"
          :key="option.name"
          :value="option.name"
          :label="option.displayName || option.name"
        >
          <img class="icon" :src="option.avatarUrls['16x16']" alt="">
          {{ option.displayName || option.name }}
        </el-option>
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
    },
    value: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      options: [],
      loading: false
    }
  },
  computed: {
    inputValue: {
      get () {
        return this.value && this.value.name
      },
      set (newValue) {
        this.$emit('input', {
          name: newValue
        })
      }
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
        this.options = response
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .icon {
    max-height: 65%;
    vertical-align: middle;
    margin-right: 3px;
    max-width: 20px;
  }
</style>
