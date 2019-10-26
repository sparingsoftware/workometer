<template>
  <header class="title-container" style="-webkit-app-region: drag">
    <h1 v-text="'workometer'"/>
  </header>
</template>

<style lang="scss" scoped>
  .title-container {
    display: flex;
    justify-content: center;
    padding-top: 15px;
    cursor: default;
    user-select: none;
  }
</style>
