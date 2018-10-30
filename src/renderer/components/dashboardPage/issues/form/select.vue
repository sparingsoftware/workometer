<template>
  <div>
    <el-form-item :label="field.name" label-width="150px">
      <el-select
        v-model="asd"
        placeholder="field.name"
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
    }
  },
  data () {
    return {
      asd: null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
