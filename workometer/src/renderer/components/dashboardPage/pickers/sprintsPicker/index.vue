<template>
  <div class="sprints-picker">
    <el-select
      v-if="sprints.length > 0"
      v-model="selectedSprint"
      class="fluid"
      placeholder="Select sprint or backlog"
      clearable
      filterable
    >
      <el-option
        v-for="item in sprints"
        :key="item.id"
        :label="`${item.name}`"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      sprints: state => state.sprints.sprints,
      currentSprint: state => state.sprints.selectedSprint
    }),
    selectedSprint: {
      get () {
        return this.currentSprint
      },
      set (value) {
        this.setSelectedSprint(value)
      }
    }
  },
  methods: mapMutations({ setSelectedSprint: 'sprints/setSelectedSprint' })
}
</script>

<style lang="scss" scoped>
  .sprints-picker {
    margin-top: 7px;
  }
</style>
