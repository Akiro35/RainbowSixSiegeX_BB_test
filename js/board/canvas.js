
/* canvas */
const canvas = document.getElementById('js-canvasMap');
const canvasContainer = document.getElementById('js-canvasContainer');
const context = canvas.getContext('2d');

const resolutionMultiplier = 2;
const dpr = window.devicePixelRatio || 1;
const scaleFactor = dpr * resolutionMultiplier;

console.log('Device Pixel Ratio:', dpr);
console.log('Final Scale Factor:', scaleFactor);

//高解像度化処理。以降の座標操作を論理ピクセルで扱える。
let resizeCanvas = () => {
    canvas.width = canvasContainer.clientWidth * scaleFactor;
    canvas.height = canvasContainer.clientHeight * scaleFactor;
    
    context.scale(scaleFactor, scaleFactor);
    context.imageSmoothingEnabled = false;
}

//親要素(コンテナ)に収まる最大サイズを計算。
const calculateImageSize = (imageWidth, imageHeight, containerWidth, containerHeight) => {
  const imageAspectRatio = imageWidth / imageHeight;
  const containerAspectRatio = containerWidth / containerHeight;

  let drawWidth, drawHeight;

  if (imageAspectRatio < containerAspectRatio) { //コンテナよりも縦長の画像は、上下に合わせる。
      drawHeight = containerHeight;
      drawWidth = drawHeight * imageAspectRatio;
  } else { //コンテナよりも横長の画像は左右に合わせる。
      drawWidth = containerWidth;
      drawHeight = drawWidth / imageAspectRatio;
  }

  return { drawWidth, drawHeight }; //画像サイズを返す。
};

const viewportToLogical = (vX, vY) => {
  const imageDrawX = vX - translateX;
  const imageDrawY = vY - translateY;

  const scaledX = imageDrawX / currentImageScale;
  const scaledY = imageDrawY / currentImageScale;

  const lX = scaledX / initialDrawWidth;
  const lY = scaledY / initialDrawHeight;

  return { x: lX, y: lY};
}

const logicalToViewport = (lX, lY) => {
  const scaledX = lX * initialDrawWidth;
  const scaledY = lY * initialDrawHeight;

  const imageDrawX = scaledX * currentImageScale;
  const imageDrawY = scaledY * currentImageScale;

  const vX = imageDrawX + translateX;
  const vY = imageDrawY + translateY;

  return {x: vX, y: vY};
}

const isRectColliding = (e, rect, adjustment = 0) => {
  const mX = e.clientX;
  const mY = e.clientY;
  const isCheckRectColliding = mX > (rect.left + adjustment)&&
    mX < (rect.right + adjustment)&&
    mY > (rect.top + adjustment) &&
    mY < (rect.bottom + adjustment);
  return isCheckRectColliding;
}

const image = new Image();
const maxScale = 8.0; //最大拡大率。
const minScale = 1.0; //最小拡大率。
const scaleStep = 0.2; //１操作あたりの拡大率。

let currentImageScale = 1;
let imageScaleIndex = 0;

let initialDrawWidth, initialDrawHeight;

let translateX = 0; //画像の切り抜き開始X座標
let translateY = 0; //画像の切り抜き開始Y座標

let mouseX, mouseY;

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


const updateCanvas = () => { //キャンバスに描画。
  const logicalWidth = canvasContainer.clientWidth;
  const logicalHeight = canvasContainer.clientHeight;

  context.clearRect(0, 0, logicalWidth, logicalHeight);

  // 画像の切り抜きサイズ
  const destWidth = initialDrawWidth * currentImageScale;
  const destHeight = initialDrawHeight * currentImageScale;

  const destX = translateX;
  const destY = translateY;

  const scaleRatioElement = document.getElementById('js-scaleRatio');
  const displayScaleRatio = Math.floor((imageScaleIndex * scaleStep + 1) * 10) / 10;

  scaleRatioElement.textContent = displayScaleRatio.toFixed(1) + 'x';

  context.drawImage(
    image,
    0, //描画開始X座標
    0, //描画開始Y座標
    image.width, //描画サイズ横
    image.height, //描画サイズ縦
    destX, //画像の切り抜き開始X座標
    destY, //画像の切り抜き開始Y座標
    destWidth, //画像の切り抜きサイズ横
    destHeight //画像の切り抜きサイズ縦
  );

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

  drawnStamps[selectedFloor].forEach(stamp => {
    const newStamp = new Image();

    if (stamp.points) {
    
      newStamp.src = stamp.img;

      const stampSizePx = window.innerWidth * stampSize / 100;
      const halfStampSize = stampSizePx / 2;

      const stampPoints = logicalToViewport(stamp.points.x, stamp.points.y);

      context.drawImage(
        newStamp,
        stampPoints.x - halfStampSize,
        stampPoints.y - halfStampSize,
        stampSizePx,
        stampSizePx
      );
    }
  });

  drawnLegendStamps[selectedFloor].forEach(stamp => {
    const newStamp = new Image();

    if (stamp.points) {
    
      newStamp.src = stamp.img;

      const stampSizePx = window.innerWidth * stampSize / 100;
      const halfStampSize = stampSizePx / 2;

      const stampPoints = logicalToViewport(stamp.points.x, stamp.points.y);

      context.drawImage(
        newStamp,
        stampPoints.x - halfStampSize,
        stampPoints.y - halfStampSize,
        stampSizePx,
        stampSizePx
      );
    }
  });
}


