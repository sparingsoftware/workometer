<template>
  <div>
    <el-form-item :label="field.name" label-width="150px">
      <el-input v-model="inputValue" :placeholder="field.name"/>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      default: () => {}
    },
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    inputValue: {
      get () {
        return this.value
      },
      set (newValue) {
        this.$emit('input', newValue)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
