<template>
  <div>
    <el-select
      v-model="selectedBoard"
      class="fluid"
      placeholder="Select board"
      filterable
    >
      <el-option
        v-for="item in boards"
        :key="item.id"
        :label="`${item.name} - ${item.location.name}`"
        :value="item.id"
      />
    </el-select>
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
import { mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      selectedBoard: null,
      selectedSprint: null,
      sprints: []
    }
  },
  computed: {
    boards () {
      return this.$store.state.boards.boards
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
  },
  created () {
    this.fetchBoards()
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
  }
}
</script>
<style lang="scss" scoped>

</style>
