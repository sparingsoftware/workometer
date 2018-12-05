<template>
  <div>
    <el-form-item label="Sprint" label-width="150px">
      <el-select
        v-model="inputValue"
        placeholder="Sprint"
        autocomplete="off"
        clearable
      >
        <el-option
          v-for="option in allowedSprints"
          :key="option.id"
          :value="option.id"
          :label="option.name"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState({
      sprints: state => state.sprints.sprints
    }),
    allowedSprints () {
      return this.sprints.filter(sprint => sprint.name !== 'Backlog')
    },
    inputValue: {
      get () {
        return this.value && this.value.id
      },
      set (newValue) {
        this.$emit('input', {
          id: newValue
        })
      }
    }
  }
}
</script>
