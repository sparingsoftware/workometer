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
