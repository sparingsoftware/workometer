<template>
  <div class="sprints-picker">
    <preloader-bar v-wait:visible="'sprintsLoading'"/>
    <transition name="el-fade-in">
      <el-select
        v-model="selectedSprintId"
        :disabled="!sprints.length"
        class="fluid"
        :placeholder="placeholder"
        clearable
        filterable
      >
        <el-option-group label="Sprints and Backlog">
          <el-option
            v-for="item in sprints"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-option-group>
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
      currentSprint: state => state.sprints.selectedSprintId
    }),
    placeholder () {
      return this.sprints.length
        ? 'Select sprint or backlog'
        : ''
    },
    selectedSprintId: {
      get () {
        return this.currentSprint
      },
      set (value) {
        this.setSelectedSprintId(value)
      }
    }
  },
  methods: mapMutations({ setSelectedSprintId: 'sprints/setSelectedSprintId' })
}
</script>

<style lang="scss" scoped>
  .sprints-picker {
    margin-top: 7px;
    position: relative;

    /deep/ .el-input__inner {
      height: auto !important;
    }
  }
</style>
