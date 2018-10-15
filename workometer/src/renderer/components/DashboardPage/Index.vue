<template>
  <div>
    <p v-for="board in boards.values">
      {{ board.name }}
    </p>
    <el-button>Hello</el-button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        boards: {}
      }
    },
    mounted () {
      this.$jira.board.getAllBoards({type: 'scrum'}).then(response => {
        this.boards = response
      })
    }
  }
</script>

<style>

</style>
