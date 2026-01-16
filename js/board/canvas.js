const canvasContainerWidth = canvasContainer.clientWidth;
const canvasContainerHeight = canvasContainer.clientHeight;
const context = canvas.getContext('2d');
const mapImage = new Image();

let currentImageScale;
let imageScaleIndex;
let initialLogicalDrawWidth, initialLogicalDrawHeight;

let mouseX, mouseY;
let mouseDragX, mouseDragY;
let translateX = 0; //memo:MapImageの切り抜き開始X座標
let translateY = 0; //memo:MapImageの切り抜き開始Y座標
let translateXBuf = 0;
let translateYBuf = 0;

let activePointers = new Map();
let lastPinchDistance = null;
let lastPinchCenter = null;

let drawnLines = {
  basement2nd: [],
  basement: [],
  floor1st: [],
  floor2nd: [],
  floor3rd: [],
  roof: []
};

let drawnStamps = {
  basement2nd: [],
  basement: [],
  floor1st: [],
  floor2nd: [],
  floor3rd: [],
  roof: []
};

let drawnLegendStamps = {
  basement2nd: [],
  basement: [],
  floor1st: [],
  floor2nd: [],
  floor3rd: [],
  roof: []
};

let currentLinePoints = [];

let stampNumber = 0;
let currentStamp;
let currentStamps = [];
const imageCache = {};

let press = false;
let lastMode;
let stampMode = false;
let stampRelocateMode = false;
let isCheckInRect = false;
let hookStampLocating = false;

const buttonLineClear = document.querySelector('#js-lineClear');
const buttonStampClear = document.querySelector('#js-stampClear');
const buttonAllClear = document.querySelector('#js-allClear');
const stamps = document.querySelectorAll('.js-stamp');
const deleteStampContainer = document.getElementById('js-stampDelete');

/*setting*/
const maxScale = 8.0; //memo:最大拡大率。
const minScale = 1.0; //memo:最小拡大率。
const scaleStep = 0.2; //memo:１操作あたりの拡大率。
const stampSize = 3;

/*cache*/

function getCachedImage(src, callback) {
  if (imageCache[src]) { //memo:キャッシュが存在する場合
    if (imageCache[src].complete) {
      return imageCache[src]; //memo:すでにロード完了済み
    }
    return null; //memo:まだロード中
  }

  //memo: キャッシュが存在しない場合
  const img = new Image();
  img.onload = () => {
    if (callback) callback(); //memo:ロード完了を通知
  };
  img.onerror = () => {
    console.error(`画像の読み込みに失敗しました: ${src}`);
  };
  img.src = src;
  imageCache[src] = img; //memo:キャッシュに保存

  return null;
}


/*calculation*/
//memo:高解像度化処理。以降の座標操作を論理ピクセルで扱える。
function resizeCanvas() {
  const resolutionMultiplier = 2;
  const dpr = window.devicePixelRatio || 1;
  const scaleFactor = dpr * resolutionMultiplier;

  canvas.width = canvasContainer.clientWidth * scaleFactor;
  canvas.height = canvasContainer.clientHeight * scaleFactor;
  
  context.scale(scaleFactor, scaleFactor);
  context.imageSmoothingEnabled = false;
};

//memo:親要素(コンテナ)に収まる最大サイズを計算。
function calculateMapImageSize(mapImageWidth, mapImageHeight, canvasContainerWidthReloaded, canvasContainerHeightReloaded) {
  const mapImageAspectRatio = mapImageWidth / mapImageHeight;
  const canvasContainerAspectRatio = canvasContainerWidthReloaded / canvasContainerHeightReloaded;

  let mapDrawWidth, mapDrawHeight;

  if (mapImageAspectRatio < canvasContainerAspectRatio) { 
    //memo:コンテナよりも縦長の画像は、上下に合わせる。
    mapDrawHeight = canvasContainerHeightReloaded;
    mapDrawWidth = mapDrawHeight * mapImageAspectRatio;
  } else { //memo:コンテナよりも横長の画像は左右に合わせる。
    mapDrawWidth = canvasContainerWidthReloaded;
    mapDrawHeight = mapDrawWidth / mapImageAspectRatio;
  }

  return { mapDrawWidth, mapDrawHeight };
};

function viewportToLogical(vX, vY) {
  const imageDrawX = vX - translateX;
  const imageDrawY = vY - translateY;

  const scaledX = imageDrawX / currentImageScale;
  const scaledY = imageDrawY / currentImageScale;

  const lX = scaledX / initialLogicalDrawWidth;
  const lY = scaledY / initialLogicalDrawHeight;

  return { x: lX, y: lY};
}

