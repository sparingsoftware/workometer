<template>
  <div class="sprints-picker">
    <transition name="el-fade-in">
      <el-select
        v-model="selectedSprint"
        :disabled="!sprints.length"
        class="fluid"
        :placeholder="placeholder"
        clearable
        filterable
      >
        <el-option
          v-for="item in sprints"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </transition>
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
    placeholder () {
      return this.sprints.length
        ? 'Select sprint or backlog'
        : ''
    },
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