/*map*/

const loadMap = () => { //最初のマップ描画。
  const map = selectedMap ? selectedMap.blueprint[selectedFloor] : ''; 

  if(!map) return; // URLがない場合は処理しない

  image.src = map;

  image.onload = () => {
    const containerWidth = canvasContainer.clientWidth;
    const containerHeight = canvasContainer.clientHeight;

    const { drawWidth, drawHeight } = calculateImageSize( //切り抜きサイズを計算し、オブジェクトに格納。
        image.width,
        image.height,
        containerWidth,
        containerHeight
    );

    initialDrawWidth = drawWidth;
    initialDrawHeight = drawHeight;

    //画像を中央に配置する座標を translateX/Y に設定
    translateX = (containerWidth - initialDrawWidth) / 2;
    translateY = (containerHeight - initialDrawHeight) / 2;

    // ズーム/パンを初期値に設定。
    currentImageScale = 1;
    imageScaleIndex = 0;

    updateCanvas();
  };
}

const checkDest = (nextScale, nextTranslateX, nextTranslateY) => {

  const logicalWidth = canvasContainer.clientWidth; //キャンバスの親要素の横サイズ
  const logicalHeight = canvasContainer.clientHeight; //キャンバスの親要素の縦サイズ
  const nextDrawWidth = initialDrawWidth * nextScale; //拡大した画像サイズ
  const nextDrawHeight = initialDrawHeight * nextScale; //拡大した画像サイズ

  // X軸の補正
  if (nextDrawWidth <= logicalWidth) {
      // 画像がキャンバスより小さい場合: 中央寄せ
      nextTranslateX = (logicalWidth - nextDrawWidth) / 2;
  } else {
      // 画像がキャンバスより大きい場合: 端が見切れないように制限
      // 画像の左端(nextTranslateX)は、0以下 かつ (キャンバス幅 - 画像幅)以上 である必要がある
      const minX = logicalWidth - nextDrawWidth;
      const maxX = 0;
      nextTranslateX = Math.min(maxX, Math.max(minX, nextTranslateX));
  }

  // Y軸の補正
  if (nextDrawHeight <= logicalHeight) {
      // 中央寄せ
      nextTranslateY = (logicalHeight - nextDrawHeight) / 2;
  } else {
      // はみ出し制限
      const minY = logicalHeight - nextDrawHeight;
      const maxY = 0;
      nextTranslateY = Math.min(maxY, Math.max(minY, nextTranslateY));
    }
}

resizeCanvas(); //物理ピクセル
loadMap();

// ウィンドウリサイズ時にも実行
window.addEventListener('resize', () => {
    resizeCanvas();
    loadMap();
});

/*zoom*/

const zoomByWheel = (e) => { // ズーム処理
  e.preventDefault();

  const delta = e.deltaY ? -(e.deltaY) : e.wheelDelta;
  //e.deltaYが存在すれば、e.deltaYの符号を逆転した値が定義。e.deltaYが存在しなければe.wheelDeltaYが定義。(後者はブラウザ互換性対応)

  let nextScale;

  if (delta > 0) { // 拡大
      nextScale = Math.min(maxScale, currentImageScale + scaleStep); //最大拡大率、現在の拡大率+追加拡大率の両者を比較し、小さい方の値を代入。
  } else { // 縮小
      nextScale = Math.max(minScale, currentImageScale - scaleStep); //最小拡大率、現在の拡大率+追加拡大率の両者を比較し、小さい方の値を代入。
  }

  if (nextScale === currentImageScale) return; //nextScaleが最大もしくは最小である場合は、以降の処理を実施しない。

  // --- 2. ズーム中心点の計算 (Zoom to Mouse) ---
  // マウスの相対位置を取得
  const rect = e.target.getBoundingClientRect(); //camvas要素のビューポート内の位置とサイズを取得。
  //ビューポート座標に対してキャンバス要素の上と左の座標を引く。つまり、キャンバス要素の上と左が0となるマウスカーソルの相対座標を定義。
  const mX = e.clientX - rect.left; 
  const mY = e.clientY - rect.top;

  // 拡大する比率
  const scaleRatio = nextScale / currentImageScale;

  //マウス座標を中心として、画像の新しい左上座標(translate)を計算
  // 新しい座標 = マウス位置 - (マウス位置 - 現在の画像座標) * 比率　(左上の隠れている部分の座標を引いている。)
  let nextTranslateX = mX - (mX - translateX) * scaleRatio;
  let nextTranslateY = mY - (mY - translateY) * scaleRatio;

  // --- 3. 境界値チェック (キャンバスからはみ出し防止 / 中央寄せ) ---

  checkDest(nextScale, nextTranslateX, nextTranslateY);
  
  // --- 4. 値の更新 ---
  currentImageScale = nextScale;
  imageScaleIndex = Math.round((currentImageScale - 1) / scaleStep); //拡大段階を計算。
  translateX = nextTranslateX;
  translateY = nextTranslateY;

  const containerWidth = canvasContainer.clientWidth;
  const containerHeight = canvasContainer.clientHeight;

  if(currentImageScale === minScale){
    translateX = (containerWidth - initialDrawWidth) / 2;
    translateY = (containerHeight - initialDrawHeight) / 2;
  }

  updateCanvas();
};

