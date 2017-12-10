class AnimationTrigger {
  constructor ({ frame, save, cb }) {
    if (typeof cb === 'function') {
      this._callbackFunc = cb
    } else {
      this._callbackFunc = undefined
    }

    this._frame = frame
    this._save = save
    this._dirty = false
  }

  get callbackFunc () {
    return this._callbackFunc
  }

  get frame () {
    return this._frame
  }

  get persistent () {
    return this._save
  }

  get dirty () {
    return this._dirty
  }

  update (frame) {
    // console.log({ task: 'trigger update', frame, triggerFrame: this._frame })
    if (this._callbackFunc && frame === this._frame) {
      this._callbackFunc()
      if (this._save) {
        this._dirty = false
      } else {
        this._dirty = true
      }
    }
  }
}

export default AnimationTrigger
