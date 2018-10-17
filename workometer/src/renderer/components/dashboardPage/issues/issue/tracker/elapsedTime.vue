<template>
  <div>
    {{ elapsedTime }}
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      elapsedTime: null
    }
  },
  computed: mapState({
    trackingStartTime: state => state.tracker.trackingStartTime
  }),
  created () {
    const timerId = setInterval(this.calculateElapsedTime, 1000)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timerId)
    })
  },
  methods: {
    calculateElapsedTime () {
      this.elapsedTime = moment.utc(moment().diff(this.trackingStartTime)).format('HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
