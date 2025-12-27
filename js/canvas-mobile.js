//base
const updateViewport = () => {
  const boardElement = document.querySelector('.l-board');
  boardElement.style.height = window.innerHeight + 'px';
  //boardElement.style.width = window.innerWidth + 'px';
}
//window.addEventListener('load', updateViewport);
//window.addEventListener('resize', updateViewport);
//window.addEventListener('orientationchange', updateViewport);
//updateViewport;

document.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, {passive: false})



//zoom

//TODO:2本指でのズームパン操作

//draw
canvas.addEventListener('touchstart', (e) => {
  if (selectedDrawTool ==='pen' && !checkMoveActive) {
    drawLineStart(e);
  } else if(selectedDrawTool === 'eraser' && !checkMoveActive) {
    isErasing = true;
    eraseLine(e);
  }
});

canvas.addEventListener('touchend', () => {
  drawLineEnd();
  isErasing = false;
});

//TODO:canvas外に出た時の操作を記述。touchoutのイベントは存在しない。rectの検出と合わせて実装できるか。
/*
canvas.addEventListener('mouseout', () => {
  drawLineEnd();
  isErasing = false;
});
*/

canvas.addEventListener('touchmove', (e) => {
  if(selectedDrawTool === 'pen' && !checkMoveActive){
    drawLine(e);
  } else if (selectedDrawTool === 'eraser' && !checkMoveActive) {
    eraseLine(e);
  }
}, {passive: false});

//stamp
stamps.forEach(stamp => {
  const modal = document.querySelector('dialog.js-stampSetting');
  stamp.addEventListener('touchstart', (e) => {

    const existingStamp = canvasContainer.lastElementChild;
    const id = existingStamp.getAttribute('id');
    const isCheckMouseStamp = id.slice(0, 7) === 'stamp--'; 

    if(isCheckMouseStamp) {
      elementForCheck.remove();
      const arrayNumber = drawnStamps[selectedFloor].findIndex((stamp) => stamp.id === idForCheck);
      drawnStamps[selectedFloor].splice(arrayNumber, 1);
    }

    const clickedElement = e.target;
    const isCheckOperator = clickedElement.classList.contains('js-stamp--operator');
    const isCheckAbility = clickedElement.classList.contains('js-stamp--ability');
    const isCheckgadget = clickedElement.classList.contains('js-stamp--gadget');
    const isCheckGear = clickedElement.classList.contains('js-stamp--gear');
    const isCheckStamp = clickedElement.classList.contains('js-stamp--stamp');

    const checkWhichStamp = (clickedElement) => {
      if(isCheckOperator){
        return clickedElement.parentNode.previousElementSibling;
      } else if(isCheckAbility) {
        return clickedElement.parentNode;
      } else if(isCheckgadget) {
        return clickedElement.parentNode.parentNode;
      } else if(isCheckGear) {
        return clickedElement.parentNode;
      } else if(isCheckStamp) {
        return clickedElement;
      }
    }

    const container = checkWhichStamp(clickedElement);
    const isCheckItemsActive = container.classList.contains('items--active');
    const isCheckGearsActive = container.classList.contains('p-canvas__gears--active');

    if(isCheckStamp) {
      modal.close();
    }
    
    if(!isCheckItemsActive && !isCheckGearsActive && !isCheckStamp ){
      return;
    } else {
      mouseStamp(e);
      stampRelocateMode = false;
      stampMode = true;
      hookStampLocating = true;
      isCheckInRect = true;
      deleteStampContainer.classList.add('p-canvas__stampDelete--active');
    }

    if(isCheckAbility || isCheckgadget) {
      deactivateItems();
    }

    if(isCheckGearsActive) {
      deactivateGears();
    }
  });
});

