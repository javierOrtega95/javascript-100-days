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

  move() {
    this.x += this.speedX
    this.y += this.speedY
  }
}