function logicalToViewport(lX, lY) {
  const scaledX = lX * initialLogicalDrawWidth;
  const scaledY = lY * initialLogicalDrawHeight;

  const imageDrawX = scaledX * currentImageScale;
  const imageDrawY = scaledY * currentImageScale;

  const vX = imageDrawX + translateX;
  const vY = imageDrawY + translateY;

  return {x: vX, y: vY};
}

function isRectColliding(e, rect, adjustment = 0) {
  const vX = e.clientX;
  const vY = e.clientY;
  const isCheckRectColliding = vX > (rect.left + adjustment)&&
    vX < (rect.right + adjustment)&&
    vY > (rect.top + adjustment) &&
    vY < (rect.bottom + adjustment);
  return isCheckRectColliding;
}

function getPointerLocalPositions(e) {
  const rect = e.target.getBoundingClientRect();
  const rectX = e.clientX - rect.left;
  const rectY = e.clientY - rect.top;

  return {x: rectX, y: rectY};
}

function mouseMove(e) {
  let canvasRect = canvasContainer.getBoundingClientRect();

  if (press) {
    mouseDragX = e.clientX - canvasRect.left;
    mouseDragY = e.clientY - canvasRect.top;

    translateX = translateXBuf - (mouseX - mouseDragX);
    translateY = translateYBuf - (mouseY - mouseDragY);
  } else {
    mouseX = e.clientX - canvasRect.left;
    mouseY = e.clientY - canvasRect.top;
  }
};

function returnMode() {
  let targetKey;

  if(lastMode.length > 12) {
    targetKey = lastMode.slice(13);
    lastMode = lastMode.slice(0, 13);
  }

  if(lastMode === 'move') {
    deactivateTools();
    activateMove();
  } else if(lastMode === 'pen' || lastMode === 'eraser') {
    const toolElement = document.getElementById(`open--${lastMode}Setting`);
    deactivateMove();
    deactivateTools();
    activateTools(toolElement);
  } else if(lastMode === 'operatorPen--') {
    const operators = Array.from(document.querySelectorAll('.p-canvas__operator'));

    const targetOperatorArrNum = operators.findIndex((op) => {
      const checkingKey = op.getAttribute('id').slice(21);
      return check = checkingKey === targetKey;
    });

    operators[targetOperatorArrNum].classList.add('p-canvas__operator--active');
    drawMode = 'pen';
    lastMode = `operatorPen--${targetKey}`;

  }else {
    console.log('error');
  }
}

function resetPinch(e) {
  activePointers.delete(e.pointerId);
  
  if(activePointers.size < 2) {
    lastPinchDistance = null;
    lastPinchCenter = null;
  }
};

/*canvas*/
function changeCanvasCursor() {
  canvas.addEventListener('mouseover', () => {
      canvas.style.cursor = 'default';
    });
    canvas.addEventListener('mousedown', () => {
      canvas.style.cursor = 'default';
    });
    canvas.addEventListener('mouseup', () => {
      canvas.style.cursor = 'default';
    });

  if(moveMode) {
    canvas.addEventListener('mouseover', () => {
      canvas.style.cursor = 'grab';
    });
    canvas.addEventListener('mousedown', () => {
      canvas.style.cursor = 'grabbing';
    });
    canvas.addEventListener('mouseup', () => {
      canvas.style.cursor = 'grab';
    });
  } else if(drawMode === 'pen' || drawMode === 'eraser') {
    canvas.addEventListener('mousedown', () => {
      canvas.style.cursor = 'crosshair';
    });
  }
};

