import { words as INITIAL_WORDS } from './data.js';

const $time = document.querySelector('time');
const $paragraph = document.querySelector('.words');
const $input = document.querySelector('input');
const $timeButtons = document.querySelectorAll('.time-value');

let currentTime = 30;
let selectedTime = 30;
let intervalId = null;
let isGameOver = false;

initGame();
initEvents();

function initGame() {
  currentTime = selectedTime;
  $time.textContent = currentTime;
  $input.value = '';
  $paragraph.style.marginTop = '0px';

  const words = INITIAL_WORDS.toSorted(() => Math.random() - 0.5).slice(0, 50);

  $paragraph.innerHTML = words
    .map(
      (word) =>
        `<monkey-word>${word
          .split('')
          .map((letter) => `<monkey-letter>${letter}</monkey-letter>`)
          .join('')}</monkey-word>`
    )
    .join('');

  $paragraph.querySelector('monkey-word').classList.add('active');
  $paragraph.querySelector('monkey-letter').classList.add('active');
}

function initEvents() {
  document.addEventListener('keydown', () => $input.focus());
  $input.addEventListener('keydown', onKeyDown);
  $input.addEventListener('keyup', onKeyUp);

  $timeButtons.forEach(($btn) => {
    $btn.addEventListener('click', () => {
      $timeButtons.forEach(($b) => $b.classList.remove('active'));
      $btn.classList.add('active');
      selectedTime = parseInt($btn.textContent);
      resetGame();
    });
  });
}

function resetGame() {
  isGameOver = false;
  clearInterval(intervalId);
  intervalId = null;
  document.querySelector('#game-over')?.remove();
  initGame();
  $input.focus();
}

function startTimer() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    currentTime--;
    $time.textContent = currentTime;
    if (currentTime === 0) {
      clearInterval(intervalId);
      intervalId = null;
      gameOver();
    }
  }, 1000);
}

function onKeyDown(event) {
  if (isGameOver) return;
  const { key } = event;
  const $currentWord = $paragraph.querySelector('monkey-word.active');
  const $currentLetter = $currentWord.querySelector('monkey-letter.active');

  if (key === ' ') {
    event.preventDefault();
    const $nextWord = $currentWord.nextElementSibling;
    if (!$nextWord) return;

    const hasMissedLetters =
      $currentWord.querySelectorAll('monkey-letter:not(.correct)').length > 0;

    $currentWord.classList.remove('active');
    $currentLetter.classList.remove('active');
    $currentWord.classList.add(hasMissedLetters ? 'marked' : 'correct');

    $nextWord.classList.add('active');
    $nextWord.querySelector('monkey-letter').classList.add('active');

    $input.value = '';
    scrollWords($nextWord);
  }

  if (key === 'Backspace') {
    const $prevWord = $currentWord.previousElementSibling;
    const $prevLetter = $currentLetter.previousElementSibling;

    if (!$prevWord && !$prevLetter) {
      event.preventDefault();
      return;
    }

    if ($prevWord?.classList.contains('marked') && !$prevLetter) {
      event.preventDefault();

      $currentWord.classList.remove('active');
      $currentLetter.classList.remove('active');

      $prevWord.classList.remove('marked');
      $prevWord.classList.add('active');

      const $letterToGo = $prevWord.querySelector('monkey-letter:last-child');
      $letterToGo.classList.add('active');

      const prevLetters = $prevWord.querySelectorAll(
        'monkey-letter.correct, monkey-letter.incorrect'
      );
      $input.value = [...prevLetters]
        .map(($el) => ($el.classList.contains('correct') ? $el.innerText : '*'))
        .join('');
    }
  }
}

function onKeyUp() {
  if (isGameOver) return;
  startTimer();

  const $currentWord = $paragraph.querySelector('monkey-word.active');
  const $allLetters = $currentWord.querySelectorAll('monkey-letter');
  const currentWordValue = $currentWord.innerText.trim();
  const { value: inputValue } = $input;

  $input.maxLength = currentWordValue.length;

  $allLetters.forEach(($letter) =>
    $letter.classList.remove('correct', 'incorrect')
  );

  inputValue.split('').forEach((char, index) => {
    const isCorrect = char === currentWordValue[index];
    $allLetters[index]?.classList.add(isCorrect ? 'correct' : 'incorrect');
  });

  $allLetters.forEach(($l) => $l.classList.remove('active', 'is-last'));
  const $nextActiveLetter = $allLetters[inputValue.length];

  if ($nextActiveLetter) {
    $nextActiveLetter.classList.add('active');
  } else {
    $allLetters[$allLetters.length - 1].classList.add('active', 'is-last');
  }
}

function scrollWords($activeWord) {
  const $words = [...$paragraph.querySelectorAll('monkey-word')];
  const firstTop = $words[0].offsetTop;
  const { offsetTop } = $activeWord;

  if (offsetTop === firstTop) return;

  const secondRowWord = $words.find((w) => w.offsetTop > firstTop);
  if (!secondRowWord) return;

  const rowHeight = secondRowWord.offsetTop - firstTop;
  const currentRow = Math.floor((offsetTop - firstTop) / rowHeight);

  if (currentRow >= 2) {
    $paragraph.style.marginTop = `-${(currentRow - 1) * rowHeight}px`;
  }
}

function gameOver() {
  isGameOver = true;
  const $correctWords = $paragraph.querySelectorAll('monkey-word.correct');
  const $attempted = $paragraph.querySelectorAll(
    'monkey-letter.correct, monkey-letter.incorrect'
  );
  const $correct = $paragraph.querySelectorAll('monkey-letter.correct');

  const wpm = Math.round(($correctWords.length / selectedTime) * 60);
  const accuracy =
    $attempted.length > 0
      ? Math.round(($correct.length / $attempted.length) * 100)
      : 0;

  const $gameOver = document.createElement('section');
  $gameOver.id = 'game-over';
  $gameOver.innerHTML = `
    <h2>${wpm} <span>wpm</span></h2>
    <p>${accuracy}<span>%</span> accuracy</p>
    <button id="restart">restart</button>
  `;

  document.querySelector('#game').after($gameOver);
  document.querySelector('#restart').addEventListener('click', resetGame);
}
