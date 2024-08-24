import Ball from './Ball.js'
import Brick, { BRICK_STATUS } from './Brick.js'
import Paddle from './Paddle.js'

export default class Game {
  constructor() {
    this.canvas = document.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.canvas.width = 448
    this.canvas.height = 400

    this.fps = 60

    this.isGameOver = false
    this.isGameWon = false

    this.paddle = new Paddle(this)
    this.ball = new Ball(this)

    // brick settings
    this.brickRowCount = 6
    this.brickColumnCount = 13
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
        const brick = this.bricks[column][row]

        if (brick.status === BRICK_STATUS.DESTROYED) continue

        const clipX = brick.color * brickWidth

        brick.draw(clipX)
      }
    }
  }

  checkWinner() {
    const allBricksDestroyed = this.bricks.every((column) =>
      column.every((brick) => brick.status === BRICK_STATUS.DESTROYED)
    )

    if (allBricksDestroyed && !this.isGameWon) {
      this.isGameWon = true
      alert('Congratulations! You won!')
      document.location.reload()
    }
  }

  gameOver() {
    if (!this.isGameOver) {
      this.isGameOver = true
      alert('Game Over! You lost.')
      document.location.reload()
    }
  }

  start() {
    let lastFrameTime = window.performance.now()
    const timePerFrame = 1000 / this.fps

    const draw = () => {
      if (this.isGameOver || this.isGameWon) return

      window.requestAnimationFrame(draw)

      const currentTime = window.performance.now()
      const elapsedTime = currentTime - lastFrameTime

      if (elapsedTime < timePerFrame) return

      const excessTime = elapsedTime % timePerFrame
      lastFrameTime = currentTime - excessTime

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.paddle.draw()
      this.ball.draw()
      this.drawBricks()

      this.paddle.move()
      this.ball.move()

      this.checkWinner()
    }

    draw()
  }
}