function updateCanvas() {
  //memo:mapの描写
  context.clearRect(0, 0, canvasContainerWidth, canvasContainerHeight);

  const destX = translateX;
  const destY = translateY;
  const destWidth = initialLogicalDrawWidth * currentImageScale;
  const destHeight = initialLogicalDrawHeight * currentImageScale;

  context.drawImage(
    mapImage,
    0,                //memo:描画開始X座標
    0,                //memo:描画開始Y座標
    mapImage.width,   //memo:描画サイズ横
    mapImage.height,  //memo:描画サイズ縦
    destX,            //memo:画像の切り抜き開始X座標
    destY,            //memo:画像の切り抜き開始Y座標
    destWidth,        //memo:画像の切り抜きサイズ横
    destHeight        //memo:画像の切り抜きサイズ縦
  );

  const scaleRatioElement = document.getElementById('js-scaleRatio');
  const displayScaleRatio = Math.floor((imageScaleIndex * scaleStep + 1) * 10) / 10;

  scaleRatioElement.textContent = displayScaleRatio.toFixed(1) + 'x';

  //memo:線の描写
  drawnLines[selectedFloor].forEach(line => {
    context.beginPath();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = line.lineWidth;
    context.strokeStyle = line.color;

    if(line.points.length > 0) {
      let startPoint = logicalToViewport(line.points[0].x, line.points[0].y);
      context.moveTo(startPoint.x, startPoint.y);

      for(let i = 1; i < line.points.length; i++) {
        let nextPoint = logicalToViewport(line.points[i].x, line.points[i].y);
        context.lineTo(nextPoint.x, nextPoint.y);
      }

      context.stroke();
    }
  });

  //memo:スタンプの描写
  drawnStamps[selectedFloor].forEach(stamp => {
    if(stamp.points) {
      const img = getCachedImage(stamp.img, () => {
        updateCanvas();
      });

      if(img) {
        const stampSizePx = window.innerWidth * stampSize / 100;
        const halfStampSize = stampSizePx / 2;
        const stampPoints = logicalToViewport(stamp.points.x, stamp.points.y);

        context.drawImage(
          img,
          stampPoints.x - halfStampSize,
          stampPoints.y - halfStampSize,
          stampSizePx,
          stampSizePx
        );
      }
    }
  });
};

function loadMap() {
  const mapData = selectedMap ? selectedMap.blueprint[selectedFloor] : ''; 

  if(!mapData) return; //memo:URLがない場合は処理しない

  mapImage.src = mapData;

  mapImage.onload = () => {
    const canvasContainerWidthReloaded = canvasContainer.clientWidth;
    const canvasContainerHeightReloaded = canvasContainer.clientHeight;
    const { mapDrawWidth, mapDrawHeight } = calculateMapImageSize(
      mapImage.width,
      mapImage.height,
      canvasContainerWidthReloaded,
      canvasContainerHeightReloaded
    );

    initialLogicalDrawWidth = mapDrawWidth;
    initialLogicalDrawHeight = mapDrawHeight;

    translateX = (canvasContainerWidthReloaded - initialLogicalDrawWidth) / 2;
    translateY = (canvasContainerHeightReloaded - initialLogicalDrawHeight) / 2;

    currentImageScale = 1;
    imageScaleIndex = 0;

    updateCanvas();
  };
};


/*zoom*/
function zoomByWheel(e) {
  const wheeldelta = e.deltaY ? -(e.deltaY) : e.wheelDelta;
  //memo:e.deltaYが存在すればe.deltaYの符号を逆転した値が定義。
  //memo:e.deltaYが存在しなければe.wheelDeltaYが定義。(ブラウザ互換性対応)

  let nextScale;

  if (wheeldelta > 0) { //memo:拡大
      nextScale = Math.min(maxScale, currentImageScale + scaleStep);
  } else { //memo:縮小
      nextScale = Math.max(minScale, currentImageScale - scaleStep);
  }

  if (nextScale === currentImageScale) {
    return;
  } 

  //memo:マウス位置に準拠したズーム中心点の計算
  const canvasPositions = getPointerLocalPositions(e);
  const scaleRatio = nextScale / currentImageScale; // 拡縮比率

  //memo:マウス座標を中心として、画像の新しい左上座標(translate)を計算
  //memo:新しい座標 = マウス位置 - (マウス位置 - 現在の画像座標) * 比率　(左上の隠れている部分の座標を引いている。)
  let nextTranslateX = canvasPositions.x - (canvasPositions.x - translateX) * scaleRatio;
  let nextTranslateY = canvasPositions.y - (canvasPositions.y - translateY) * scaleRatio;
  
  currentImageScale = nextScale;
  imageScaleIndex = Math.round((currentImageScale - 1) / scaleStep); //拡縮段階の計算。
  translateX = nextTranslateX;
  translateY = nextTranslateY;

  if(currentImageScale === minScale){
    translateX = (canvasContainerWidth - initialLogicalDrawWidth) / 2;
    translateY = (canvasContainerHeight - initialLogicalDrawHeight) / 2;
  }

  updateCanvas();
};

function disableScroll() {
  document.addEventListener("mousewheel", scrollControl, { passive: false });
}

