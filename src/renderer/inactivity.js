import desktopIdle from 'desktop-idle'

const inactivityMonitor = {
  interval: null,
  idleTime: 0,

  start (inactivityTime, callback) {
    /*
    Starts tracking user's desktop inactivity.
    Calls `callback` when user becomes active again after at least
    `inactivityTime` of inactivity.
     */
    if (this.interval) {
      throw Error('There is already running monitor. Use stop() to stop it.')
    }
    this.interval = setInterval(
      () => {
        const measuredIdleTime = desktopIdle.getIdleTime()
        const userActiveAgain = measuredIdleTime < this.idleTime
        const userInactiveLongEnough = this.idleTime >= inactivityTime
        if (userActiveAgain && userInactiveLongEnough) {
          const time = this.idleTime
          this.stop()
          callback(time)
        } else {
          this.idleTime = measuredIdleTime
        }
      }, 1000 // check every second
    )
  },
  stop () {
    clearInterval(this.interval)
    this.interval = null
    this.idleTime = 0
  }
}

export default inactivityMonitor
