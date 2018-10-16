<template>
  <div>
    <el-select class="fluid" v-model="selectedBoard" filterable placeholder="Select board">
      <el-option
        v-for="item in boards"
        :key="item.id"
        :label="`${item.name} - ${item.location.name}`"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <el-select
      class="fluid"
      clearable
      v-if="sprints.length > 0"
      v-model="selectedSprint" filterable placeholder="Select sprint or backlog"
    >
      <el-option
        v-for="item in sprints"
        :key="item.id"
        :label="`${item.name}`"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      selectedBoard: null,
      selectedSprint: null,
      sprints: []
    }
  },
  created () {
    this.fetchBoards()
  },
  computed: {
    boards () {
      return this.$store.state.boards.boards
    }
  },
  methods: {
    ...mapActions({ fetchBoards: 'boards/fetchBoards' }),
    ...mapMutations({
      setSelectedSprint: 'boards/setSelectedSprint',
      setSelectedBoard: 'boards/setSelectedBoard'
    }),
    fetchSprints () {
      const backlog = { name: 'Backlog', id: null }
      this.setSelectedSprint(null)
      this.$jira.board.getSprintsForBoard({ boardId: this.selectedBoard })
        .then(response => {
          // TODO: handle pagination
          this.sprints = [backlog, ...response.values.filter(sprint => sprint.state === 'active')]
        })
    }
  },
  watch: {
    selectedBoard (board) {
      this.setSelectedBoard(board)
      this.fetchSprints()
    },
    selectedSprint (sprintId) {
      this.setSelectedSprint(sprintId)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
