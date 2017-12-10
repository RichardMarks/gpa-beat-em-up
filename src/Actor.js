import Entity from './Entity'

class Actor extends Entity {
  constructor (x, y, image) {
    super(x, y, image.width, image.height)

    this._image = image
    this._visible = true
    this._active = true
    this._timeElapsed = 0

    this.scaleX = 1
  }

  get visible () {
    return this._visible
  }

  set visible (value) {
    typeof value === 'boolean' && this._visible !== value && (this._visible = value)
  }

  get active () {
    return this._active
  }

  set active (value) {
    typeof value === 'boolean' && this._active !== value && (this._active = value)
  }

  get timeElapsed () {
    return this._timeElapsed
  }

  set timeElapsed (value) {
    typeof value === 'number' && this._timeElapsed !== value && (this._timeElapsed = value)
  }

  get image () {
    return this._image
  }

  set image (value) {
    typeof value === 'object' &&
      this._image !== value && (
        (this._image = value) &&
        (this.width = value.width) &&
        (this.height = value.height)
      )
  }

  update (deltaTime) {
    if (this._active) {
      this._timeElapsed += deltaTime
    }
  }

  render (ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    if (this.scaleX !== 1) {
      ctx.translate(-this.scaleX * this.width, 0)
      ctx.scale(this.scaleX, 1)
    }
    ctx.drawImage(this._image, 0, 0)
    ctx.restore()
  }
}

export default Actor
