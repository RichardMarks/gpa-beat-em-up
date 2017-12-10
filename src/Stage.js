import depthSort from './utils/depthSort'
import autoBind from './utils/autoBind'

class Stage {
  constructor (width, height, containerDiv) {
    window.stage = this

    this._width = width
    this._height = height

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    if (containerDiv) {
      if (typeof containerDiv === 'object') {
        containerDiv.appendChild(canvas)
      } else {
        document.querySelector(containerDiv).appendChild(canvas)
      }
    } else {
      document.body.appendChild(canvas)
    }

    this._canvas = canvas
    this._ctx = canvas.getContext('2d')

    this._children = []
    this._added = []
    this._removed = []

    this._camera = {
      x: 0,
      y: 0
    }

    autoBind(this)
  }

  get camera () {
    return this._camera
  }

  set camera (value) {
    throw new Error('Stage.camera is read-only and cannot be changed.')
  }

  set backgroundColor (color) {
    color && this._backgroundColor !== color && (this._backgroundColor = color)
    !color && (this._backgroundColor = undefined)
    this.render()
  }

  get width () {
    return this._width
  }

  get height () {
    return this._height
  }

  get canvas () {
    return this._canvas
  }

  get children () {
    return this._children.slice()
  }

  addChild (child) {
    if (child) {
      this._added.push(child)
    }
  }

  removeChild (child) {
    if (child) {
      this._removed.push(child)
    }
  }

  update (deltaTime) {
    const {
      _added: added,
      _removed: removed,
      _children: children
    } = this

    let count = added.length

    for (let i = 0; i < count; i += 1) {
      const child = added[i]

      if (removed.indexOf(child) === -1) {
        children.push(child)
        child.stage = this
        child.added && child.added()
      }
    }

    added.length = 0

    count = removed.length

    for (let i = 0; i < count; i += 1) {
      const child = removed[i]
      const index = children.indexOf(child)

      index >= 0 && children.splice(index, 1)
      delete child.stage
      child.removed && child.removed()
    }

    removed.length = 0

    count = children.length
    for (let i = 0; i < count; i += 1) {
      const child = children[i]

      // if child exists and
      child &&
      // child is active and
      child.active &&
      // child has an update method and
      child.update && typeof child.update === 'function' &&
      // call the child's update method
      child.update(deltaTime)
    }
  }

  render () {
    const {
      _ctx: ctx,
      _children: children,
      _width: width,
      _height: height,
      _backgroundColor: bgColor
    } = this

    if (bgColor) {
      const oldFillStyle = ctx.fillStyle
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = oldFillStyle
    }

    depthSort(children)


    ctx.translate(this._camera.x, this._camera.y)

    const count = children.length

    for (let i = 0; i < count; i += 1) {
      const child = children[i]

      // if child exists and
      child &&
      // child is visible and
      child.visible &&
      // child is not transparent and
      child.alpha !== 0 &&
      // child has a render method and
      child.render && typeof child.render === 'function' &&
      // call the child's render method
      child.render(ctx)
    }

    ctx.translate(-this._camera.x, -this._camera.y)
  }
}

export default Stage