const disableScroll = () => {
    document.addEventListener("mousewheel", scrollControl, { passive: false });
}

const enableScroll = () => {
    document.removeEventListener("mousewheel", scrollControl, { passive: false });
}

const scrollControl = (e) => {
    e.preventDefault();
}


const zoomUpByButton = () => {
  
  let nextScale;

  if(imageScaleIndex >= 20) {
   return; 
  } else {
    nextScale = Math.min(maxScale, currentImageScale + scaleStep);
  }

  const containerWidth = canvasContainer.clientWidth;
  const containerHeight = canvasContainer.clientHeight;

  const scaleRatio = nextScale / currentImageScale;
  const centerX = containerWidth / 2;
  const centerY = containerHeight /2;

  let nextTranslateX = centerX - (centerX - translateX) * scaleRatio;
  let nextTranslateY = centerY - (centerY - translateY) * scaleRatio;


  checkDest(nextScale, nextTranslateX, nextTranslateY);

  currentImageScale = nextScale;
  imageScaleIndex = Math.round((currentImageScale - 1) / scaleStep); //拡大段階を計算。
  translateX = nextTranslateX;
  translateY = nextTranslateY;

  updateCanvas();
};

const zoomDownByButton = () => {
  
  let nextScale;

  if(imageScaleIndex <= 0) {
   return; 
  } else {
    nextScale = Math.max(minScale, currentImageScale - scaleStep);
  }

  const containerWidth = canvasContainer.clientWidth;
  const containerHeight = canvasContainer.clientHeight;

  const scaleRatio = nextScale / currentImageScale;
  const centerX = containerWidth / 2;
  const centerY = containerHeight /2;

  let nextTranslateX = centerX - (centerX - translateX) * scaleRatio;
  let nextTranslateY = centerY - (centerY - translateY) * scaleRatio;


  checkDest(nextScale, nextTranslateX, nextTranslateY);

  currentImageScale = nextScale;
  imageScaleIndex = Math.round((currentImageScale - 1) / scaleStep); //拡大段階を計算。
  translateX = nextTranslateX;
  translateY = nextTranslateY;

  if(currentImageScale === minScale){
    translateX = (containerWidth - initialDrawWidth) / 2;
    translateY = (containerHeight - initialDrawHeight) / 2;
  }

  updateCanvas();
};

//let checkMoveActive = true;
let press = false;
let translateXBuf = 0;
let translateYBuf = 0;
let mouseDragX, mouseDragY;

const mouseMove = (e) => {

  let rect = e.target.getBoundingClientRect();

  if (press) {
    mouseDragX = e.clientX - rect.left;
    mouseDragY = e.clientY - rect.top;

    translateX = translateXBuf - (mouseX - mouseDragX);
    translateY = translateYBuf - (mouseY - mouseDragY);

    updateCanvas();

  } else {
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }
}


canvas.addEventListener('wheel', (e) =>  {
  zoomByWheel(e);
}, { passive: false }); 
canvas.addEventListener('mouseover', disableScroll); 
canvas.addEventListener('mouseout', enableScroll); 

const buttonZoomUp = document.getElementById('js-zoomUp');
const buttonZoomDown = document.getElementById('js-zoomDown');
buttonZoomUp.addEventListener('click', zoomUpByButton);
buttonZoomDown.addEventListener('click', zoomDownByButton);

canvas.addEventListener('mousedown', () => {
  if(checkMoveActive) {
    translateXBuf = translateX;
    translateYBuf = translateY;
    press = true;
  }
});

