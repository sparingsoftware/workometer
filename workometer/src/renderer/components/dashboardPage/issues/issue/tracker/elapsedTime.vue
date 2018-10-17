<template>
  <div>
    {{ elapsedTime }}
  </div>
</template>

<script>
import moment from 'moment'
import {mapState} from 'vuex'

export default {
  data () {
    return {
      elapsedTime: null,
      timer: null
    }
  },
  computed: {
    ...mapState({
      trackingStartTime: state => state.tracker.trackingStartTime
    })
  },
  created () {
    this.timer = setInterval(this.calculateElapsedTime, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
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
