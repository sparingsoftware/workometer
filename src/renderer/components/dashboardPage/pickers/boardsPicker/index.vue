<template>
  <div class="boards-picker">
    <el-select
      v-model="selectedBoardId"
      class="fluid"
      placeholder="Select board"
      filterable
    >
      <el-option-group
        v-for="group in groupedBoards"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="item in group.boards"
          :key="item.id"
          :label="`${item.name} - ${item.location.name}`"
          :value="item.id"
        />
      </el-option-group>
    </el-select>
    <el-button
      title="Add to favourites"
      :disabled="!selectedBoardId"
      @click="toggleFavourite(selectedBoardId)"
    >
      <i :class="alreadyFavourite ? 'fa fa-star' : 'fa fa-star-o'"/>
    </el-button>
    <preloader-bar v-wait:visible="'boardsLoading'"/>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      boards: state => state.boards.boards,
      currentBoard: state => state.boards.selectedBoardId,
      favourites: state => state.boards.favourites
    }),
    selectedBoardId: {
      get () {
        return this.currentBoard
      },
      set (value) {
        this.clearFilters()
        this.setSelectedBoard(value)
      }
    },
    alreadyFavourite () {
      return this.favourites.includes(this.selectedBoardId)
    },
    groupedBoards () {
      const favourites = this.boards.filter(board => this.favourites.includes(board.id))
      const remaining = this.boards.filter(board => !this.favourites.includes(board.id))
      return [
        {
          label: 'Favourites',
          boards: favourites
        },
        {
          label: 'Boards',
          boards: remaining
        }
      ]
    }
  },
  watch: {
    selectedBoardId: {
      immediate: true,
      handler () {
        this.fetchSprints()
      }
    }
  },
  created () {
    this.fetchBoards()
  },
  methods: {
    ...mapActions({
      fetchBoards: 'boards/fetchBoards',
      fetchSprints: 'sprints/fetchSprints'
    }),
    ...mapMutations({
      setSelectedBoard: 'boards/setSelectedBoard',
      setSprints: 'sprints/setSprints',
      clearFilters: 'filters/clearFilters',
      toggleFavourite: 'boards/toggleFavourite'
    })
  }
}
</script>
<style lang="scss" scoped>
.boards-picker {
  position: relative;
  margin-bottom: 7px;
  display: flex;
  justify-content: space-between;
}
</style>
