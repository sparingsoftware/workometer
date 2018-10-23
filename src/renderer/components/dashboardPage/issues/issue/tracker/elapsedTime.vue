<template>
  <div>
    {{ formattedElapsedTime }}
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      trackingStartTime: state => state.tracker.trackingStartTime,
      elapsedTime: state => state.tracker.elapsedTime
    }),
    formattedElapsedTime () {
      return this.elapsedTime && this.elapsedTime.format('HH:mm:ss')
    }
  },
  created () {
    const timerId = setInterval(this.calculateElapsedTime, 1000)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timerId)
    })
  },
  methods: {
    ...mapMutations({
      setElapsedTime: 'tracker/setElapsedTime'
    }),
    calculateElapsedTime () {
      this.setElapsedTime(moment.utc(moment().diff(this.trackingStartTime)))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
