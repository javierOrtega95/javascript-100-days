// listen to the mouse drag and touch event
document.addEventListener('mousedown', onDrag)
document.addEventListener('touchstart', onDrag, { passive: true })

let isDragging = false
let dragOffsetX = 0

const ROTATION_FACTOR = 15
const DECISION_THRESHOLD = 75

function onDrag(event) {
  if (isDragging) return

  const currentCard = event.target.closest('.card')

  if (!currentCard) return

  const startX = getCurrentPageX(event)

  addDragEventListeners()

  function onMove(event) {
    dragOffsetX = calculateDragOffset(event, startX)

    // exit if there's no horizontal movement
    if (dragOffsetX === 0) return

    isDragging = true

    applyCardTransformations(currentCard, dragOffsetX)
    updateChoiceOpacity(currentCard, dragOffsetX)
  }

  function onMoveEnd() {
    removeDragEventListeners()

    handleDecision(currentCard, dragOffsetX)
    resetDragState(currentCard)
  }

  function addDragEventListeners() {
    // listen the mouse and touch movements
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onMoveEnd)

    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onMoveEnd, { passive: true })
  }

  function removeDragEventListeners() {
    // remove the mouse and touch event listeners
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onMoveEnd)

    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onMoveEnd)
  }
}

// Helper functions

function getCurrentPageX(event) {
  // get initial position of mouse or finger
  return event.pageX ?? event.touches[0].pageX
}

function calculateDragOffset(event, startX) {
  const currentX = getCurrentPageX(event)

  return currentX - startX
}

function applyCardTransformations(card, offsetX) {
  // apply the transformation to the card
  const rotationDegrees = offsetX / ROTATION_FACTOR
  card.style.transform = `translateX(${offsetX}px) rotate(${rotationDegrees}deg)`
  card.style.cursor = 'grabbing'
}

function updateChoiceOpacity(card, offsetX) {
  const goRight = offsetX > 0

  // change opacity of the choice info
  const choiceElement = card.querySelector(
    goRight ? '.choice.like' : '.choice.nope'
  )

  const opacity = Math.abs(offsetX) / 100
  choiceElement.style.opacity = opacity
}

function handleDecision(card, offsetX) {
  const hasDecided = Math.abs(offsetX) >= DECISION_THRESHOLD

  if (hasDecided) {
    const goRight = offsetX > 0
    card.classList.add(goRight ? 'go-right' : 'go-left')
    document.addEventListener('transitionend', () => card.remove(), {
      once: true,
    })
  } else {
    resetCardPosition(card)
  }
}

function resetCardPosition(card) {
  card.classList.add('reset')
  card.classList.remove('go-right', 'go-left')
  card
    .querySelectorAll('.choice')
    .forEach((choice) => (choice.style.opacity = 0))
}

function resetDragState(card) {
  document.addEventListener(
    'transitionend',
    () => {
      card.removeAttribute('style')
      card.classList.remove('reset')
      dragOffsetX = 0
      isDragging = false
    },
    { once: true }
  )
}
