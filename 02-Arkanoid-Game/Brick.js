export const BRICK_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0,
}

const bricks = document.querySelector('#bricks')

export default class Brick {
  constructor(game, x, y, width, height, color) {
    this.game = game

    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.status = BRICK_STATUS.ACTIVE
    this.color = color
  }

  draw(clipX) {
    this.game.ctx.drawImage(
      bricks,
      clipX,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
}
