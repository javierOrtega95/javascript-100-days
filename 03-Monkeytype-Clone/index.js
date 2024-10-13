import { words as INITIAL_WORDS } from './data.js'
const $time = document.querySelector('time')
const $paragraph = document.querySelector('.words')

const INITIAL_TIME = 30
let currentTime = INITIAL_TIME

initGame()

function initGame() {
  const words = INITIAL_WORDS.toSorted(() => Math.random() - 0.5).slice(0, 50)

  $time.textContent = currentTime

  const mappedWords = words.map((word) => {
    const letters = word.split('')

    return `<monkey-word>
      ${letters.map((letter) => `<monkey-letter>${letter}</monkey-letter>`).join('')}
    </monkey-word>`
  })

  $paragraph.innerHTML = mappedWords.join('')

  const intervalId = setInterval(() => {
    currentTime--
    $time.textContent = currentTime

    if (currentTime === 0) {
      clearInterval(intervalId)
      gameOver('Game Over')
    }
  }, 1000)
}

function gameOver() {
  console.log('Game Over')
}
