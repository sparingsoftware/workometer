<template>
  <div class="container">
    <div class="description">
      <p class="description__title">Tracked issue:</p>
      <p class="description__summary">{{ issueTracked.fields.summary }}</p>
    </div>
    <tracker class="elapsed-time" :issue="issueTracked"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Tracker from '@/components/dashboardPage/issues/issue/tracker/'

export default {
  components: {
    Tracker
  },
  computed: {
    ...mapState({
      issueTracked: state => state.tracker.issueTracked
    })
  }
}
</script>

<style lang="scss" scoped>
  .container {
    position: fixed;
    z-index: 10;
    width: 100%;
    padding: 4px 15px;
    margin-bottom: 11px;
    background-color: #333333;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .description {
    padding: 0;
    margin: 0;

    &__summary {
      margin: 0;
    }

    &__title {
      margin: 0;
      text-transform: uppercase;
      font-size: 12px;
    }
  }
</style>
