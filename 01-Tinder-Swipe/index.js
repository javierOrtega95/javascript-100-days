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

  // get initial position of mouse or finger
  const startX = event.pageX ?? event.touches[0].pageX

  addDragEventListeners()

  function onMove(event) {
    const currentX = event.pageX ?? event.touches[0].pageX
    dragOffsetX = currentX - startX

    // exit if there's no horizontal movement
    if (dragOffsetX === 0) return

    isDragging = true

    const rotationDegrees = dragOffsetX / ROTATION_FACTOR

    // apply the transformation to the card
    currentCard.style.transform = `translateX(${dragOffsetX}px) rotate(${rotationDegrees}deg)`
    currentCard.style.cursor = 'grabbing'

    const goRight = dragOffsetX > 0

    const choiceElement = goRight
      ? currentCard.querySelector('.choice.like')
      : currentCard.querySelector('.choice.nope')

    // change opacity of the choice info
    const opacity = Math.abs(dragOffsetX) / 100
    choiceElement.style.opacity = opacity
  }

  function onMoveEnd() {
    removeDragEventListeners()

    const hasDecided = Math.abs(dragOffsetX) >= DECISION_THRESHOLD

    if (hasDecided) {
      const goRight = dragOffsetX > 0

      currentCard.classList.add(goRight ? 'go-right' : 'go-left')
      document.addEventListener('transitionend', () => currentCard.remove())
    } else {
      currentCard.classList.add('reset')
      currentCard.classList.remove('go-right', 'go-left')

      currentCard.querySelectorAll('.choice').forEach((choice) => {
        choice.style.opacity = 0
      })
    }

    document.addEventListener('transitionend', () => {
      currentCard.removeAttribute('style')
      currentCard.classList.remove('reset')

      dragOffsetX = 0
      isDragging = false
    })
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
