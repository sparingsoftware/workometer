<template>
  <div>
    <el-form-item :label="field.name" label-width="150px">
      <el-input v-model="val" :placeholder="field.name"/>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      val: null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
