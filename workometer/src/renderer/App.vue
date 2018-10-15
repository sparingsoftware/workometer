<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    created () {
      this.setJiraConnectorCredentialsFromStore()
    },
    methods: {
      setJiraConnectorCredentialsFromStore () {
        this.$jira.basic_auth = this.$store.state.login.basic_auth
      }
    }
  }
</script>

<style>
  /* CSS */
</style>
