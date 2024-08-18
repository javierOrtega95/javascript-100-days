const sprite = document.querySelector('#sprite')

export default class Paddle {
  constructor(game) {
    this.game = game

    this.width = 50
    this.height = 10
    this.x = (this.game.canvas.width - this.width) / 2
    this.y = this.game.canvas.height - this.height - 10
  }

  draw() {
    const { width, height, x, y } = this

    this.game.ctx.drawImage(sprite, 29, 174, width, height, x, y, width, height)
  }
}
