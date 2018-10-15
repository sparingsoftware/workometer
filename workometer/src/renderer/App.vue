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
  /* CSS */
  // slide left right animation
  .slide-right-leave-active,
  .slide-right-enter-active,
  .slide-left-leave-active,
  .slide-left-enter-active {
    transition: transform 0.3s;
  }

  .slide-right-enter {
    transform: translate(-100vw, 0);
  }

  .slide-right-leave-to {
    transform: translate(100vw, 0);
  }

  .slide-left-enter {
    transform: translate(100vw, 0);
  }

  .slide-left-leave-to {
    transform: translate(-100vw, 0);
  }
</style>
