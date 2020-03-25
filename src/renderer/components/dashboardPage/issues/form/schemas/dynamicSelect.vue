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
          :key="optionName(option)"
          :value="optionName(option)"
          :label="optionName(option)"
        >
          <img class="icon" :src="option.avatarUrls['16x16']" alt="">
          {{ optionName(option) }}
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import service from '@/service'

export default {
  props: {
    field: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      options: [],
      loading: false
    }
  },
  computed: {
    optionName () {
      return option => option ? option.displayName || option.name : ''
    },
    inputValue: {
      get () {
        return this.optionName(this.value)
      },
      async set (value) {
        if (!value) this.$emit('input', {})
        else {
          service.getAutocompletion({ url: `${this.field.autoCompleteUrl}${value}` })
            .then(res => {
              if (res.length < 1) return this.$emit('input', {})
              const user = res.find(u => u.displayName === value || u.name === value)
              this.$emit('input', user || res[0])
            })
        }
      }
    }
  },
  methods: {
    fetchOptions (query) {
      this.loading = true
      service.getAutocompletion({
        url: `${this.field.autoCompleteUrl}${query}`
      }).then(response => {
        this.options = response
      }).finally(() => {
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
