import { CANVAS_DATA } from "../ui/canvasManager.js";
import { STAMP_STATE } from "./switcher.js";

export function getPointerLocalPositions(e) {
  const rect = e.target.getBoundingClientRect();
  const rectX = e.clientX - rect.left;
  const rectY = e.clientY - rect.top;

  return {vX: rectX, vY: rectY};
}

export function checkRectColliding(e, element, adjustment = 0) { //HACK: 名前をisに変える
  const rect = element.getBoundingClientRect();
  const vX = e.clientX;
  const vY = e.clientY;
  const isRectColliding = vX > (rect.left + adjustment)&&
    vX < (rect.right + adjustment)&&
    vY > (rect.top + adjustment) &&
    vY < (rect.bottom + adjustment);
  
  return isRectColliding;
}


export function isStampColliding(stampHitbox, pointerCenter, pointerRadius) {
  const closestX = Math.max(stampHitbox.vX, Math.min(pointerCenter.vX, stampHitbox.vX + stampHitbox.width));
  const closestY = Math.max(stampHitbox.vY, Math.min(pointerCenter.vY, stampHitbox.vY + stampHitbox.height));

  const distSquaredX = pointerCenter.vX - closestX;
  const distSquaredY = pointerCenter.vY - closestY;
  const distanceSquared = (distSquaredX * distSquaredX) + (distSquaredY * distSquaredY);
  const radiusSquared = pointerRadius * pointerRadius;

  return distanceSquared < radiusSquared;
};


export function checkLineColliding(logicalPoint1, logicalPoint2, eraserCenter, eraserRadius) { //HACK: 名前をisに変える
  const localPoint1 = logicalToViewport(logicalPoint1.lX, logicalPoint1.lY);
  const localPoint2 = logicalToViewport(logicalPoint2.lX, logicalPoint2.lY);
  const distSquared1 = Math.pow(localPoint1.vX - eraserCenter.vX, 2) + Math.pow(localPoint1.vY - eraserCenter.vY, 2);
  const distSquared2 = Math.pow(localPoint2.vX - eraserCenter.vX, 2) + Math.pow(localPoint2.vY - eraserCenter.vY, 2);
  const radiusSquared = Math.pow(eraserRadius, 2);

  if(distSquared1 < radiusSquared || distSquared2 < radiusSquared) {
    return true;
  }

  const Ax = localPoint2.vX - localPoint1.vX;
  const Ay = localPoint2.vY - localPoint1.vY;
  const Bx = eraserCenter.vX - localPoint1.vX;
  const By = eraserCenter.vY - localPoint1.vY;

  const dotProduct = Ax * Bx + Ay * By;
  const lenSq = Ax * Ax + Ay * Ay;

  let t = dotProduct / lenSq;

  t = Math.max(0, Math.min(1, t));

  const qx = localPoint1.vX + t * Ax;
  const qy = localPoint1.vY + t * Ay;

  const distSquaredSegment = Math.pow(eraserCenter.vX - qx, 2) + Math.pow(eraserCenter.vY - qy, 2);
  return distSquaredSegment < radiusSquared;
}

/**
 * ビューポート座標から論理座標に変換
 * @param {Number} vX 
 * @param {Number} vY 
 * @returns {{lX: Number, lY: Number}}
 */
export function viewportToLogical(vX, vY) {
  const {initialLogicalDraw, translate, currentImageScale} = CANVAS_DATA.state;
  const drawX = vX - translate.vX;
  const drawY = vY - translate.vY;

  const scaledX = drawX / currentImageScale;
  const scaledY = drawY / currentImageScale;

  const lX = scaledX / initialLogicalDraw.width;
  const lY = scaledY / initialLogicalDraw.height;

  return {lX: lX, lY: lY};
}

/**
 * 論理座標からビューポート座標に変換
 * @param {Number} lX 
 * @param {Number} lY 
 * @returns {{vX: Number, vY: Number}}
 */
export function logicalToViewport(lX, lY) {
  const {initialLogicalDraw, translate, currentImageScale} = CANVAS_DATA.state;
  const scaledX = lX * initialLogicalDraw.width;
  const scaledY = lY * initialLogicalDraw.height;

  const drawX = scaledX * currentImageScale;
  const drawY = scaledY * currentImageScale;

  const vX = drawX + translate.vX;
  const vY = drawY + translate.vY;

  return {vX: vX, vY: vY};
}

export function getStampPositionsToFollowMouse(e) {
  const stampSizePx = window.innerWidth * STAMP_STATE.size / 100;
  const halfStampSize = stampSizePx / 2;
  const viewportX = e.clientX;
  const viewportY = e.clientY;
  const vXadjusted = viewportX - halfStampSize;
  const vYadjusted = viewportY - halfStampSize;

  return {vX: vXadjusted, vY: vYadjusted};
}

