import Ball from './Ball.js'
import Brick from './Brick.js'
import Paddle from './Paddle.js'

export default class Game {
  constructor() {
    this.canvas = document.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.canvas.width = 800
    this.canvas.height = 600

    this.paddle = new Paddle(this)
    this.ball = new Ball(this)

    // brick settings
    this.brickRowCount = 8
    this.brickColumnCount = 24
    this.brickWidth = 32
    this.brickHeight = 16
    this.brickPadding = 0
    this.brickOffsetTop = 80
    this.brickOffsetLeft = 16

    this.bricks = []
    this.initBricks()
  }

  initBricks() {
    const {
      brickColumnCount,
      brickRowCount,
      brickPadding,
      brickOffsetTop,
      brickOffsetLeft,
      brickWidth,
      brickHeight,
    } = this

    for (let column = 0; column < brickColumnCount; column++) {
      this.bricks[column] = []

      for (let row = 0; row < brickRowCount; row++) {
        const brickX = column * (brickWidth + brickPadding) + brickOffsetLeft
        const brickY = row * (brickHeight + brickPadding) + brickOffsetTop
        const random = Math.floor(Math.random() * 8)

        this.bricks[column][row] = new Brick(
          this,
          brickX,
          brickY,
          brickWidth,
          brickHeight,
          random
        )
      }
    }
  }

  drawBricks() {
    const { brickColumnCount, brickRowCount, brickWidth } = this

    for (let column = 0; column < brickColumnCount; column++) {
      for (let row = 0; row < brickRowCount; row++) {
        const currentBrick = this.bricks[column][row]

        const clipX = currentBrick.color * brickWidth

        currentBrick.draw(clipX)
      }
    }
  }

  start() {
    const draw = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.paddle.draw()
      this.ball.draw()
      this.drawBricks()

      window.requestAnimationFrame(draw)
    }

    draw()
  }
}
