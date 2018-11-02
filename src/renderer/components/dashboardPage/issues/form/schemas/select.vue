<template>
  <div>
    <el-form-item :label="field.name" label-width="150px">
      <el-select
        v-model="inputValue"
        :placeholder="field.name"
        autocomplete="off"
        multiple
        clearable
      >
        <el-option
          v-for="option in field.allowedValues"
          :key="option.name"
          :value="option.name"
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
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    inputValue: {
      get () {
        return this.value && this.value.map(value => value.name)
      },
      set (newValues) {
        this.$emit('input', newValues.map(value => ({
          name: value
        })))
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
