<template>
  <div>
    <issue v-for="issue in issues" :key="issue.id" :issue="issue"/>
  </div>
</template>

<script>
  import issue from './issue/'

  export default {
    methods: {
      fetchIssues () {
        const boardId = this.$store.state.boards.selectedBoard
        this.$store.dispatch('fetchIssues', boardId)
      }
    },
    watch: {
      selectedBoard (board) {
        this.fetchIssues()
      }
    },
    components: {
      issue
    },
    computed: {
      selectedBoard () {
        return this.$store.state.boards.selectedBoard
      },
      issues () {
        return this.$store.state.issues.issuesForBoard[this.selectedBoard]
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>