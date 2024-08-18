export default class Game {
  constructor() {
    this.canvas = document.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.canvas.width = 800
    this.canvas.height = 600
  }

  start() {
    const draw = () => {
      window.requestAnimationFrame(draw)
    }

    draw()
  }
}