function enableScroll() {
  document.removeEventListener("mousewheel", scrollControl, { passive: false });
}

function scrollControl(e) {
  e.preventDefault();
}

function zoomByButton(zoom) {
  let nextScale;
  const isZoomUp = zoom === 'up';
  const isZoomDown = zoom === 'down'; 

  if(isZoomUp && imageScaleIndex >= 20) {
    return; 
  } else if(isZoomDown && imageScaleIndex <= 0) {
    return;
  } else if(isZoomUp) {
    nextScale = Math.min(maxScale, currentImageScale + scaleStep);
  } else {
    nextScale = Math.max(minScale, currentImageScale - scaleStep);
  }

  const scaleRatio = nextScale / currentImageScale;
  const centerX = canvasContainerWidth / 2;
  const centerY = canvasContainerHeight / 2;

  let nextTranslateX = centerX - (centerX - translateX) * scaleRatio;
  let nextTranslateY = centerY - (centerY - translateY) * scaleRatio;

  currentImageScale = nextScale;
  imageScaleIndex = Math.round((currentImageScale - 1) / scaleStep); //拡縮段階の計算。
  translateX = nextTranslateX;
  translateY = nextTranslateY;

  if(currentImageScale === minScale){
    translateX = (canvasContainerWidth - initialLogicalDrawWidth) / 2;
    translateY = (canvasContainerHeight - initialLogicalDrawHeight) / 2;
  }

  updateCanvas();
};


/*draw*/
function drawLine(e) {
  const canvasPosition = getPointerLocalPositions(e);
  
  if(!press) {
    return;
  }
  
  context.lineCap = 'round';
  context.lineJoin = 'round';
  
  context.lineWidth = penBoldValue;
  context.strokeStyle = currentColor;

  if(press) {
    context.lineTo(canvasPosition.x, canvasPosition.y);
    context.stroke();

    const logicalPositions = viewportToLogical(canvasPosition.x, canvasPosition.y);
    currentLinePoints.push(logicalPositions);
  }
};

function drawLineStart(e) {
  const canvasPosition = getPointerLocalPositions(e);

  context.beginPath();
  context.moveTo(canvasPosition.x, canvasPosition.y);
};

function drawLineEnd() {
  context.closePath();

  if(press && currentLinePoints.length > 1) {
    drawnLines[selectedFloor].push({
      color: currentColor,
      lineWidth: penBoldValue,
      points: currentLinePoints,
    });
  }

  currentLinePoints = [];
};

function isLineColliding(logicalPosition1, logicalPosition2, eraserCenter, eraserRadius) {
  const localPosition1 = logicalToViewport(logicalPosition1.x, logicalPosition1.y);
  const localPosition2 = logicalToViewport(logicalPosition2.x, logicalPosition2.y);
  const distSquared1 = Math.pow(localPosition1.x - eraserCenter.x, 2) + Math.pow(localPosition1.y - eraserCenter.y, 2);
  const distSquared2 = Math.pow(localPosition2.x - eraserCenter.x, 2) + Math.pow(localPosition2.y - eraserCenter.y, 2);
  const radiusSquared = Math.pow(eraserRadius, 2);
  
  if(distSquared1 < radiusSquared || distSquared2 < radiusSquared) {
    return true;
  };

  //memo:点 (p) と線分 (vp1-vp2) の最短距離を計算
    
  //memo:線分のベクトル A = vp2 - vp1
  const Ax = localPosition2.x - localPosition1.x;
  const Ay = localPosition2.y - localPosition1.y;

  //memo:点 p から vp1 へのベクトル B = p - vp1
  const Bx = eraserCenter.x - localPosition1.x;
  const By = eraserCenter.y - localPosition1.y;

  //memo:A と B の内積
  const dotProduct = Ax * Bx + Ay * By;
  
  //memo:A の長さの二乗
  const lenSq = Ax * Ax + Ay * Ay;
  
  let t = dotProduct / lenSq;
  
  //memo:t を 0 から 1 の間にクランプ (最短点が線分上にあることを保証)
  t = Math.max(0, Math.min(1, t));

  //memo: 線分上の最短点 q の座標
  const qx = localPosition1.x + t * Ax;
  const qy = localPosition1.y + t * Ay;

  //memo: p と q の距離の二乗
  const distSquaredSegment = Math.pow(eraserCenter.x - qx, 2) + Math.pow(eraserCenter.y - qy, 2);
  
  //memo: 最短距離が半径より小さいか
  return distSquaredSegment < radiusSquared;
};

