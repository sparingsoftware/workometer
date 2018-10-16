<template>
  <div>
    <el-select class="fluid" v-model="selectedBoard" filterable placeholder="Select board">
      <el-option
        v-for="item in boards"
        :key="item.id"
        :label="`${item.name} - ${item.location.name}`"
        :value="item.id">
      </el-option>
    </el-select>
    <el-select class="fluid"
               clearable
               v-if="sprints.length > 0"
               v-model="selectedSprint" filterable placeholder="Select sprint or backlog">
      <el-option
        v-for="item in sprints"
        :key="item.id"
        :label="`${item.name}`"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        selectedBoard: null,
        selectedSprint: null,
        sprints: []
      }
    },
    created () {
      this.$store.dispatch('fetchBoards')
    },
    computed: {
      boards () {
        return this.$store.state.boards.boards
      }
    },
    methods: {
      fetchSprints () {
        const backlog = {name: 'Backlog', id: null}
        this.$store.commit('SET_SELECTED_SPRINT', null)
        this.$jira.board.getSprintsForBoard({boardId: this.selectedBoard})
          .then(response => {
            // TODO: handle pagination
            this.sprints = [backlog, ...response.values.filter(sprint => sprint.state === 'active')]
          })
      }
    },
    watch: {
      selectedBoard (board) {
        this.$store.commit('SET_SELECTED_BOARD', board)
        this.fetchSprints()
      },
      selectedSprint (sprintId) {
        this.$store.commit('SET_SELECTED_SPRINT', sprintId)
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