canvasContainer.addEventListener('touchstart', (e) => {

  const deleteRect = deleteStampContainer.getBoundingClientRect();
  const isDeleteRectColliding = isRectColliding(e, deleteRect);

  if(isDeleteRectColliding) {
    const existingStamp = canvasContainer.lastElementChild;
    const id = existingStamp.getAttribute('id');
    const isCheckMouseStamp = id.slice(0, 7) === 'stamp--';
    if(isCheckMouseStamp) {
      existingStamp.remove();
      const arrayNumber = drawnStamps[selectedFloor].findIndex((stamp) => stamp.id === id);
      drawnStamps[selectedFloor].splice(arrayNumber, 1);
      setTimeout(() => {
        deleteStampContainer.classList.remove('p-canvas__stampDelete--active');
      }, 500);
      stampMode = false;
      stampRelocateMode = false;
      hookStampLocating = false;
      return;
    }
  }
  
  if(stampMode && hookStampMoving) {
    //console.log('2:stamp描写');
    drawStamp(e);
    stampMode = false;
    stampRelocateMode = true;
    hookStampLocating = false;
    deleteStampContainer.classList.remove('p-canvas__stampDelete--active');

    //console.log(drawnStamps[selectedFloor]);

    updateCanvas();

  } else if(stampRelocateMode && hookStampLocating) {
    //console.log('3:stamp再描写');
    hookStampLocating = false;
    drawStamp(e);
    updateCanvas();
    deleteStampContainer.classList.remove('p-canvas__stampDelete--active');

  } else if (stampRelocateMode && !hookStampLocating) {
    const rect = e.target.getBoundingClientRect();
    const vX = e.clientX - rect.left;
    const vY = e.clientY - rect.top;
    const pointerCenter = {x: vX, y: vY};
    const pointerRadius = 1;

    drawnStamps[selectedFloor].forEach(drawnStamp => {
      const stampSizePx = window.innerWidth * stampSize / 100;
      const halfStampSize = stampSizePx / 2;
      const stampPoints = logicalToViewport(drawnStamp.points.x, drawnStamp.points.y)
      const stampData = {
        x: stampPoints.x - halfStampSize,
        y: stampPoints.y - halfStampSize,
        width: stampSizePx,
        height: stampSizePx
      }

      if(isStampColliding(stampData, pointerCenter, pointerRadius)) {
        //console.log('4:stamp再選択')
        
        currentStamps.push(drawnStamp);
        deleteStampContainer.classList.add('p-canvas__stampDelete--active');
      }

      
    })

    for(let i = 0; i < currentStamps.length; i++) {
      if(i !== currentStamps.length - 1) {
        continue;
      }

      currentStamp = currentStamps[i];
      removeStamp(e);
      mouseStampForRelocate(e);
      hookStampLocating = true;
      currentStamps = [];
    }
  }
});

document.addEventListener('touchmove', (e) => {
  const canvasRect = canvasContainer.getBoundingClientRect();
  const deleteRect = deleteStampContainer.getBoundingClientRect();
  const stampSizePx = window.innerWidth * stampSize / 100;
  const halfStampSize = stampSizePx / 2;
  const adjustment = halfStampSize * -1;
  const isCanvasColliding = isRectColliding(e, canvasRect, adjustment);
  const isDeleteRectColliding = isRectColliding(e, deleteRect);

  if(!isCanvasColliding) {
    hookStampMoving = false;
  } else {
    hookStampMoving = true;
  }

  if(isCanvasColliding) {
    isCheckInRect = false;
  }

  if(stampMode && hookStampLocating) {
    if(!hookStampMoving && isCheckInRect) {
      mouseStampMove(e);

    } else if (hookStampMoving && !isCheckInRect){
      mouseStampMove(e);
    }
    
  } else if (stampRelocateMode && hookStampLocating) {
    if(hookStampMoving) {
      mouseStampMoveForRelocate(e);
    }
  }

  if(isDeleteRectColliding) {
    deleteStampContainer.style.opacity = '1.0';
  } else {
    deleteStampContainer.style.opacity = '0.6';
  }
});