function eraseLine(e) {
  const canvasPosition = getPointerLocalPositions(e);

  
  if(!press) {
    return;
  }
  
  const eraserRadius = eraserBoldValue;
  const eraserCenter = {x: canvasPosition.x, y:canvasPosition.y};
  let newDrawnLines = [];

  if (press) {
    drawnLines[selectedFloor].forEach(drawnLine => {
      let currentSegment = [];

      for (let i = 1; i < drawnLine.points.length; i++) {
        const logicalPosition1 = drawnLine.points[i - 1];
        const logicalPosition2 = drawnLine.points[i];


        if (isLineColliding(logicalPosition1, logicalPosition2, eraserCenter, eraserRadius)) {
          //memo:line衝突時

          if (currentSegment.length > 0) {
            newDrawnLines.push ({
              color: drawnLine.color,
              lineWidth: drawnLine.lineWidth,
              points: currentSegment
            });
          }

          currentSegment = [];

        } else {
          if (currentSegment.length === 0) {
            currentSegment.push(logicalPosition1);
          }
          currentSegment.push(logicalPosition2);
        }
      }

      if(currentSegment.length > 1) {
        newDrawnLines.push({
          color: drawnLine.color,
          lineWidth: drawnLine.lineWidth,
          points: currentSegment
        });
      }
    });

    drawnLines[selectedFloor] = newDrawnLines;

    updateCanvas();
  }
};

function canvasLineClear() {
  drawnLines[selectedFloor] = [];

  updateCanvas();
};

function canvasStampClear() {
  drawnStamps[selectedFloor] = [];

  updateCanvas();
};

function canvasAllClear() {
  drawnLines[selectedFloor] = [];
  drawnStamps[selectedFloor] = [];

  updateCanvas();
};

/*stamp*/
function getStampPositionsToFollowMouse(e) {
  const stampSizePx = window.innerWidth * stampSize / 100;
  const halfStampSize = stampSizePx / 2;
  const viewportX = e.clientX;
  const viewportY = e.clientY;

  const vXadjusted = viewportX - halfStampSize;
  const vYadjusted = viewportY - halfStampSize;

  return { x: vXadjusted, y: vYadjusted};
};

function getStampPositionsToRecord(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const rectX = e.clientX - rect.left;
  const rectY = e.clientY - rect.top;

  return {
    x: rectX,
    y: rectY
  };
};

function identifyStampContainer(e) {
  const clickedElement = e.target;
  const isCheckOperator = clickedElement.classList.contains('js-stamp--operator');
  const isCheckAbility = clickedElement.classList.contains('js-stamp--ability');
  const isCheckgadget = clickedElement.classList.contains('js-stamp--gadget');
  const isCheckGear = clickedElement.classList.contains('js-stamp--gear');
  const isCheckStamp = clickedElement.classList.contains('js-stamp--stamp');

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
};

function mouseStamp(e) {
  const stamp = new Image();
  const selectedImage = e.target;
  const selectedImageURL = selectedImage.getAttribute('src');
  stamp.src = selectedImageURL;
  stamp.id = 'stamp--' + (stampNumber);
  stamp.style.width = stampSize + 'vw';
  stamp.style.height = stampSize + 'vw';
  stamp.style.display = 'block';
  stamp.style.position = 'fixed';
  stamp.style.zIndex = '900';
  const stampPositionsFollowingMouse = getStampPositionsToFollowMouse(e);
  stamp.style.left = stampPositionsFollowingMouse.x + 'px';
  stamp.style.top  = stampPositionsFollowingMouse.y + 'px';
  stamp.style.pointerEvents = 'none';
  stamp.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  canvasContainer.appendChild(stamp);

  const stampPositionsLocal = getStampPositionsToRecord(e);
  const logicalPositions = viewportToLogical(stampPositionsLocal.x, stampPositionsLocal.y);

  const stampData = {
    id: stamp.id,
    img: stamp.src,
    points: logicalPositions
  }

  drawnStamps[selectedFloor].push(stampData);
};

function mouseStampMove(e) {
  const stamp = canvasContainer.lastElementChild;
  const stampPositionsOnMouse = getStampPositionsToFollowMouse(e);
  stamp.style.left = stampPositionsOnMouse.x + 'px';
  stamp.style.top  = stampPositionsOnMouse.y + 'px';
};

