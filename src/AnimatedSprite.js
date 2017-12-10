import Actor from './Actor'
import Animation from './Animation'
import AnimationTrigger from './AnimationTrigger'
import AnimationSequence from './AnimationSequence'

class AnimatedSprite extends Actor {
  constructor (regions) {
    super(0, 0, regions[0])

    this._timer = 0
    this._index = 0
    this._frame = 0
    this._animation = undefined
    this._animations = {}

    this._regions = regions
    this._textureRegion = this._regions[this._frame]

    this._frameChanged = false
    this._sequences = {}
    this._sequence = undefined
    this._sequenceIndex = 0
    this._sequenceFrame = 0
    this._updateFunc = this.updateSequenceBasic.bind(this)

    this.rate = 1
    this.animationEnded = undefined
    this.scope = undefined
    this.complete = true

  }

  get animation () {
    return this._animation
  }

  set completionTrigger (value) {
    typeof value === 'function' && (this.animationEnded = value)
  }

  update (deltaTime) {
    super.update(deltaTime)

    if (this._sequence) {
      this._updateFunc && this._updateFunc()
    } else {
      this.updateAnimation()
    }
  }

  updateBuffer () {
    if (this._frame !== undefined && this._regions) {
      if (this._frame >= this._regions.length) {
        this._frame = this._regions.length - 1
      }

      this._textureRegion = this._regions[this._frame]
      // console.log({ task: 'updateBuffer', textureRegion: this._textureRegion })
      // console.log(this._frame)
      this.image = this._textureRegion
    }
  }

  updateAnimation () {
    if (this._animation && !this.complete) {
      this._timer += this._animation.frameRate * this.rate

      if (this._timer >= 1) {
        while (this._timer >= 1) {
          this._timer -= 1
          this._index += 1

          if (this._index >= this._animation.frameCount) {
            if (this._animation.loops) {
              this._index = 0
              this.animationEnded && this.animationEnded(this.scope)
            } else {
              this._index = this._animation.frameCount - 1
              this.complete = true
              this.animationEnded && this.animationEnded(this.scope)
              break
            }
          }
        }

        if (this._animation) {
          this._frame = this._animation.frames[this._index]
          if (this._animation.hasTriggers) {
            this._animation.update(this._frame)
          }
        }

        this.updateBuffer()
      }
    }
  }

  updateSequenceBasic () {
    this.updateSequence()
    this.playAnimation(this._sequence.animations[this._sequenceIndex])
    this.updateAnimation()
  }

  updateSequenceAdvanced () {
    if (this.complete || this._frameChanged) {
      this._sequenceFrame += 1
      this._sequence.update(this._sequenceFrame)
    }

    this.updateSequence()

    if (!this._sequence) {
      return
    }

    this.playAnimation(this._sequence.animations[this._sequenceFrame])
    let frame = 1 + this._frame
    frame -= 1
    this.updateAnimation()
    this._frameChanged = (frame !== this._frame)
  }

  updateSequence () {
    if (this.complete) {
      this._sequenceIndex += 1

      if (this._sequenceIndex >= this._sequence.animations.length) {
        if (this._sequence.loops) {
          this._sequenceIndex = 0
          this._sequenceFrame = 0
        } else {
          this._sequenceIndex -= 1
        }
      }
    }
  }

  play (name, restartIfPlaying, keepSequence) {
    if (keepSequence) {
      this._sequence = undefined
    }

    if (!restartIfPlaying) {
      if (this._animation) {
        if (this._animation.name === name) {
          return this._animation
        }
      }
    }

    this._animation = this._animations[name]
    if (!this._animation) {
      this._frame = 0
      this._index = 0
      this.complete = true
      this.updateBuffer()
      return undefined
    }

    this._index = 0
    this._timer = 0
    this._frame = this._animation.frames[0]
    this.complete = false
    this.updateBuffer()

    return this._animation
  }

  playAnimation (name, restartIfPlaying) {
    this.play(name, restartIfPlaying)
  }

  playSequence (name, restartIfPlaying) {
    if (!restartIfPlaying) {
      if (this._sequence) {
        if (this._sequence.name === name) {
          return this._sequence
        }
      }
    }

    this._sequence = this._sequences[name]
    this._sequenceIndex = 0
    this._sequenceFrame = 0

    if (!this._sequence) {
      return undefined
    }

    this.playAnimation(this._sequence.animations[this._sequenceIndex], restartIfPlaying)

    return this._sequence
  }

  addAnimation (name, frames, frameRate, loop) {
    this._animations[name] = new Animation({ name, frames, frameRate, loop })
    this._animations[name].parent = this
    return this._animations[name]
  }

  addSequence (name, animations, loop) {
    const count = animations.length

    for (let i = 0; i < count; i += 1) {
      if (!this._animations[animations[i]]) {
        console.log({ task: 'add seq fail', i })
        return undefined
      }
    }

    if (count > 1) {
      this._sequences[name] = new AnimationSequence(name, animations, loop)
      this._sequences[name].parent = this
    } else {
      const animation = new Animation(this._animations[animations[0]])

      this.addAnimation(`${name}HACK`,animation.frames, animation.frameRate, false)
      animations[`${name}HACK`] = animation
      this._sequences[name] = new AnimationSequence(name, animations, loop)
      this._sequences[name].parent = this
    }

    // console.log({ task: 'add seq', seq: this._sequences[name] })
    return this._sequences[name]
  }

  addTrigger (name, frame, save, cb) {
    if (this._sequences[name]) {
      this._sequences[name].addTrigger({ frame, save, cb })
      this._updateFunc = this.updateSequenceAdvanced.bind(this)
      return
    }

    if (this._animations[name]) {
      this._animations[name].addTrigger({ frame, save, cb })
    } else {
      throw new Error(`Unable to add trigger to animation ${name} no animation with that name was found`)
    }
  }

  get sequenceName () {
    if (this._sequence) {
      return this._sequence.name
    } else {
      return undefined
    }
  }
}

export default AnimatedSprite
