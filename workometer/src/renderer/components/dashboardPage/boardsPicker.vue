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
  </div>
</template>

<script>
  import boardsPicker from './boardsPicker'

  export default {
    data () {
      return {
        selectedBoard: null
      }
    },
    components: {
      boardsPicker
    },
    created () {
      this.$store.dispatch('fetchBoards')
    },
    computed: {
      boards () {
        return this.$store.state.boards.boards
      }
    },
    watch: {
      selectedBoard (board) {
        this.$store.commit('SET_SELECTED_BOARD', board)
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>