<template>
  <div id="app">
    <transition :name="slideDir" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    isUserAuth () {
      return this.$store.getters.isUserAuth
    },
    slideDir () {
      return this.isUserAuth ? 'slide-left' : 'slide-right'
    }
  }
}
</script>

<style lang="scss">
  @import "assets/sass/global";
</style>
