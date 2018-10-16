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
        this.$store.dispatch('fetchIssues')
      }
    },
    watch: {
      selectedSprint () {
        this.fetchIssues()
      },
      selectedBoard () {
        this.fetchIssues()
      }
    },
    components: {
      issue
    },
    computed: {
      selectedSprint () {
        return this.$store.state.boards.selectedSprint
      },
      selectedBoard () {
        return this.$store.state.boards.selectedBoard
      },
      issues () {
        return this.selectedSprint
          ? this.$store.state.issues.issuesForSprint[this.selectedSprint]
          : this.$store.state.issues.issuesForBoard[this.selectedBoard]
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
