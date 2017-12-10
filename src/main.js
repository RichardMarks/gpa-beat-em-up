import Audio from './Audio'
import Assets, { internal as LoadedAssets } from './Assets'
import Stage from './Stage'
import Backdrop from './Backdrop'
import Ticker from './Ticker'
import AnimatedSprite from './AnimatedSprite'
import Player from './Player'

const create = () => {
  console.log({ task: 'create' })

  LoadedAssets.audio.alleyAtmosphere.volume = 0.5
  // LoadedAssets.audio.alleyAtmosphere.loop()
  setTimeout(() => {

    // LoadedAssets.audio.alleyBGM.loop()
  }, 4000)

  const stage = new Stage(640, 400)

  Object.assign(stage.canvas.style, {
    imageRendering: 'pixelated',
    width: '1200px',
    height: '800px',
    border: '1px solid white'
  })

  stage.backgroundColor = 'black'

  const bg = new Backdrop(LoadedAssets.images.alleyScene)

  stage.addChild(bg)

  // area in which player and enemies may walk
  const GROUND_MIN_Y = stage.height - 130
  const GROUND_MAX_Y = stage.height - 10

  // const enemy = {
  //   x: 0,
  //   y: 0,
  //   left: 0,
  //   top: 0,
  //   right: 128,
  //   bottom: 128,
  //   visible: true,
  //   active: true,
  //   image: LoadedAssets.images.enemyIdle1,
  //   update (deltaTime) {

  //   },
  //   render (ctx) {
  //     // console.log({ task: 'draw enemy' })
  //     ctx.save()
  //     ctx.translate(128, 0)
  //     ctx.scale(-1, 1)
  //     ctx.drawImage(enemy.image, 0, 0, 128, 128, enemy.x, enemy.y, 128, 128)
  //     ctx.strokeStyle = 'red'
  //     ctx.strokeRect(0, 0, 128, 128)
  //     ctx.restore()


  //     // debugging the walkable area
  //     // ctx.fillStyle = 'red'
  //     // ctx.fillRect(0, GROUND_MIN_Y, stage.width, 1)
  //     // ctx.fillRect(0, GROUND_MAX_Y, stage.width, 1)
  //   }
  // }

  // const player = new AnimatedSprite([
  //   LoadedAssets.images.enemyIdle1,
  //   LoadedAssets.images.enemyIdle2
  // ])

  // player.x = 50
  // player.y = GROUND_MIN_Y - (player.height - 32)

  // player.addAnimation('idle', { gen: 1 }, 20, true)
  // player.playAnimation('idle')

  const player = new Player()
  player.x = 50
  player.y = GROUND_MIN_Y - (player.height - 32)
  stage.addChild(player)

  const enemy = new AnimatedSprite([
    /* 0 */ LoadedAssets.images.enemyWalk1,
    /* 1 */ LoadedAssets.images.enemyWalk2,
    /* 2 */ LoadedAssets.images.enemyWalk3,
    /* 3 */ LoadedAssets.images.enemyWalk4,

    /* 4 */ LoadedAssets.images.enemyIdle1,
    /* 5 */ LoadedAssets.images.enemyIdle2,
    /* 6 */ LoadedAssets.images.enemyPunch,
    /* 7 */ LoadedAssets.images.enemyKick,
    /* 8 */ LoadedAssets.images.enemyHurt,
    /* 9 */ LoadedAssets.images.enemyDead
  ])

  enemy.x = 350
  enemy.y = GROUND_MAX_Y - (enemy.height )

  enemy.scaleX = -1

  enemy.addAnimation('idle', [4, 5], 20, true)
  enemy.addAnimation('walk', [0, 1, 2, 3], 10, true)
  enemy.addAnimation('punch', [2, 3, 4, 5, 6], 8, false)
  enemy.addAnimation('kick', [2, 3, 4, 5, 7], 8, false)
  enemy.addAnimation('hurt', [2, 8], 10, true)
  enemy.addAnimation('dead', [5, 8, 8, 9, 9, 9, 9], 10, false)

  enemy.addSequence('pk', ['punch', 'dead', 'punch', 'kick', 'punch'], true)

  // enemy.playAnimation('kick')
  enemy.playSequence('pk', true)

  enemy.state = 'walk-left'

  const enemyUpdate = enemy.update.bind(enemy)
  enemy.update = deltaTime => {
    enemyUpdate()
    if (enemy.state === 'walk-left') {
      enemy.x -= 52 * deltaTime
      if (enemy.x < player.x) {
        enemy.state = 'walk-right'
        enemy.scaleX = 1
      }
    } else {
      enemy.x += 52 * deltaTime
      if (enemy.x > stage.width * 0.85) {
        enemy.state = 'walk-left'
        enemy.scaleX = -1
      }
    }
  }

  stage.addChild(enemy)

  const onTick = deltaTime => {
    stage.update(deltaTime)
    stage.render()
  }

  Ticker.onTick(onTick)
  Ticker.start()
}

const boot = () => {
  console.log({ task: 'boot' })

  document.body.style.background = 'black'

  window.assets = {
    api: Assets,
    loaded: LoadedAssets
  }

  Audio.init()

  Assets.load({
    alleyAtmosphere: 'assets/audio/urban-atmosphere-1.ogg',
    alleyBGM: 'assets/audio/urban-bgm-1.ogg',
    alleyScene: 'assets/images/scene.png',
    enemyIdle1: 'assets/images/enemy/idle/enemy_idle0001.png',
    enemyIdle2: 'assets/images/enemy/idle/enemy_idle0002.png',

    enemyWalk1: 'assets/images/enemy/walk/enemy_walk0001.png',
    enemyWalk2: 'assets/images/enemy/walk/enemy_walk0007.png',
    enemyWalk3: 'assets/images/enemy/walk/enemy_walk0013.png',
    enemyWalk4: 'assets/images/enemy/walk/enemy_walk0019.png',

    enemyPunch: 'assets/images/enemy/punch/enemy_punch0002.png',

    enemyKick: 'assets/images/enemy/kick/enemy_kick0002.png',

    enemyHurt: 'assets/images/enemy/hurt/enemy_hurt0002.png',

    enemyDead: 'assets/images/enemy/dead/enemy_dead0002.png'
  }).then(create)

}

document.addEventListener('DOMContentLoaded', boot, false)
