const internal = {
  audioContext: undefined,
  masterGain: undefined,
  initialized: undefined,
  masterVolume: 1
}

class Sound {
  constructor (src, buffer) {
    const gain = internal.audioContext.createGain()
    gain.connect(internal.masterGain)

    let muteVolume = 1
    let muted = false
    let stopped = false
    let volume = 1
    let source = undefined

    gain.gain.value = volume

    this.mute = () => {
      if (!muted) {
        muted = true
        muteVolume = gain.gain.value
        gain.gain.value = 0
      }
    }

    this.unmute = () => {
      if (muted) {
        gain.gain.value = muteVolume
        muted = false
      }
    }

    Object.defineProperty(this, 'volume', {
      get () {
        return volume
      },
      set (value) {
        if (typeof value === 'number') {
          value = value < 0 ? 0 : value
          value = value > 1 ? 1 : value
          if (volume !== value) {
            volume = value
            gain.gain.value = volume
          }
        }
      },
      enumerable: false,
      configurable: false
    })

    const playAudio = ({ loopAudio = false }) => {
      source = internal.audioContext.createBufferSource()
      source.buffer = buffer
      source.loop = loopAudio
      source.connect(gain)
      source.start(0)
      stopped = false
    }

    this.play = () => playAudio({ loopAudio: false })
    this.loop = () => playAudio({ loopAudio: true })
    this.stop = () => {
      if (!stopped) {
        stopped = true
        source.stop(0)
        source.disconnect(gain)
      }
    }
  }
}

const Audio = {
  init () {
    if (!internal.initialized) {
      window.AudioContext = window.AudioContext || window.webkitAudioContext

      internal.audioContext = new window.AudioContext()

      internal.masterGain = internal.audioContext.createGain()
      internal.masterGain.value = internal.masterVolume
      internal.masterGain.connect(internal.audioContext.destination)

      internal.initialized = true
    }
  },

  get volume () {
    return internal.masterVolume
  },

  set volume (value) {
    if (typeof value === 'number') {
      value = value < 0 ? 0 : value
      value = value > 1 ? 1 : value
      if (internal.masterVolume !== value) {
        internal.masterVolume = value
        internal.masterGain.value = internal.masterVolume
      }
    }
  },

  createSound (src, buffer) {
    return internal.initialized ? new Sound(src, buffer) : undefined
  },

  decodeAudioData (data, onDecoded) {
    internal.initialized && internal.audioContext.decodeAudioData(data, onDecoded)
  }
}

export default Audio