function drawStamp(e) {
  const stamp = canvasContainer.lastElementChild;
  const stampPositionsLocal = getStampPositionsToRecord(e);
  const logicalPositions = viewportToLogical(stampPositionsLocal.x, stampPositionsLocal.y);

  if(stampRelocateMode) {
    const id = currentStamp.id;
    const arrayNumber =  drawnStamps[selectedFloor].findIndex((stamp) => stamp.id === id);
    const arrayStamps = drawnStamps[selectedFloor];

    
    currentStamp.id = `stamp--${id.slice(7)}`
    currentStamp.points = logicalPositions;
    arrayStamps.splice(arrayNumber, 1);

    drawnStamps[selectedFloor].push(currentStamp);

    currentStamp = {};

  } else {
    drawnStamps[selectedFloor][drawnStamps[selectedFloor].length - 1].points = logicalPositions;
  }
  
  stamp.remove();
};

function isStampColliding(stampData, pointerCenter, pointerRadius) {

  const closestX = Math.max(stampData.x, Math.min(pointerCenter.x, stampData.x + stampData.width));
  const closestY = Math.max(stampData.y, Math.min(pointerCenter.y, stampData.y + stampData.height));

  const distSquaredX = pointerCenter.x - closestX;
  const distSquaredY = pointerCenter.y - closestY;
  const distanceSquared = (distSquaredX * distSquaredX) + (distSquaredY * distSquaredY);

  const radiusSquared = pointerRadius * pointerRadius;

  return distanceSquared < radiusSquared;
};

function removeStamp() {
  const id = currentStamp.id;

  const arrayNumber =  drawnStamps[selectedFloor].findIndex((stamp) => stamp.id === id);
  drawnStamps[selectedFloor][arrayNumber] = {
    id: id,
    img: currentStamp.img,
    points: {}
  };

  updateCanvas();
};

function mouseStampForRelocate(e) {
  const id = currentStamp.id;
  const stamp = new Image();

  stamp.src = currentStamp.img;
  stamp.id = id;
  stamp.style.width = stampSize + 'vw';
  stamp.style.height = stampSize + 'vw';
  stamp.style.display = 'block';
  stamp.style.position = 'fixed';
  stamp.style.zIndex = '900';
  const stampPositionsOnMouse = getStampPositionsToFollowMouse(e);
  stamp.style.left = stampPositionsOnMouse.x + 'px';
  stamp.style.top  = stampPositionsOnMouse.y + 'px';
  stamp.style.pointerEvents = 'none';
  stamp.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  canvasContainer.appendChild(stamp);
};

function mouseStampMoveForRelocate(e) {
  const id = currentStamp.id;
  const stamp = document.getElementById(id);
  const stampPositionFollowingMouse = getStampPositionsToFollowMouse(e);
  stamp.style.left = stampPositionFollowingMouse.x + 'px';
  stamp.style.top  = stampPositionFollowingMouse.y + 'px';
};

/*実行*/
/*default*/
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });
});

// ダブルタップによるズームをJavaScriptで阻止する
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  if(e.target.closest('.p-canvas__btn--zoom')) return;

  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault(); // 300ms以内の連続タップを無効化
  }
  lastTouchEnd = now;
}, false);

/*load*/
window.addEventListener('load', () => {
  resizeCanvas();
  loadMap();
});
/*resize*/
window.addEventListener('resize', () => {
  resizeCanvas();
  loadMap();
});

/*zoom*/
canvas.addEventListener('wheel', (e) =>  {
  e.preventDefault();
  zoomByWheel(e);
}, { passive: false }); 
canvas.addEventListener('mouseover', disableScroll); 
canvas.addEventListener('mouseout', enableScroll); 

const buttonZoomUp = document.getElementById('js-zoomUp');

buttonZoomUp.addEventListener('click', () => {
  const zoom = buttonZoomUp.getAttribute('id').slice(7).toLowerCase();
  zoomByButton(zoom);
});

const buttonZoomDown = document.getElementById('js-zoomDown');

buttonZoomDown.addEventListener('click', () => {
  const zoom = buttonZoomDown.getAttribute('id').slice(7).toLowerCase();
  zoomByButton(zoom);
});