canvas.addEventListener('mouseup', () => { 
  press = false;
});

canvas.addEventListener('mouseout',() => { 
  press = false;
});

canvas.addEventListener('mousemove', (e) => { 
  if(checkMoveActive) {
    mouseMove(e);
  }
})



/*draw*/

let isDrag = false;

let currentLinePoints = [];

const drawLine = (e) => {
  const rect = e.target.getBoundingClientRect();
  const vX = e.clientX - rect.left;
  const vY = e.clientY - rect.top;

  if(!isDrag) {
    return;
  }

  context.lineCap = 'round';
  context.lineJoin = 'round';
  
  context.lineWidth = penBoldValue;
  context.strokeStyle = currentColor;

  if(isDrag) {
    //mouseDragX = e.clientX - rect.left;
    //mouseDragY = e.clientY - rect.top;
    context.lineTo(vX, vY);
    context.stroke();

    //mouseX = mouseDragX;
    //mouseY = mouseDragY;

    const logicalPoint = viewportToLogical(vX, vY);
    currentLinePoints.push(logicalPoint);
  }

}

const drawLineStart = (e) => {
  const rect = e.target.getBoundingClientRect();
  const vX = e.clientX - rect.left;
  const vY = e.clientY - rect.top;

  //currentLinePoints = [viewportToLogical(vX, vY)];
  //const lX = vX;
  //const lY = vY;


  context.beginPath();
  context.moveTo(vX, vY); //context.moveTo(lX,lY);
  isDrag = true;
}

const drawLineEnd = () => {
  context.closePath();

  if(isDrag && currentLinePoints.length > 1) {
    
    drawnLines[selectedFloor].push({
      color: currentColor,
      lineWidth: penBoldValue,
      points: currentLinePoints,
    });
  }

  isDrag = false;
  currentLinePoints = [];
}


const isSegmentColliding = (p1, p2, eraserCenter, eraserRadius) => {

  const vp1 = logicalToViewport(p1.x, p1.y);
  const vp2 = logicalToViewport(p2.x, p2.y);
  const distSq1 = Math.pow(vp1.x - eraserCenter.x, 2) + Math.pow(vp1.y - eraserCenter.y, 2);
  const distSq2 = Math.pow(vp2.x - eraserCenter.x, 2) + Math.pow(vp2.y - eraserCenter.y, 2);
  const radiusSq = Math.pow(eraserRadius, 2);
  
  if(distSq1 < radiusSq || distSq2 < radiusSq) {
    return true;
  };

  // 3. 点 (p) と線分 (vp1-vp2) の最短距離を計算
    
    // 線分のベクトル A = vp2 - vp1
    const Ax = vp2.x - vp1.x;
    const Ay = vp2.y - vp1.y;

    // 点 p から vp1 へのベクトル B = p - vp1
    const Bx = eraserCenter.x - vp1.x;
    const By = eraserCenter.y - vp1.y;

    // A と B の内積
    const dotProduct = Ax * Bx + Ay * By;
    
    // A の長さの二乗
    const lenSq = Ax * Ax + Ay * Ay;
    
    let t = dotProduct / lenSq;
    
    // t を 0 から 1 の間にクランプ (最短点が線分上にあることを保証)
    t = Math.max(0, Math.min(1, t));

    // 線分上の最短点 q の座標
    const qx = vp1.x + t * Ax;
    const qy = vp1.y + t * Ay;

    // p と q の距離の二乗
    const distSqSegment = Math.pow(eraserCenter.x - qx, 2) + Math.pow(eraserCenter.y - qy, 2);
    
    // 最短距離が半径より小さいか
    return distSqSegment < radiusSq;

}

let isErasing = false; 

