const internal = {
  listeners: [],
  paused: false
}

const Ticker = {
  get paused () {
    return internal.paused
  },

  set paused (value) {
    typeof value === 'boolean' && internal.paused !== value && (internal.paused = value)
  },

  onTick (listener) {
    typeof listener === 'function' && internal.listeners.push(listener)
  },

  start () {
    let lastTime = Date.now()

    const handleFrame = () => {
      const currentTime = Date.now()
      const deltaTime = (currentTime - lastTime) * 0.001

      lastTime = currentTime

      if (!internal.paused) {
        const listeners = internal.listeners
        const count = listeners.length

        for (let i = 0; i < count; i += 1) {
          const listener = listeners[i]

          listener && listener(deltaTime)
        }
      }

      window.requestAnimationFrame(handleFrame)
    }

    handleFrame()
  }
}

export default Ticker