/*canvas*/
canvas.addEventListener('pointerdown', (e) => {
  activePointers.set(e.pointerId, e);

  if(activePointers.size >= 2) {
    return;
  }

  const canvasPositions = getPointerLocalPositions(e);
  const pointerCenter = {x: canvasPositions.x, y: canvasPositions.y}
  const pointerRadius = 1;
  const stampData = {};

  drawnStamps[selectedFloor].forEach(drawnStamp => {
    const stampSizePx = window.innerWidth * stampSize / 100;
    const halfStampSize = stampSizePx / 2;
    const stampPoints = logicalToViewport(drawnStamp.points.x, drawnStamp.points.y)
      
    stampData.x = stampPoints.x - halfStampSize;
    stampData.y = stampPoints.y - halfStampSize;
    stampData.width = stampSizePx;
    stampData.height = stampSizePx;

    if(isStampColliding(stampData, pointerCenter, pointerRadius)) {
      currentStamps.push(drawnStamp);
    }
  });

  if(currentStamps.length > 0) {
    deleteStampContainer.classList.add('p-canvas__stampDelete--active');

    for(let i = 0; i < currentStamps.length; i++) {
      if(i !== currentStamps.length - 1){
        continue;
      }

      canvasContainer.setPointerCapture(e.pointerId); 
      currentStamp = currentStamps[i];
      removeStamp(e);
      mouseStampForRelocate(e);
      deactivateMove();
      deactivateTools();
      deactivateOperator();
      stampRelocateMode = true;
      hookStampLocating = true;
      currentStamps = [];
    }

    press = true;
    return;
  }
  
  if(moveMode) {
    const canvasRect = canvasContainer.getBoundingClientRect();
    mouseX = e.clientX - canvasRect.left;
    mouseY = e.clientY - canvasRect.top;
    translateXBuf = translateX;
    translateYBuf = translateY;
  } else if(drawMode === 'pen' ) {
    drawLineStart(e);
  } else if(drawMode === 'eraser') {
    eraseLine(e);
  }

  press = true;
});

canvas.addEventListener('pointerup', (e) => {
  resetPinch(e);

  if(drawMode === 'pen') {
    drawLineEnd();
  }

  if(stampMode || stampRelocateMode) {
    returnMode();
  }

  press = false;
});

canvas.addEventListener('pointerout',() => {
  resetPinch(e);

  if(drawMode === 'pen') {
    drawLineEnd();
  }

  press = false;
});

canvas.addEventListener('pointercancel', () => {
  resetPinch(e);
  press = false;
});

canvas.addEventListener('pointermove', (e) => {
  activePointers.set(e.pointerId, e);

  if(activePointers.size === 2) {
    const [p1, p2] = Array.from(activePointers.values());
    const rect = canvasContainer.getBoundingClientRect();
    const currentDistance = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
    const currentCenter = {
      x: (p1.clientX + p2.clientX) / 2 - rect.left,
      y: (p1.clientY + p2.clientY) / 2 - rect.top
    }

    if(lastPinchDistance && lastPinchCenter) {
      const deltaScale = currentDistance / lastPinchDistance;
      const nextScale = Math.min(maxScale, Math.max(minScale, currentImageScale * deltaScale));
      const scaleRatio = nextScale / currentImageScale;
      const movementX = currentCenter.x - lastPinchCenter.x;
      const movementY = currentCenter.y - lastPinchCenter.y;

      translateX = currentCenter.x - (lastPinchCenter.x - translateX) * scaleRatio;
      translateY = currentCenter.y - (lastPinchCenter.y - translateY) * scaleRatio;

      currentImageScale = nextScale;
      imageScaleIndex = Math.round((currentImageScale - 1) / scaleStep);

      updateCanvas();
    }
    lastPinchDistance = currentDistance;
    lastPinchCenter = currentCenter;
    return;
  }

  if(moveMode) {
    mouseMove(e);
    updateCanvas();
  } else if (drawMode === 'pen') {
    drawLine(e);
  } else if (drawMode === 'eraser') {
    eraseLine(e);
  }
});

/*clear*/
buttonLineClear.addEventListener('click', () => {
  const modal = buttonLineClear.parentElement.parentElement;

  modal.classList.remove('js-setting--active');

  modal.close();
  canvasLineClear();
});

buttonStampClear.addEventListener('click', () => {
  const modal = buttonStampClear.parentElement.parentElement;

  modal.classList.remove('js-setting--active');
  modal.close();
  canvasStampClear();
});

buttonAllClear.addEventListener('click', () => {
  const modal = buttonAllClear.parentElement.parentElement;

  modal.classList.remove('js-setting--active');
  modal.close();
  canvasAllClear();
});

