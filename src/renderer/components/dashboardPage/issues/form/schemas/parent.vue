<template>
  <div>
    <el-form-item :label="field.key" label-width="150px">
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
          :key="option.key"
          :value="option.key"
          :label="option.summaryText"
        >
          <img class="icon" :src="`https://${host}/${option.img}`" alt="">
          <strong>{{ option.key }} - </strong>
          {{ option.summaryText }}
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    field: {
      type: Object,
      default: () => {
      }
    },
    allFields: {
      type: Object,
      default: () => {}
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
        return this.value && this.value.key
      },
      set (newValue) {
        this.$emit('input', {
          key: newValue
        })
      }
    },
    autoCompleteUrl () {
      return this.allFields.issuelinks.autoCompleteUrl
    },
    ...mapState({
      host: state => state.login.host
    })
  },
  methods: {
    fetchOptions (query) {
      const options = {
        uri: `${this.autoCompleteUrl}${query}`,
        method: 'GET',
        json: true,
        followAllRedirects: true
      }
      this.loading = true
      this.$jira.makeRequest(options).then(response => {
        this.options = response.sections[0].issues
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
