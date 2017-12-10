import autoBind from './utils/autoBind'

import {
  KEY_OSX_COMMAND,
  KEY_CTRL,
  KEY_SHIFT
} from './Keys'

const PASS_THROUGH = [
  KEY_OSX_COMMAND,
  KEY_CTRL,
  KEY_SHIFT
]

class Keyboard {
  constructor () {
    this._keys = {}
    this._keysPressed = {}

    autoBind(this)

    window.addEventListener('keydown', event => {
      const { keyCode } = event
      PASS_THROUGH.includes(keyCode) || event.preventDefault()
      this.onKeyPressed(keyCode)
    }, true)

    window.addEventListener('keyup', event => {
      const { keyCode } = event
      PASS_THROUGH.includes(keyCode) || event.preventDefault()
      this.onKeyReleased(keyCode)
    }, true)
  }

  onKeyPressed (keyCode) {
    this._keys[keyCode] = true
  }

  onKeyReleased (keyCode) {
    delete this._keys[keyCode]
  }

  isPressed (keyCode) {
    return !!this._keys[keyCode]
  }

  wasPressed (keyCode) {
    if (this._keys[keyCode] && !this._keysPressed[keyCode]) {
      this._keysPressed[keyCode] = true
      return false
    } else if (!this._keys[keyCode] && this._keysPressed[keyCode]) {
      this._keysPressed[keyCode] = false
      return true
    }

    return false
  }
}

export default Keyboard
