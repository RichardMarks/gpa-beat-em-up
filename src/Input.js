import Keyboard from './Keyboard'

const internal = {
  keyboard: undefined
}

const Input = {
  get keyboard () {
    !internal.keyboard && (internal.keyboard = new Keyboard())
    return internal.keyboard
  },

  set keyboard (value) {
    throw new Error('Input.keyboard is read-only and cannot be changed.')
  }
}

export default Input
export { internal }
