import { BRICK_STATUS } from './Brick.js'

export default class Ball {
  constructor(game) {
    this.game = game

    this.radius = 3
    this.x = this.game.canvas.width / 2
    this.y = this.game.canvas.height - 30
    this.speedY = -3
    this.speedX = -3
    this.color = '#fff'
  }

  draw() {
    this.game.ctx.beginPath()
    this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    this.game.ctx.fillStyle = this.color
    this.game.ctx.fill()
    this.game.ctx.closePath()
  }

  checkWallCollision() {
    const { x, y, speedX, speedY, game, radius } = this

    // right wall
    if (x + radius + speedX > game.canvas.width) {
      this.speedX = -speedX
    }

    // left wall
    if (x - radius + speedX < 0) {
      this.speedX = -speedX
    }

    // top wall
    if (y - radius + speedY < 0) {
      this.speedY = -speedY
    }
  }

  checkPaddleCollision() {
    const { x, y, radius } = this
    const { paddle } = this.game

    // check if the ball is within the horizontal bounds of the paddle
    const withinPaddleWidth = x > paddle.x && x < paddle.x + paddle.width
    const touchingPaddleTop = y + radius >= paddle.y

    if (withinPaddleWidth && touchingPaddleTop) {
      this.speedY = -this.speedY
      // adjust the position to prevent the ball from sticking to the paddle
      this.y = paddle.y - radius
    }
  }

  checkBrickCollision() {
    const { x, y, radius } = this
    const { bricks } = this.game

    for (let column = 0; column < bricks.length; column++) {
      for (let row = 0; row < bricks[column].length; row++) {
        const brick = bricks[column][row]

        if (brick.status === BRICK_STATUS.DESTROYED) continue

        // Check if the ball is within the horizontal bounds of the brick
        const withinBrickWidth =
          x + radius > brick.x && x - radius < brick.x + brick.width

        // Check if the ball is within the vertical bounds of the brick
        const withinBrickHeight =
          y + radius > brick.y && y - radius < brick.y + brick.height

        if (withinBrickWidth && withinBrickHeight) {
          this.speedY = -this.speedY
          brick.status = BRICK_STATUS.DESTROYED
          this.game.score += 10
        }
      }
    }
  }

  checkGameOver() {
    const { y, radius } = this
    const { canvas } = this.game

    if (y + radius > canvas.height) {
      this.game.gameOver()
    }
  }

  move() {
    this.checkWallCollision()
    this.checkPaddleCollision()
    this.checkBrickCollision()

    this.checkGameOver()

    this.x += this.speedX
    this.y += this.speedY
  }
}