export function getStampPositionsToRecord(e) {
  const rect = CANVAS_DATA.context.container.getBoundingClientRect();
  const rectX = e.clientX - rect.left;
  const rectY = e.clientY - rect.top;
  return {vX: rectX, vY: rectY};
}

/*****canvas*****/
export function resizeCanvas({context}) {
  const resolutionMultiplier = 1;
  const dpr = window.devicePixelRatio || 1;
  const scaleFactor = dpr * resolutionMultiplier;
  const { main, cache, container } = context; 

  main.el.width  = container.clientWidth  * scaleFactor;
  main.el.height = container.clientHeight * scaleFactor;
  cache.el.width  = container.clientWidth  * scaleFactor;
  cache.el.height = container.clientHeight * scaleFactor;

  main.el.style.width = `${container.clientWidth}px`;
  main.el.style.height = `${container.clientHeight}px`;

  main.ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
  cache.ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
  
  main.ctx.imageSmoothingEnabled = false;
  cache.ctx.imageSmoothingEnabled = false;
};

export function calculateMapImageSize(context) {
  const {container, mapImage} = context;
  const mapImageAspectRatio = mapImage.width / mapImage.height;
  const canvasContainerAspectRatio = container.clientWidth / container.clientHeight;

  let mapDrawWidth, mapDrawHeight;

  if (mapImageAspectRatio < canvasContainerAspectRatio) { 
    //memo:コンテナよりも縦長の画像は、上下に合わせる。
    mapDrawHeight = container.clientHeight;
    mapDrawWidth = mapDrawHeight * mapImageAspectRatio;
  } else {
    //memo:コンテナよりも横長の画像は左右に合わせる。
    mapDrawWidth = container.clientWidth;
    mapDrawHeight = mapDrawWidth / mapImageAspectRatio;
  }

  return { mapDrawWidth, mapDrawHeight };
}

export function initMapImageSize(CANVAS_DATA) {
  const {context, state} = CANVAS_DATA;
  const {mapDrawWidth, mapDrawHeight} = calculateMapImageSize(context);

  state.initialLogicalDraw.width = mapDrawWidth;
  state.initialLogicalDraw.height = mapDrawHeight;
  state.translate.vX = (context.container.clientWidth  - state.initialLogicalDraw.width)  / 2;
  state.translate.vY = (context.container.clientHeight - state.initialLogicalDraw.height) / 2;
  state.currentImageScale = 1;
  state.imageScaleIndex = 0;
}

export function updateCanvasScale(canvasData, positions, isZoomUp, isZoomDown ) {
  const {context, setting, state} = canvasData;
  let nextScale;
  
  if(isZoomUp) { //memo: 拡大
    nextScale = Math.min(setting.maxScale, state.currentImageScale + setting.scaleStep);
  } else { //memo: 縮小
    nextScale = Math.max(setting.minScale, state.currentImageScale - setting.scaleStep);
  }

  if(isZoomUp && state.imageScaleIndex >= setting.maxScale * 5) return;
  if(isZoomDown && state.imageScaleIndex <= 0) return;

  const scaleRatio = nextScale / state.currentImageScale;

  let nextTranslateX = positions.vX - (positions.vX - state.translate.vX) * scaleRatio;
  let nextTranslateY = positions.vY - (positions.vY - state.translate.vY) * scaleRatio;

  state.currentImageScale = nextScale;
  state.imageScaleIndex = Math.round((state.currentImageScale -1) / setting.scaleStep)
  state.translate.vX = nextTranslateX;
  state.translate.vY = nextTranslateY;
}

export function adjustMapCenter(canvasData) {
  const {context, state} = canvasData;
  state.translate.vX = (context.container.clientWidth - state.initialLogicalDraw.width)  / 2;
  state.translate.vY = (context.container.clientHeight - state.initialLogicalDraw.height) / 2;
}

export function getStampHitbox(drawnStamp) {
  const stampSizePx = window.innerWidth * STAMP_STATE.size / 100;
  const halfStampSize = stampSizePx / 2;
  const stampPoints = logicalToViewport(drawnStamp.points.lX, drawnStamp.points.lY);
  const stampHitbox = {}

  stampHitbox.vX = stampPoints.vX - halfStampSize;
  stampHitbox.vY = stampPoints.vY - halfStampSize;
  stampHitbox.width = stampSizePx;
  stampHitbox.height = stampSizePx;

  return stampHitbox;
}