stamps.forEach(stamp => {
  const modal = document.querySelector('dialog.js-stampSetting');
  stamp.addEventListener('pointerdown', (e) => {
    //memo: 既存のマウス追従スタンプの削除
    const existingStamp = canvasContainer.lastElementChild;
    const id = existingStamp.getAttribute('id');
    const isCheckMouseStamp = id.slice(0, 7) === 'stamp--'; 

    if(isCheckMouseStamp) {
      elementForCheck.remove();
      const arrayNumber = drawnStamps[selectedFloor].findIndex((stamp) => stamp.id === idForCheck);
      drawnStamps[selectedFloor].splice(arrayNumber, 1);
    }
    
    const container = identifyStampContainer(e);
    const isCheckItemsActive = container.classList.contains('items--active');
    const isCheckGearsActive = container.classList.contains('p-canvas__gears--active');
    const isCheckStamp = container.classList.contains('js-stamp--stamp');

    if(isCheckStamp) {
      modal.close();
    }

    if(isCheckItemsActive) {
      deactivateItems();
    }

    if(isCheckGearsActive) {
      deactivateGears();
    }
    
    if(!isCheckItemsActive && !isCheckGearsActive && !isCheckStamp ){
      return; //memo: 上記のどれかがアクティブの時じゃないとスタンプモードにならないように制御。
    } else {
      canvasContainer.setPointerCapture(e.pointerId); 
      stampNumber++;
      mouseStamp(e);
      deactivateMove();
      deactivateTools();
      deactivateOperator();
      stampMode = true;
      hookStampLocating = true;
      isCheckInRect = true;
      deleteStampContainer.classList.add('p-canvas__stampDelete--active');
    }
  });
});

canvasContainer.addEventListener('pointerup', (e) => {
  const deleteRect = deleteStampContainer.getBoundingClientRect();
  const isDeleteRectColliding = isRectColliding(e, deleteRect);

  if(isDeleteRectColliding) {
    const existingStamp = canvasContainer.lastElementChild;
    const id = existingStamp.getAttribute('id');
    const isCheckMouseStamp = id.slice(0, 7) === 'stamp--';

    if(isCheckMouseStamp) {
      existingStamp.remove();
      const arrayNumber = drawnStamps[selectedFloor].findIndex((stamp) => stamp.id === id);
      
      if(stampMode && arrayNumber === drawnStamps[selectedFloor].length - 1) {
        stampNumber--;
      }

      drawnStamps[selectedFloor].splice(arrayNumber, 1);
      setTimeout(() => {
        deleteStampContainer.classList.remove('p-canvas__stampDelete--active');
      }, 500);

      returnMode();
      stampMode = false;
      stampRelocateMode = false;
      hookStampLocating = false;
      isCheckInRect = false;
      return;
    }
  }
  
  if(stampMode && hookStampLocating) {
    //console.log('stamp描写');
    drawStamp(e);
    returnMode();
    stampMode = false;
    hookStampLocating = false;
    isCheckInRect = false;
    deleteStampContainer.classList.remove('p-canvas__stampDelete--active');
    updateCanvas();

  } else if(stampRelocateMode && hookStampLocating) {
    //console.log('stamp再描写');
    drawStamp(e);
    returnMode();
    stampRelocateMode = false;
    hookStampLocating = false;
    isCheckInRect = false;
    deleteStampContainer.classList.remove('p-canvas__stampDelete--active');
    updateCanvas();
  }
});

document.addEventListener('pointermove', (e) => {
  const canvasRect = canvasContainer.getBoundingClientRect();
  const deleteRect = deleteStampContainer.getBoundingClientRect();
  const stampSizePx = window.innerWidth * stampSize / 100;
  const halfStampSize = stampSizePx / 2;
  const adjustment = halfStampSize * -1;
  const isCanvasColliding = isRectColliding(e, canvasRect, adjustment);
  const isDeleteRectColliding = isRectColliding(e, deleteRect);

  if(!isCanvasColliding) {
    hookStampLocating = false;
  } else {
    hookStampLocating = true;
  }

  if(isCanvasColliding) {
    isCheckInRect = false;
  }

  if(stampMode && hookStampLocating) {
    if(!hookStampLocating && isCheckInRect) {
      mouseStampMove(e);

    } else if (hookStampLocating && !isCheckInRect){
      mouseStampMove(e);
    }
    
  } else if (stampRelocateMode && hookStampLocating) {
    if(hookStampLocating) {
      mouseStampMoveForRelocate(e);
    }
  }

  if(isDeleteRectColliding) {
    deleteStampContainer.style.opacity = '1.0';
  } else {
    deleteStampContainer.style.opacity = '0.6';
  }
});