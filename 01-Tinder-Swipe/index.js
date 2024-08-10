// listen to the mouse drag and touch event
document.addEventListener('mousedown', onDrag)
document.addEventListener('touchstart', onDrag, { passive: true })

let isDragging = false
const ROTATION_FACTOR = 15

function onDrag(event) {
  if (isDragging) return

  const currentCard = event.target.closest('.card')

  if (!currentCard) return

  // get initial position of mouse or finger
  const startX = event.pageX ?? event.touches[0].pageX

  addDragEventListeners()

  function onMove(event) {
    const currentX = event.pageX ?? event.touches[0].pageX
    const dragOffsetX = currentX - startX

    // exit if there's no horizontal movement
    if (dragOffsetX === 0) return

    isDragging = true

    const rotationDegrees = dragOffsetX / ROTATION_FACTOR

    // apply the transformation to the card
    currentCard.style.transform = `translateX(${dragOffsetX}px) rotate(${rotationDegrees}deg)`
    currentCard.style.cursor = 'grabbing'
  }

  function onMoveEnd(event) {
    removeDragEventListeners()
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