const eraseLine = (e) => {
  const rect = e.target.getBoundingClientRect();
  const vX = e.clientX - rect.left;
  const vY = e.clientY - rect.top;

  if(!isErasing) {
    return;
  }

  const eraserRadius = 8;
  const eraserCenter = {x: vX, y:vY};
  let newDrawnLines = [];

  if (isErasing) {
    drawnLines[selectedFloor].forEach(drawnLine => {
      let currentSegment = [];

      for (let i = 1; i < drawnLine.points.length; i++) {
        const p1 = drawnLine.points[i - 1];
        const p2 = drawnLine.points[i];


        if (isSegmentColliding(p1, p2, eraserCenter, eraserRadius)) {
          //衝突時

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
            currentSegment.push(p1);
          }
          currentSegment.push(p2);
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
}

const canvasLineClear = () => {
  drawnLines[selectedFloor] = [];

  updateCanvas();
};

const canvasStampClear = () => {
  drawnStamps[selectedFloor] = [];

  updateCanvas();
};

const canvasAllClear = () => {
  drawnLines[selectedFloor] = [];
  drawnStamps[selectedFloor] = [];

  updateCanvas();
};

canvas.addEventListener('mousedown', (e) => {
  if (hookSelectedDrawTool ==='pen' && !checkMoveActive) {
    drawLineStart(e);
  } else if(hookSelectedDrawTool === 'eraser' && !checkMoveActive) {
    isErasing = true;
    eraseLine(e);
  }
});

canvas.addEventListener('mouseup', () => {
  drawLineEnd();
  isErasing = false;
});

canvas.addEventListener('mouseout', () => {
  drawLineEnd();
  isErasing = false;
});

canvas.addEventListener('mousemove', (e) => {
  if(hookSelectedDrawTool === 'pen' && !checkMoveActive){
    drawLine(e);
  } else if (hookSelectedDrawTool === 'eraser' && !checkMoveActive) {
    eraseLine(e);
  }
})

const buttonLineClear = document.querySelector('#js-lineClear');

buttonLineClear.addEventListener('click', () => {
  const modal = buttonLineClear.parentElement.parentElement;

  modal.classList.remove('js-setting--active');

  modal.close();
  canvasLineClear();
});

const buttonStampClear = document.querySelector('#js-stampClear');

buttonStampClear.addEventListener('click', () => {
  const modal = buttonStampClear.parentElement.parentElement;

  modal.classList.remove('js-setting--active');
  modal.close();
  canvasStampClear();
});

const buttonAllClear = document.querySelector('#js-allClear');

buttonAllClear.addEventListener('click', () => {
  const modal = buttonAllClear.parentElement.parentElement;

  modal.classList.remove('js-setting--active');
  modal.close();
  canvasAllClear();
});



/*stamp*/
const stampSize = 3;


let stampMode = false
let hookStampMoving = false

const stampPositionToFollowMouse = (e) => {
  const stampSizePx = window.innerWidth * stampSize / 100;
  const halfStampSize = stampSizePx / 2;
  const mX = e.clientX;
  const mY = e.clientY;

  const stampPositionX = mX - halfStampSize;
  const stampPositionY = mY - halfStampSize;

  return { stampPositionX, stampPositionY};
}

const stampPositionToRecord = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const mX = e.clientX - rect.left;
  const mY = e.clientY - rect.top;

  const stampPositionX = mX;
  const stampPositionY = mY;

  return { stampPositionX, stampPositionY};
}

const mouseStamp = (e) => {
  const stamp = new Image();
  const selectedImage = e.target;
  const selectedImageURL = selectedImage.getAttribute('src');
  stamp.src = selectedImageURL;
  stamp.id = 'stamp--' + (drawnStamps[selectedFloor].length + 1);
  stamp.style.width = stampSize + 'vw';
  stamp.style.height = stampSize + 'vw';
  stamp.style.display = 'block';
  stamp.style.position = 'fixed';
  stamp.style.zIndex = '900';
  const {stampPositionX, stampPositionY} = stampPositionToFollowMouse(e);
  stamp.style.left = stampPositionX + 'px';
  stamp.style.top = stampPositionY + 'px';

  canvasContainer.appendChild(stamp);

  const {stampPositionX: rectX, stampPositionY: rectY} = stampPositionToRecord(e);
  const logicalPoint = viewportToLogical(rectX, rectY);

  const stampData = {
    id: stamp.id,
    img: stamp.src,
    points: logicalPoint
  }

  drawnStamps[selectedFloor].push(stampData);
};

const mouseStampMove = (e) => {
  const stamp = document.getElementById(`stamp--${drawnStamps[selectedFloor].length}`);
  const {stampPositionX, stampPositionY} = stampPositionToFollowMouse(e);
  stamp.style.left = stampPositionX + 'px';
  stamp.style.top = stampPositionY + 'px';
};

let stampNumber = 0;

const drawStamp = (e) => {

  stampNumber++;

  const {stampPositionX, stampPositionY} = stampPositionToRecord(e);

  const stamp = stampRelocateMode ? 
    document.getElementById(currentStamp.id) : 
    document.getElementById(`stamp--${drawnStamps[selectedFloor].length}`)

  const logicalPoint = viewportToLogical(stampPositionX, stampPositionY);

  if(stampRelocateMode) {
    const id = currentStamp.id;
    const arrayNumber =  drawnStamps[selectedFloor].findIndex((stamp) => stamp.id === id);
    const arrayStamps = drawnStamps[selectedFloor];

    
    currentStamp.id = `stamp--${stampNumber}`
    currentStamp.points = logicalPoint;
    arrayStamps.splice(arrayNumber, 1);

    drawnStamps[selectedFloor].push(currentStamp);

    currentStamp = {};

  } else {
  drawnStamps[selectedFloor][drawnStamps[selectedFloor].length - 1].points = logicalPoint;
  }
  
  stamp.remove();
}

const isStampColliding = (stampData, pointerCenter, pointerRadius) => {

  const closestX = Math.max(stampData.x, Math.min(pointerCenter.x, stampData.x + stampData.width));
  const closestY = Math.max(stampData.y, Math.min(pointerCenter.y, stampData.y + stampData.height));

  const distSqX = pointerCenter.x - closestX;
  const distSqY = pointerCenter.y - closestY;
  const distanceSq = (distSqX * distSqX) + (distSqY * distSqY);

  const radiusSq = pointerRadius * pointerRadius;

  return distanceSq < radiusSq;
}

let currentStamp;
let currentStamps = [];

const removeStamp = () => {

  const id = currentStamp.id;

  const arrayNumber =  drawnStamps[selectedFloor].findIndex((stamp) => stamp.id === id);
  drawnStamps[selectedFloor][arrayNumber] = {
    id: id,
    img: currentStamp.img,
    points: {}
  };

  updateCanvas();
};

const mouseStampForRelocate = (e) => {
  const id = currentStamp.id;
  const stamp = new Image();
  stamp.src = currentStamp.img;
  stamp.id = id;
  stamp.style.width = stampSize + 'vw';
  stamp.style.height = stampSize + 'vw';
  stamp.style.display = 'block';
  stamp.style.position = 'fixed';
  stamp.style.zIndex = '900';
  const {stampPositionX, stampPositionY} = stampPositionToFollowMouse(e);
  stamp.style.left = stampPositionX + 'px';
  stamp.style.top = stampPositionY + 'px';

  canvasContainer.appendChild(stamp);
}

const mouseStampMoveForRelocate = (e) => {
  const id = currentStamp.id;
  const stamp = document.getElementById(id);
  const {stampPositionX, stampPositionY} = stampPositionToFollowMouse(e);
  stamp.style.left = stampPositionX + 'px';
  stamp.style.top = stampPositionY + 'px';
};

const stamps = document.querySelectorAll('.js-stamp');

let isCheckInRect = false;

//mousedown, mouseupで操作切り分け？

/*
const deleteStampContainer = document.getElementById('js-stampDelete');

deleteStampContainer.addEventListener('click', () => {
  const existingStamp = canvasContainer.lastElementChild;
  const id = existingStamp.getAttribute('id');
  const isCheckMouseStamp = id.slice(0, 7) === 'stamp--';
  if(isCheckMouseStamp) {
    elementForCheck.remove();
    const arrayNumber = drawnStamps[selectedFloor].findIndex((stamp) => stamp.id === idForCheck);
    drawnStamps[selectedFloor].splice(arrayNumber, 1);
  }
});
*/
stamps.forEach(stamp => {
  const modal = document.querySelector('dialog.js-stampSetting');
  stamp.addEventListener('click', (e) => {

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

let stampRelocateMode = false;
let hookStampLocating = false

const deleteStampContainer = document.getElementById('js-stampDelete');

canvasContainer.addEventListener('click', (e) => {

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

document.addEventListener('mousemove', (e) => {
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



/*legendStamp*/
/*
const mouseLegendStamp = (e) => {
  const stamp = new Image();
  const selectedImage = e.target;
  const selectedImageURL = selectedImage.getAttribute('src');
  stamp.src = selectedImageURL;
  stamp.id = 'legendStamp--' + (drawnLegendStamps[selectedFloor].length + 1);
  stamp.style.width = stampSize + 'vw';
  stamp.style.height = stampSize + 'vw';
  stamp.style.display = 'block';
  stamp.style.position = 'fixed';
  stamp.style.zIndex = '900';
  const {stampPositionX, stampPositionY} = stampPositionToFollowMouse(e);
  stamp.style.left = stampPositionX + 'px';
  stamp.style.top = stampPositionY + 'px';

  canvasContainer.appendChild(stamp);

  const {stampPositionX: rectX, stampPositionY: rectY} = stampPositionToRecord(e);
  const logicalPoint = viewportToLogical(rectX, rectY);

  const stampData = {
    id: stamp.id,
    img: stamp.src,
    points: logicalPoint
  }

  drawnLegendStamps[selectedFloor].push(stampData);
};

const mouseLegendStampMove = (e) => {
  const stamp = document.getElementById(`legendStamp--${drawnLegendStamps[selectedFloor].length}`);

  const {stampPositionX, stampPositionY} = stampPositionToFollowMouse(e);
  stamp.style.left = stampPositionX + 'px';
  stamp.style.top = stampPositionY + 'px';
}

let legendStampNumber = 0;

const drawLegendStamp = (e) => {
  legendStampNumber++;

  const {stampPositionX, stampPositionY} = stampPositionToRecord(e);

  const stamp = legendStampRelocateMode ?
    document.getElementById(currentStamp.id) :
    document.getElementById(`legendStamp--${drawnLegendStamps[selectedFloor].length}`);

  const logicalPoint = viewportToLogical(stampPositionX, stampPositionY);

  if(legendStampRelocateMode) {
    const id = currentStamp.id;
    const arrayNumber =  drawnLegendStamps[selectedFloor].findIndex((stamp) => stamp.id === id);
    const arrayStamps = drawnLegendStamps[selectedFloor];

    currentStamp.id = `legendStamp--${legendStampNumber}`
    currentStamp.points = logicalPoint;
    arrayStamps.splice(arrayNumber, 1);

    drawnLegendStamps[selectedFloor].push(currentStamp);
    //drawnStamps[selectedFloor][arrayNumber].points = logicalPoint;

    currentStamp = {};

  } else {
    drawnLegendStamps[selectedFloor][drawnLegendStamps[selectedFloor].length - 1].points = logicalPoint;
  }
  
  stamp.remove();
}

const removeLegendStamp = () => {
  const id = currentStamp.id;

  const arrayNumber =  drawnLegendStamps[selectedFloor].findIndex((stamp) => stamp.id === id);
  drawnLegendStamps[selectedFloor][arrayNumber] = {
    id: id,
    img: currentStamp.img,
    points: {}
  };

  updateCanvas();
}

const mouseLegendStampForRelocate = (e) => {
  const id = currentStamp.id;
  const stamp = new Image();
  stamp.src = currentStamp.img;
  stamp.id = id;
  stamp.style.width = stampSize + 'vw';
  stamp.style.height = stampSize + 'vw';
  stamp.style.display = 'block';
  stamp.style.position = 'fixed';
  stamp.style.zIndex = '900';
  const {stampPositionX, stampPositionY} = stampPositionToFollowMouse(e);
  stamp.style.left = stampPositionX + 'px';
  stamp.style.top = stampPositionY + 'px';

  canvasContainer.appendChild(stamp);
}

const mouseLegendStampMoveForRelocate = (e) => {
  const id = currentStamp.id;
  const stamp = document.getElementById(id);
  const {stampPositionX, stampPositionY} = stampPositionToFollowMouse(e);
  stamp.style.left = stampPositionX + 'px';
  stamp.style.top = stampPositionY + 'px';
};


let legendStampMode;
let legendStampRelocateMode;
let hookLegendStampLocating;
let hookLegendStampMoving;

const legendStamp = document.querySelectorAll('.js-stamp--legend');

legendStamp.forEach(stamp => {
  stamp.addEventListener('click', (e) => {
    const clickedElement = e.target;
    
    const checkLegendStamp = (clickedElement) =>{
      if(clickedElement.classList.contains('js-legendStamp--operator')){
        return clickedElement.parentNode.previousElementSibling;
      } else if(clickedElement.classList.contains('js-legendStamp--ability')) {
        return clickedElement.parentNode;
      } else if(clickedElement.classList.contains('js-legendStamp--gadget')) {
        return clickedElement.parentNode.parentNode;
      }
    };

    const containerForCheck = checkLegendStamp(clickedElement);
    const isCheckActive = containerForCheck.classList.contains('items--active');

    if(!isCheckActive) {
      return;
    } else {
      const elementForCheck = canvasContainer.lastElementChild;
      const idForCheck = elementForCheck.getAttribute('id');
      const isCheckMouseStamp = idForCheck.slice(0, 13) === 'legendStamp--'

      if(isCheckMouseStamp) {
        elementForCheck.remove();
        const arrayNumber = drawnLegendStamps[selectedFloor].findIndex((stamp) => stamp.id === idForCheck);
        drawnLegendStamps[selectedFloor].splice(arrayNumber, 1);
      }

      mouseLegendStamp(e);
      legendStampRelocateMode = false;
      legendStampMode = true;
      hookLegendStampLocating = true;
      isCheckInRect = true;
    }
  });
});
canvasContainer.addEventListener('click', (e) => {
  
  if(legendStampMode && hookLegendStampMoving) {
    //console.log('2:stamp描写');
    drawLegendStamp(e);
    legendStampMode = false;
    legendStampRelocateMode = true;
    hookLegendStampLocating = false;

    //console.log(drawnLegendStamps[selectedFloor]);

    updateCanvas();

  } else if(legendStampRelocateMode && hookLegendStampLocating) {
    //console.log('3:stamp再描写');
    hookLegendStampLocating = false;
    drawLegendStamp(e);
    updateCanvas();

  } else if (legendStampRelocateMode && !hookLegendStampLocating) {
    const rect = e.target.getBoundingClientRect();
    const vX = e.clientX - rect.left;
    const vY = e.clientY - rect.top;
    const pointerCenter = {x: vX, y: vY};
    const pointerRadius = 1;

    drawnLegendStamps[selectedFloor].forEach(drawnLegendStamp => {
      const stampSizePx = window.innerWidth * stampSize / 100;
      const halfStampSize = stampSizePx / 2;
      const stampPoints = logicalToViewport(drawnLegendStamp.points.x, drawnLegendStamp.points.y)
      const stampData = {
        x: stampPoints.x - halfStampSize,
        y: stampPoints.y - halfStampSize,
        width: stampSizePx,
        height: stampSizePx
      }

      if(isStampColliding(stampData, pointerCenter, pointerRadius)) {
        //console.log('4:stamp再選択')

        currentStamps.push(drawnLegendStamp);
      }

      
    })

    for(let i = 0; i < currentStamps.length; i++) {
      if(i !== currentStamps.length - 1) {
        continue;
      }

      currentStamp = currentStamps[i];
      removeLegendStamp(e);
      mouseLegendStampForRelocate(e);
      hookLegendStampLocating = true;
      currentStamps = [];
    }
  }
});

document.addEventListener('mousemove', (e) => {
  const rect = canvasContainer.getBoundingClientRect();
  const mX = e.clientX;
  const mY = e.clientY;
  const stampSizePx = window.innerWidth * stampSize / 100;
  const halfStampSize = stampSizePx / 2;
  const isCheckRect = mX < (rect.left + halfStampSize) ||
    mX > (rect.right - halfStampSize) ||
    mY < (rect.top + halfStampSize) ||
    mY > (rect.bottom - halfStampSize);

  if(isCheckRect) {
    hookLegendStampMoving = false;
  } else {
    hookLegendStampMoving = true;
  }

  if(!isCheckRect) {
    isCheckInRect = false;
  }

  if(legendStampMode && hookLegendStampLocating) {
    if(!hookLegendStampMoving && isCheckInRect) {
      mouseLegendStampMove(e);

    } else if (hookLegendStampMoving && !isCheckInRect){
      mouseLegendStampMove(e);
    }
    
  } else if (legendStampRelocateMode && hookLegendStampLocating) {
    if(hookLegendStampMoving) {
      mouseLegendStampMoveForRelocate(e);
    }
  }
});

*/
/*canvas select*/

/*複数レイヤーの選択透過ロジック。単一レイヤーでの実装のため、使用しない。
canvasContainer.addEventListener('click', (e) => {
  if(e.target === this) {
    console.log('canvasContainer');
  }
});

canvasContainer.addEventListener('click', (e) => {
  if(e.target.tagName.toLowerCase() === 'canvas') {
    const hit = recursiveElementFromPoint (e, canvasContainer, e.target);
    if (!hit) return;
    console.log('object1');
  }
});


const isHit = (canvas, x, y) => {
  const context = canvas.getContext('2d');
  const imgdata = context.getImageData(x, y, 1, 1);
  return imgdata[3] !== 0;
}

const recursiveElementFromPoint = (e, parent, target) => {
  const rect = e.target.getBoundingClientRect();
  const offsetX = e.clientX - rect.left; //mX
  const offsetY = e.clientY - rect.top; //mY

  const isDirectCanvasChild = Array.from(parent.children).includes(target) && (target instanceof HTMLCanvasElement);

  if(isDirectCanvasChild && isHit(target, offsetX, offsetY)) {
    e.preventDefault();
    e.stopPropagation();

    return target;
  }

  const tmpDisplay = target.style.display;
  target.style.display = 'none';
  const under = document.elementFromPoint(e.clientX, e.clientY);
  target.style.display = tmpDisplay;

  if(!under) {
    return null;
  }

  const isUnderDirectCanvasChild = Array.from(parent.children).includes(under) && (under instanceof HTMLCanvasElement);

  if(isUnderDirectCanvasChild) {
    const result = recursiveElementFromPoint(e.parent,under);

    return result;
  }

  e.preventDefault();
  e.stopPropagation();
  eventPropagationSim(under, e);
  return null;
}

const eventPropagationSim = (target, e) => {
  if(e.type === "click" || /^mouse/.test(e.type)) {
    e.preventDefault();
    e.stopPropagation();
    
    const mouseEvent = new MouseEvent(e.type, {
      screenX: e.screenX,
      screenY: e.screenY,
      clientX: e.clientX,
      clientY: e.clientY,
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
      metaKey: e.metaKey,
      button: e.button,
      buttons: e.buttons,
      relatedTarget: e.relatedTarget,
      view: e.view,
      detail: e.detail,
      bubbles: false
    });

    target.dispatchEvent(mouseEvent);
  } else {
    return;
  }
}
*/
