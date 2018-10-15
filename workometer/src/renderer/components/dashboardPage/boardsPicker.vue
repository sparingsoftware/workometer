<template>
  <div>
    <el-select class="fluid" v-model="selectedBoard" filterable placeholder="Select board">
      <el-option
        v-for="item in boards"
        :key="item.id"
        :label="item.name"
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
    }
  }
</script>
<style lang="scss" scoped>

</style>