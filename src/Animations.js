const Animations = {
  player: {
    regions: [
      /* 0 */ 'enemyWalk1',
      /* 1 */ 'enemyWalk2',
      /* 2 */ 'enemyWalk3',
      /* 3 */ 'enemyWalk4',
      /* 4 */ 'enemyIdle1',
      /* 5 */ 'enemyIdle2',
      /* 6 */ 'enemyPunch',
      /* 7 */ 'enemyKick',
      /* 8 */ 'enemyHurt',
      /* 9 */ 'enemyDead'
    ],
    animations: {
      idle: { frames: [4, 5], frameRate: 20, loops: true },
      walk: { frames: [0, 1, 2, 3], frameRate: 10, loops: true },
      punch: { frames: [6], frameRate: 8, loops: false },
      kick: { frames: [7], frameRate: 8, loops: false },
      hurt: { frames: [2, 8], frameRate: 10, loops: false },
      dead: { frames: [5, 8, 8, 9, 9, 9, 9], frameRate: 10, loops: false }
    }
  },

  enemy: {
    regions: [
      /* 0 */ 'enemyWalk1',
      /* 1 */ 'enemyWalk2',
      /* 2 */ 'enemyWalk3',
      /* 3 */ 'enemyWalk4',
      /* 4 */ 'enemyIdle1',
      /* 5 */ 'enemyIdle2',
      /* 6 */ 'enemyPunch',
      /* 7 */ 'enemyKick',
      /* 8 */ 'enemyHurt',
      /* 9 */ 'enemyDead'
    ],
    animations: {
      idle: { frames: [4, 5], frameRate: 20, loops: true },
      walk: { frames: [0, 1, 2, 3], frameRate: 10, loops: true },
      punch: { frames: [2, 3, 4, 5, 6], frameRate: 8, loops: false },
      kick: { frames: [2, 3, 4, 5, 7], frameRate: 8, loops: false },
      hurt: { frames: [2, 8], frameRate: 10, loops: false },
      dead: { frames: [5, 8, 8, 9, 9, 9, 9], frameRate: 10, loops: false }
    }
  }
}

export default Animations
