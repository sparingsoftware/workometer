<template>
  <div class="preloader-bar" :class="{'preloader-bar--main': main}"/>
</template>

<script>
export default {
  props: {
    main: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .preloader-bar {
    z-index: 1;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(270deg, #107d96, #a2eeff, #409EFF);
    background-size: 600% 600%;

    &--main {
      height: 7px;
      position: fixed;
    }

    animation: AnimationName 3s ease infinite;

    @keyframes AnimationName {
      0% {
        background-position: 0% 50%
      }
      50% {
        background-position: 100% 50%
      }
      100% {
        background-position: 0% 50%
      }
    }
  }
</style>
