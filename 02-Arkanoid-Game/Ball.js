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

  move() {
    this.checkWallCollision()
    this.checkPaddleCollision()

    this.x += this.speedX
    this.y += this.speedY
  }
}
