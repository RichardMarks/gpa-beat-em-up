import autoBind from './utils/autoBind'

import { internal as LoadedAssets } from './Assets'
import AnimatedSprite from './AnimatedSprite'
import Actor from './Actor'
import Keys from './Keys'
import Input from './Input'
import Animations from './Animations'
import { GROUND } from './Constants'

class Player extends Actor {
  constructor () {
    super(0, 0, 0)

    const sprite = new AnimatedSprite(
      Animations.player.regions.map(region => LoadedAssets.images[region])
    )

    Object.keys(Animations.player.animations)
      .forEach(animationName => {
        const data = Animations.player.animations[animationName]
        sprite.addAnimation(animationName, data.frames, data.frameRate, data.loops)
      })

    sprite.playAnimation('idle')
    this._sprite = sprite

    this.image = this._sprite.image

    autoBind(this)
  }

  update (deltaTime) {
    this._lastDelta = deltaTime

    const {
      _sprite: sprite,
      stage
    } = this

    const minWalkY = stage.height - GROUND.MIN_Y
    const maxWalkY = stage.height - GROUND.MAX_Y

    const speed = 84
    let moving = false

    if (Input.keyboard.isPressed(Keys.KEY_RIGHT)) {
      this.x += speed * deltaTime
      moving = true
      sprite.scaleX = 1
      stage.camera.x -= speed * deltaTime
      if (stage.camera.x < 0) {
        stage.camera.x = 0
      }
    } else if (Input.keyboard.isPressed(Keys.KEY_LEFT)) {
      this.x -= speed * deltaTime
      moving = true
      sprite.scaleX = -1
      stage.camera.x += speed * deltaTime
    }

    if (Input.keyboard.isPressed(Keys.KEY_UP) && this.y + sprite.height > minWalkY) {
      this.y -= speed * deltaTime
      moving = true
    } else if (Input.keyboard.isPressed(Keys.KEY_DOWN) && this.y + sprite.height < maxWalkY) {
      this.y += speed * deltaTime
      moving = true
    }

    const animName = sprite.animation.name
    const facingRight = sprite.scaleX > 0

    if (moving) {
      if (animName === 'idle') {
        sprite.playAnimation('walk')
      } else if (animName === 'punch') {
        if (facingRight) {
          this.x -= speed * deltaTime
        } else {
          this.x += speed * deltaTime
        }
      } else if (animName === 'kick') {
        if (facingRight) {
          this.x -= speed * deltaTime
        } else {
          this.x += speed * deltaTime
        }
      }
    } else {
      if (animName === 'walk') {
        sprite.playAnimation('idle')
      } else if (animName === 'punch') {
        if (facingRight) {
          this.x += speed * 0.35 * deltaTime
        } else {
          this.x -= speed * 0.35 * deltaTime
        }
      } else if (animName === 'kick') {
        if (facingRight) {
          this.x -= speed * 0.4 * deltaTime
        } else {
          this.x += speed * 0.4 * deltaTime
        }
      }
    }

    if (Input.keyboard.wasPressed(Keys.KEY_Z)) {
      this.executePunchAttack()
    } else if (Input.keyboard.wasPressed(Keys.KEY_X)) {
      this.executeKickAttack()
    }

    sprite.x = this.x
    sprite.y = this.y

    sprite.update(deltaTime)
  }

  executePunchAttack () {
    const punchAnimFrames = Animations.player.animations.punch.frames
    this._sprite.addTrigger('punch', punchAnimFrames[punchAnimFrames.length - 1], false, this.completePunchAttack)
    this._sprite.playAnimation('punch', true)
  }

  completePunchAttack () {
    setTimeout(() => {
      if (this._sprite.scaleX > 0) {
        this.x -= 100 * this._lastDelta
      } else {
        this.x += 100 * this._lastDelta
      }

      this._sprite.playAnimation('idle')
    }, 0)
  }

  executeKickAttack () {
    const kickAnimFrames = Animations.player.animations.kick.frames
    this._sprite.addTrigger('kick', kickAnimFrames[kickAnimFrames.length - 1], false, this.completeKickAttack)
    this._sprite.playAnimation('kick', true)
  }

  completeKickAttack () {
    setTimeout(() => {
      if (this._sprite.scaleX > 0) {
        this.x -= 100 * this._lastDelta
      } else {
        this.x += 100 * this._lastDelta
      }

      this._sprite.playAnimation('idle')
    }, 0)
  }

  render (ctx) {
    const {
      _sprite: sprite,
      stage
    } = this

    const animName = sprite.animation.name
    const facingRight = sprite.scaleX > 0

    // center of sprite
    const cx = sprite.x + sprite.width * 0.5
    const cy = sprite.y + sprite.height * 0.5

    // X center of right hitbox
    const hcxr = cx + sprite.width * 0.25

    // X center of left hitbox
    const hcxl = cx - sprite.width * 0.25

    // Y center of punch and kick hitbox
    const punchHeight = cy - sprite.height * 0.25 * 0.35
    const kickHeight = cy

    const hitbox = {
      x: facingRight ? hcxr : hcxl,
      y: cy
    }

    if (animName === 'punch') {
      hitbox.width = 24
      hitbox.height = 24
      hitbox.y = punchHeight
    } else if (animName === 'kick') {
      hitbox.width = 24
      hitbox.height = 90
      hitbox.y = kickHeight
    }

    ctx.save()


    if (animName === 'punch' || animName === 'kick') {
      ctx.strokeStyle = 'red'
      ctx.strokeRect(
        hitbox.x - hitbox.width * 0.5,
        hitbox.y - hitbox.height * 0.5,
        hitbox.width,
        hitbox.height
      )
    } else if (animName === 'idle') {
      hitbox.x = facingRight ? cx - 10 : cx + 10
      hitbox.y = cy + 15
      hitbox.width = 40
      hitbox.height = 70

      ctx.strokeStyle = 'green'
      ctx.strokeRect(
        hitbox.x - hitbox.width * 0.5,
        hitbox.y - hitbox.height * 0.5,
        hitbox.width,
        hitbox.height
      )
    } else if (animName === 'walk') {
      hitbox.x = facingRight ? cx - 10 : cx + 10
      hitbox.y = cy
      hitbox.width = 50
      hitbox.height = 70

      ctx.strokeStyle = 'green'
      ctx.strokeRect(
        hitbox.x - hitbox.width * 0.5,
        hitbox.y - hitbox.height * 0.5,
        hitbox.width,
        hitbox.height
      )
    }

    ctx.strokeStyle = 'white'
    // ctx.strokeRect(0, sprite.y, stage.width, 1)
    // ctx.strokeRect(sprite.x, 0, 1, this.stage.height)
    ctx.fillStyle = 'white'
    ctx.fillRect(sprite.x - 4, sprite.y - 4, 8, 8)
    ctx.strokeRect(sprite.x, sprite.y, sprite.width, sprite.height)

    ctx.strokeStyle = 'orangered'
    ctx.strokeRect(0, cy, stage.width, 1)
    ctx.strokeStyle = 'blue'
    ctx.strokeRect(cx, 0, 1, stage.height)
    ctx.strokeStyle = 'cyan'
    ctx.strokeRect(hcxr, 0, 1, stage.height)
    ctx.strokeRect(hcxl, 0, 1, stage.height)
    ctx.strokeRect(hcxl, 0, 1, stage.height)

    ctx.restore()

    sprite.render(ctx)

  }
}

export default Player
