import { words as INITIAL_WORDS } from './data.js'

const $time = document.querySelector('time')
const $paragraph = document.querySelector('.words')
const $input = document.querySelector('input')

const INITIAL_TIME = 30
let currentTime = INITIAL_TIME

initGame()
initEvents()

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

  const firstWord = document.querySelector('monkey-word')
  firstWord.classList.add('active')

  const firstLetter = document.querySelector('monkey-letter')
  firstLetter.classList.add('active')
}

function initEvents() {
  document.addEventListener('keydown', () => {
    $input.focus()
  })

  const intervalId = setInterval(() => {
    currentTime--
    $time.textContent = currentTime

    if (currentTime === 0) {
      clearInterval(intervalId)
      gameOver('Game Over')
    }
  }, 1000)

  $input.addEventListener('keydown', onKeyDown)
  $input.addEventListener('keyup', onKeyUp)
}

function onKeyDown() {} // TODO: handle Backspace
function onKeyUp() {
  const $currentWord = $paragraph.querySelector('monkey-word.active')
  const $currentLetter = $currentWord.querySelector('monkey-letter.active')
  const $allLetters = $currentWord.querySelectorAll('monkey-letter')
  const currentWordValue = $currentWord.innerText.trim()
  const { value: inputValue } = $input
  const inputLetters = inputValue.split('')

  $input.maxLength = currentWordValue.length
  $allLetters.forEach(($letter) => $letter.classList.remove('correct', 'incorrect'))

  inputLetters.forEach((char, index) => {
    const $letter = $allLetters[index]
    const letterToCheck = currentWordValue[index]

    const isCorrect = char === letterToCheck
    const letterClass = isCorrect ? 'correct' : 'incorrect'
    $letter.classList.add(letterClass)
  })

  $currentLetter.classList.remove('active', 'is-last')
  const $nextActiveLetter = $allLetters[inputValue.length]

  if ($nextActiveLetter) {
    $nextActiveLetter.classList.add('active')
  } else {
    $currentLetter.classList.add('active', 'is-last')
    // TODO: gameOver if there is no next word
  }
}

function gameOver() {
  console.log('Game Over')
}
