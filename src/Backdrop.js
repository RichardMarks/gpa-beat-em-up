import Actor from './Actor'

class Backdrop extends Actor {
  constructor (image, scroll) {
    super(0, 0, image)

    this._scroll = scroll || 0
  }

  get scroll () {
    return this._scroll
  }

  set scroll (value) {
    typeof value === 'number' && this._scroll !== value && (this._scroll = value)
  }

  update (deltaTime) {
    super.update(deltaTime)

    if (this.active) {
      this.x -= this._scroll * deltaTime

      if (this.x < -this.width) {
        this.x = 0
      }
    }
  }

  render (ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.drawImage(this.image, 0, 0)
    if (this.x < 0) {
      ctx.translate(this.width, 0)
      ctx.drawImage(this.image, 0, 0)
    }
    ctx.restore()
  }
}

export default Backdrop
