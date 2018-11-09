<template>
  <transition name="el-fade">
    <div class="container">
      <div class="icon">
        <i class="el-icon-warning"/>
      </div>
      <div class="text">
        <h1>Nothing was found.</h1>
        <p>There's no results for you query.</p>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
  .container {
    padding: 15px;
  }

  .icon {
    display: inline-block;
    font-size: 36px;
    vertical-align: middle;
    color: #e6a23c;
    margin-right: 20px;
  }

  .text {
    display: inline-block;
    vertical-align: middle;
    & p {
      margin: 0;
    }
  }
</style>
