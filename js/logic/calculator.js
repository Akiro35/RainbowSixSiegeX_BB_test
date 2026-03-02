import { 
  STAMP_STATE,
} from "./switcher.js";

import {
  CANVAS_DATA,
} from "../ui/canvasManager.js";

/**
 * viewportにおける座標
 * @typedef {Object} viewportPositions
 * @property {number} vX - viewportにおけるX座標
 * @property {number} vY - viewportにおけるY座標
 */

/**
 * 変換後の論理座標
 * @typedef {Object} logicalPositions
 * @property {number} lX - 論理X座標
 * @property {number} lY - 論理Y座標
 */

/**
 * スタンプの配置データ
 * @typedef {Object} stampData
 * @property {string} id - スタンプのID
 * @property {string} img - スタンプのイメージパス
 * @property {logicalPositions} points - スタンプ描写座標
 */

/**
 * スタンプの衝突範囲
 * @typedef {Object} stampHitbox
 * @property {number} vX - スタンプ左端のviewport座標
 * @property {number} vY - スタンプ上端のviewport座標
 * @property {number} width - スタンプの幅(width)
 * @property {number} height - スタンプの高さ(height)
 */


/**
 * イベントターゲットに対するポインタの相対座標を取得する。
 * @param {MouseEvent | Touch} e - マウスイベントまたはタッチオブジェクト 
 * @returns {viewportPositions} - 要素内のviewPortにおける相対座標
 */
export function getPointerLocalPositions(e) {
  const rect = e.target.getBoundingClientRect();
  const rectX = e.clientX - rect.left;
  const rectY = e.clientY - rect.top;

  return {vX: rectX, vY: rectY};
}

/**
 * ポインタと要素の矩形範囲が衝突しているかチェックする。
 * @param {MouseEvent | Touch} e - マウスイベントまたはタッチオブジェクト
 * @param {HTMLElement} element - 衝突チェックを行う対象のDOM要素
 * @param {number} [adjustment=0] - 判定範囲を内側または外側に広げるための調整値(px) 初期値0
 * @returns {boolean} - 衝突しているときtrue
 */
export function isRectColliding(e, element, adjustment = 0) {
  const rect = element.getBoundingClientRect();
  const vX = e.clientX;
  const vY = e.clientY;
  const isColliding = vX > (rect.left + adjustment)&&
    vX < (rect.right + adjustment)&&
    vY > (rect.top + adjustment) &&
    vY < (rect.bottom + adjustment);
  
  return isColliding;
}


/**
 * ポインタとスタンプの衝突判定
 * @param {stampHitbox} stampHitbox - スタンプの衝突判定範囲
 * @param {viewportPositions} pointerCenter - ポインタの中心座標
 * @param {number} pointerRadius ポインタの判定半径
 * @returns {boolean} - 衝突している場合はtrue
 */
export function isStampColliding(stampHitbox, pointerCenter, pointerRadius) {
  const closestX = Math.max(stampHitbox.vX, Math.min(pointerCenter.vX, stampHitbox.vX + stampHitbox.width));
  const closestY = Math.max(stampHitbox.vY, Math.min(pointerCenter.vY, stampHitbox.vY + stampHitbox.height));

  const distSquaredX = pointerCenter.vX - closestX;
  const distSquaredY = pointerCenter.vY - closestY;
  const distanceSquared = (distSquaredX * distSquaredX) + (distSquaredY * distSquaredY);
  const radiusSquared = pointerRadius * pointerRadius;

  return distanceSquared < radiusSquared;
};

/**
 * ポインタと描画線の衝突判定
 * @param {logicalPositions} logicalPoint1 - 線分の始点の論理座標
 * @param {logicalPositions} logicalPoint2 - 線分の終点の論理座標
 * @param {viewportPositions} eraserCenter - 消しゴムのの中心座標 
 * @param {viewportPositions} eraserRadius - 消しゴムのの判定範囲 
 * @returns {boolean} - 線分が消しゴムの円内に入っていればtrue
 */
