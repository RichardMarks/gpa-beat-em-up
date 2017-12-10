import autoBind from './utils/autoBind'

import AnimationTrigger from './AnimationTrigger'

class Animation {
  constructor ({ name, frames, frameRate, loop }) {
    this._parent = undefined
    this._name = name

    if (frames) {
      if (typeof frames === 'number') {
        this._frames = [frames]
      } else if (Array.isArray(frames)) {
        this._frames = frames.slice()
      } else if (typeof frames === 'object' && frames.gen) {
        const genFrames = (first, last) => {
          const indices = [first]
          let i = first

          while (i < last) {
            i += 1
            indices.push(i)
          }
          return indices
        }

        if (Array.isArray(frames.gen) && frames.gen.length) {
          if (frames.gen.length === 1) {
            // generate frames from 0 to the first number
            this._frames = genFrames(0, frames.gen[0])
          } else {
            // generate frames between first and second numbers
            this._frames = genFrames(frames.gen[0], frames.gen[1])
          }
        } else if (typeof frames.gen === 'number') {
          // generate frames from 0 to the number
          this._frames = genFrames(0, frames.gen)
        } else {
          // generator is incorrect, use a single frame
          this._frames = [0]
        }
      } else if (typeof frames === 'function') {
        this._frames = frames()
      }
    } else {
      // use a single frame
      this._frames = [0]
    }

    if (!frameRate) {
      frameRate = 1
    }

    this._frameRate = 1.0 / frameRate
    this._frameCount = this._frames.length
    this._loop = loop
    this._triggers = []

    autoBind(this)
  }

  set parent (value) {
    this._parent = value
  }

  get name () {
    return this._name
  }

  get frames () {
    return this._frames
  }

  get frameRate () {
    return this._frameRate
  }

  get frameCount () {
    return this._frameCount
  }

  get loops () {
    return this._loop
  }

  get hasTriggers () {
    return this._triggers.length > 0
  }

  play (restartIfPlaying) {
    if (this._parent) {
      this._parent.play(this._name, restartIfPlaying)
    }
  }

  update (frame) {
    const count = this._triggers.length

    if (count >= 1) {
      for (let i = 0; i < count; i += 1) {
        const trigger = this._triggers[i]
        trigger.update(frame)
      }

      this._triggers = this._triggers.filter(trigger => !trigger.dirty)
    }
  }

  addTrigger ({ frame, save, cb }) {
    // console.log({ task: 'animation add trigger', frame, save, cb })
    const trigger = new AnimationTrigger({ frame, save, cb })
    this._triggers.push(trigger)
  }
}

export default Animation
