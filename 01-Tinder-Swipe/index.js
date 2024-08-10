// listen to the mouse drag and touch event
document.addEventListener('mousedown', onDrag);
document.addEventListener('touchstart', onDrag, { passive: true });

function onDrag(event) {
  const currentCard = event.target.closest('article');

  if (!currentCard) return;

  addDragEventListeners();

  function onMove(event) {
    console.log('Moving...');
  }

  function onMoveEnd(event) {
    console.log('Move end');

    removeDragEventListeners();
  }

  function addDragEventListeners() {
    // listen the mouse and touch movements
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onMoveEnd);

    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onMoveEnd, { passive: true });
  }

  function removeDragEventListeners() {
    // remove the mouse and touch event listeners
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onMoveEnd);

    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onMoveEnd);
  }
}
