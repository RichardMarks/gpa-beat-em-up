import AnimationTrigger from './AnimationTrigger'

class AnimationSequence {
  constructor (name, animations, loop) {
    this._name = name
    this._animations = animations || []
    this._loop = loop
    this._animCount = this._animations.length
    this._triggers = []
    this._parent = undefined
  }

  set parent (value) {
    this._parent = value
  }

  get name () {
    return this._name
  }

  get animations () {
    return this._animations
  }

  get animCount () {
    return this._animCount
  }

  get loops () {
    return this._loop
  }

  get triggers () {
    return this._triggers
  }

  play (restartIfPlaying) {
    this._parent && this._parent.playSequence(this._name, restartIfPlaying)
  }

  addTrigger ({ frame, save, cb }) {
    const trigger = new AnimationTrigger({ frame, save, cb })
    this._triggers.push(trigger)
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
}

export default AnimationSequence
