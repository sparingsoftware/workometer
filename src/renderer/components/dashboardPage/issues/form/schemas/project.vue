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
          :key="option.key"
          :value="option.key"
          :label="option.name"
        >
          <img class="icon" :src="option.avatarUrls['16x16']" alt="">
          {{ option.name }}
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
      default: () => ({})
    },
    value: {
      type: Object,
      default: () => ({})
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .icon {
    max-height: 65%;
    vertical-align: middle;
    margin-right: 3px;
  }
</style>