export function isLineColliding(logicalPoint1, logicalPoint2, eraserCenter, eraserRadius) {
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
 * @param {Number} vX - viewportにおけるX座標
 * @param {Number} vY - viewportにおけるY座標
 * @returns {logicalPositions} - 変換後の論理座標 
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
 * @param {Number} lX - 論理X座標
 * @param {Number} lY - 論理Y座標
 * @returns {viewportPositions} - 変換後のviewport座標
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


/**
 * スタンプの中心のポインタ座標を取得する
 * @param {MouseEvent | Touch} e - マウスイベントまたはタッチオブジェクト
 * @returns {viewportPositions} - スタンプの中心のviewport座標 
 */
export function getStampPositionsToFollowMouse(e) {
  const stampSizePx = window.innerWidth * STAMP_STATE.size / 100;
  const halfStampSize = stampSizePx / 2;
  const viewportX = e.clientX;
  const viewportY = e.clientY;
  const vXadjusted = viewportX - halfStampSize;
  const vYadjusted = viewportY - halfStampSize;

  return {vX: vXadjusted, vY: vYadjusted};
}

/**
 * スタンプのcanvasコンテナにおけるviewport座標を取得する
 * @param {MouseEvent | Touch} e - マウスイベントまたはタッチオブジェクト 
 * @returns {viewportPositions} - canvas内の相対的なviewport座標
 */
export function getStampPositionsToRecord(e) {
  const rect = CANVAS_DATA.context.container.getBoundingClientRect();
  const rectX = e.clientX - rect.left;
  const rectY = e.clientY - rect.top;
  return {vX: rectX, vY: rectY};
}

/*****canvas*****/
/**
 * キャンバスの解像度をデバイスのピクセル比(DPR)に合わせて最適化し、リサイズする。
 * @param {Object} param0 - CANVAS_DATAオブジェクト
 * @param {import("../ui/canvasManager.js").CanvasContext} param0.context - CANVAS_DATAのcontext情報
 */
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


/**
 * マップサイズの計算
 * @param {Object} param0 - CANVAS_DATAオブジェクト
 * @param {import("../ui/canvasManager.js").CanvasContext} param0.context - CANVAS_DATAのcontext情報
 * @returns {{mapDrawWidth: number, mapDrawHeight: number}} 
 */
export function calculateMapImageSize({context}) {
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


/**
 * CANVAS_DATAにマップの状態を適用する
 * @param {import("../ui/canvasManager.js").FullCanvasDataStructure} CANVAS_DATA 
 */
export function initMapImageSize(CANVAS_DATA) {
  const {context, state} = CANVAS_DATA;
  const {mapDrawWidth, mapDrawHeight} = calculateMapImageSize(CANVAS_DATA);

  state.initialLogicalDraw.width = mapDrawWidth;
  state.initialLogicalDraw.height = mapDrawHeight;
  state.translate.vX = (context.container.clientWidth  - state.initialLogicalDraw.width)  / 2;
  state.translate.vY = (context.container.clientHeight - state.initialLogicalDraw.height) / 2;
  state.currentImageScale = 1;
  state.imageScaleIndex = 0;
}

/*****zoom*****/

/**
 * 拡大/縮小を実行するため、CANVAS_DATAの値を更新する
 * @param {import("../ui/canvasManager.js").FullCanvasDataStructure} CANVAS_DATA 
 * @param {viewportPositions} positions - 拡縮の中心となるビューポート座標
 * @param {boolean} isZoomUp - 拡大を実行する場合true
 * @param {boolean} isZoomDown - 縮小を実行する場合true
 * @returns {void}
 */
export function updateCanvasScale(CANVAS_DATA, positions, isZoomUp, isZoomDown ) {
  const {context, setting, state} = CANVAS_DATA;
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

/**
 * 拡大縮小によりずれたマップの中心を修正する。(CANVAS_DATAの値を直接更新する)
 * @param {import("../ui/canvasManager.js").FullCanvasDataStructure} CANVAS_DATA 
 */
export function adjustMapCenter(CANVAS_DATA) {
  const {context, state} = CANVAS_DATA;
  state.translate.vX = (context.container.clientWidth - state.initialLogicalDraw.width)  / 2;
  state.translate.vY = (context.container.clientHeight - state.initialLogicalDraw.height) / 2;
}


/*****stamp*****/

/**
 * スタンプから、衝突範囲(ヒットボックスを返す)
 * @param {stampData} drawnStamp - 描写済みのスタンプ
 * @returns {stampHitbox}
 */
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