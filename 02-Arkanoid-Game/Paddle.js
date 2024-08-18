const sprite = document.querySelector('#sprite')

export default class Paddle {
  constructor(game) {
    this.game = game

    this.width = 50
    this.height = 10
    this.x = (this.game.canvas.width - this.width) / 2
    this.y = this.game.canvas.height - this.height - 10
    this.sensitivity = 6

    this.rightPressed = false
    this.leftPressed = false

    document.addEventListener('keydown', (event) => this.keyDownHandler(event))
    document.addEventListener('keyup', (event) => this.keyUpHandler(event))
  }

  keyDownHandler(event) {
    const { key } = event

    if (key === 'Right' || key === 'ArrowRight' || key.toLowerCase() === 'd') {
      this.rightPressed = true
    } else if (
      key === 'Left' ||
      key === 'ArrowLeft' ||
      key.toLowerCase() === 'a'
    ) {
      this.leftPressed = true
    }
  }

  keyUpHandler(event) {
    const { key } = event

    if (key === 'Right' || key === 'ArrowRight' || key.toLowerCase() === 'd') {
      this.rightPressed = false
    } else if (
      key === 'Left' ||
      key === 'ArrowLeft' ||
      key.toLowerCase() === 'a'
    ) {
      this.leftPressed = false
    }
  }

  draw() {
    const { width, height, x, y } = this

    this.game.ctx.drawImage(sprite, 29, 174, width, height, x, y, width, height)
  }

  move() {
    const { sensitivity, width, game, rightPressed, leftPressed } = this

    if (rightPressed && this.x < game.canvas.width - width) {
      this.x += sensitivity
    } else if (leftPressed && this.x > 0) {
      this.x -= sensitivity
    }
  }
}
