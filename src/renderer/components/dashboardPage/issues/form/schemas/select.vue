<template>
  <div>
    <el-form-item :label="field.name" label-width="150px">
      <el-select
        v-model="inputValue"
        :placeholder="field.name"
        autocomplete="off"
        clearable
      >
        <el-option
          v-for="option in field.allowedValues"
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
        console.log('aaa')
        this.$emit('input', newValue)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
