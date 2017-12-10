import id from './utils/id'

class Entity {
  constructor (x, y, width, height) {
    this._id = id(4)
    this._x = x
    this._y = y
    this._width = width
    this._height = height
    this._tags = []
  }

  get id () {
    return this._id
  }

  set id (value) {
    throw new Error(`Entity.id (${this._id}) is read-only and cannot be changed.`)
  }

  get x () {
    return this._x
  }

  set x (value) {
    typeof value === 'number' && this._x !== value && (this._x = value)
  }

  get y () {
    return this._y
  }

  set y (value) {
    typeof value === 'number' && this._y !== value && (this._y = value)
  }

  get width () {
    return this._width
  }

  set width (value) {
    typeof value === 'number' && this._width !== value && (this._width = value)
  }

  get height () {
    return this._height
  }

  set height (value) {
    typeof value === 'number' && this._height !== value && (this._height = value)
  }

  get tags () {
    return this._tags
  }

  set tags (value) {
    typeof tags === 'object' && tags.hasOwnProperty('length') && (this._tags = value)
  }

  get left () {
    return this._x
  }

  set left (value) {
    this.x = value
  }

  get top () {
    return this._y
  }

  set top (value) {
    this.y = value
  }

  get right () {
    return this._x + this._width
  }

  set right (value) {
    this.x = value - this._width
  }

  get bottom () {
    return this._y + this._height
  }

  set bottom (value) {
    this.y = value - this._height
  }

  added () {}

  removed () {}
}

export default Entity
