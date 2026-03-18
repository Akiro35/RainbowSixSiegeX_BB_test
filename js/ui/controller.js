import {
  SELECTED_OPERATORS,
} from "../data/operator_pool.js";

import {
  ELEMENT_IDS,
  ACTIVE_CLASSNAMES,
  SELECTOR_DATA,
  BUTTON_IDS,
  SELECTOR_CLASSNAMES,
  HOW_TO_USE_EXPLANATION,
  MODAL_IDS,
 } from "../data/selector.js";

import {
  activateStampRelocateState,
  clearOperatorButtonStateInLegend,
  clearToolState,
  DRAW_STATE,
  OPERATOR_STATE,
  STAMP_STATE,
  TOOL_STATE,
  TOUCH_STATE
} from "../logic/switcher.js";

import {
  getPointerLocalPositions,
  viewportToLogical,
  logicalToViewport,
  isLineColliding,
  isRectColliding,
} from "../logic/calculator.js";

import {
  createExportJSONData,
  createStamp,
  createStampData,
  generateFileName
} from "../logic/factory.js";

import {
  getStampPositionsToFollowMouse,
} from "../logic/calculator.js";

import {
  getCachedImage
} from "../logic/storage.js";

import {
  getStampsAtPointer
} from "../logic/collection.js";

import {
  OPERATOR_ICON_CONTAINERS,
  externalMoladElementsByOpenId,
  getButtonElementsById,
  getModalElements,
  getOperatorDOM,
  getSelectedOperatorData,
} from "./domExtractor.js";

import { 
  showModal,
  hideModal,
  applySelectedOperatorIcon,
  applySelectedOperatorAbility,
  applySelectedOperatorGadgetsToLegend,
  applySelectedOperatorGadgetsToSetting,
  insertBadge,
  applyScaleRatio,
  hideContainerDelayed,
  applyElementActivation,
  applyElementDeactivation,
  applyElementsDeactivation,
  toggleHistoryButtonActive,
  setExplanationPosition,
  setHowToUseRectPosition,
  applyConfirmDialogMessage,
  changeCursorOnCanvas,
} from "./domApplier.js";

import { 
  handleGadgetButtonInSettingClick,
  handleSelectedOperatorRemove,
  handleSelectedOperatorReplace,
} from "./handlers.js";

import {
  applyImportedData,
  CANVAS_DATA
} from "./canvasManager.js";


/*****defaultBehavior*****/
export function disableDoubleTouch(e) {
  const now = (new Date()).getTime();
  if(now - TOUCH_STATE.lastEnd <= 300) {
    e.preventDefault();
  }
  TOUCH_STATE.lastEnd = now;
}

/*****modal*****/

export function initOpenModal({modalId, classNameToActivate = null, otherOpenId = null}) {
  const modalElements1 = getModalElements(modalId);
  const modalElements2 = otherOpenId ? externalMoladElementsByOpenId(modalId, otherOpenId) : undefined;

  if(modalElements1.open) {
    modalElements1.open.addEventListener('click', () => {
      showModal(modalElements1.modal, classNameToActivate);
    });
  }

  if(modalElements2) {
    modalElements2.open.addEventListener('click', () => {
      showModal(modalElements2.modal, classNameToActivate);
    });
  }
};

export function initCloseModal(modalId, classNameToActivate = null) {
  const modalElements = getModalElements(modalId);

  if(modalElements.close) {
    modalElements.close.addEventListener('click', () => {
      hideModal(modalElements.modal, classNameToActivate);
    });
  }
};

export function initClosePreModal(modalId, modalIdToClose, classNameToActivate = null) {
  const modalElements = getModalElements(modalId);
  const modalElementsToClose = getModalElements(modalIdToClose);

  if(modalElements.open) {
    modalElements.open.addEventListener('click', () => {
      hideModal(modalElementsToClose.modal, classNameToActivate);
    });
  }
};

/*****confirm*****/
export function showConfirmDialog(textJa, textEn) {
  const modal = document.getElementById(MODAL_IDS.confirm);
  const cancelButton = document.getElementById(BUTTON_IDS.confirm.cancel);
  const okButton = document.getElementById(BUTTON_IDS.confirm.ok);

  applyConfirmDialogMessage(textJa, textEn)
  showModal(modal);

  return new Promise((resolve) => {
    const newCancelButton = cancelButton.cloneNode(true);
    const newOkButton = okButton.cloneNode(true);
    cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
    okButton.parentNode.replaceChild(newOkButton, okButton);

    newCancelButton.addEventListener('click', () => {
      hideModal(modal);
      resolve(false);
    });

    newOkButton.addEventListener('click', () => {
      hideModal(modal);
      resolve(true);
    });
  });
}

/*****howToUse*****/
export function initHowToUsePositions() {
  const contents = Array.from(document.querySelectorAll(SELECTOR_CLASSNAMES.howToUse.content));
  const pages = contents.map((content) => content.dataset.howToUse);
  
  pages.forEach(page => {
    const explanations = HOW_TO_USE_EXPLANATION[page];
    setExplanationPosition(explanations);
  });

  setHowToUseRectPosition();
}

export function switchInformation(activePageData) {
  resetLegendOperatorActivations();
  deactivateGears();

  if(activePageData === 'page4') {
    const playerContainer = document.querySelector(SELECTOR_DATA.legend.playerContainer.ATK1);
    const item = playerContainer.querySelector(SELECTOR_DATA.legend.item);
    applyElementActivation(playerContainer, ACTIVE_CLASSNAMES.operator);
    applyElementActivation(item, ACTIVE_CLASSNAMES.item);
    initHowToUsePositions();
  }
}

export function shiftHowToUsePage(buttonId) {
  const backButton = document.getElementById(BUTTON_IDS.howToUse.back);
  const forwardButton = document.getElementById(BUTTON_IDS.howToUse.forward);
  const activePage = document.querySelector('.' + ACTIVE_CLASSNAMES.howToUse.page);
  const nextPage = buttonId === 'back' ? 
    activePage.previousElementSibling : activePage.nextElementSibling;
  const activeIndicator = document.querySelector('.' + ACTIVE_CLASSNAMES.howToUse.indicator);
  const nextIndicator = buttonId === 'back' ? 
    activeIndicator.previousElementSibling : activeIndicator.nextElementSibling;

  activePage.classList.remove(ACTIVE_CLASSNAMES.howToUse.page);
  activeIndicator.classList.remove(ACTIVE_CLASSNAMES.howToUse.indicator);
  nextPage.classList.add(ACTIVE_CLASSNAMES.howToUse.page);
  nextIndicator.classList.add(ACTIVE_CLASSNAMES.howToUse.indicator);

  switch (buttonId) {
    case 'back' :
      forwardButton.classList.add(ACTIVE_CLASSNAMES.howToUse.button);
      if(nextPage.previousElementSibling === null) {
        backButton.classList.remove(ACTIVE_CLASSNAMES.howToUse.button);
      }
    break;
    case 'forward' :
      backButton.classList.add(ACTIVE_CLASSNAMES.howToUse.button);
      if(nextPage.nextElementSibling === null) {
        forwardButton.classList.remove(ACTIVE_CLASSNAMES.howToUse.button);
      }
    break;
  }
};

/*****tools*****/
/**
 * ツールボタンをすべて非アクティブ化。//コントローラでよい。
 */
export function resetToolSelections() {
  const toolButtons = getButtonElementsById(BUTTON_IDS.tool);
  clearToolState();
  applyElementsDeactivation(toolButtons, ACTIVE_CLASSNAMES.tool);
};

/*****legend*****/
export function refreshSelectedOperatorsUI() {
  Object.keys(SELECTED_OPERATORS).forEach(sideKey => {
    applySelectedOperatorToLegend(sideKey);
    applySelectedOperatorToSetting(sideKey);
  });
}

export function applySelectedOperatorToLegend(sideKey) {
  for(let i = 0; i < SELECTED_OPERATORS[sideKey].length; i++) {
    const operatorData = SELECTED_OPERATORS[sideKey][i];
    const containerId = ELEMENT_IDS.legend.operatorContainer[sideKey] + `${i + 1}`;
    const operatorDOMData = getOperatorDOM(containerId);
    
    applySelectedOperatorIcon(operatorDOMData.icon, operatorData);
    applySelectedOperatorAbility(operatorDOMData.ability, operatorData);
    applySelectedOperatorGadgetsToLegend(operatorData, containerId);
  }
};

export function applySelectedOperatorToSetting(sideKey) {
  for(let i = 0; i < SELECTED_OPERATORS[sideKey].length; i++) {
    const operatorData = SELECTED_OPERATORS[sideKey][i];
    const settingId = ELEMENT_IDS.operatorSetting.operatorContainer[sideKey] + `${i + 1}`;
    const operatorDOMData = getOperatorDOM(settingId);

    applySelectedOperatorIcon(operatorDOMData.icon, operatorData);
    applySelectedOperatorAbility(operatorDOMData.ability, operatorData);
    applySelectedOperatorGadgetsToSetting(operatorData, settingId, operatorDOMData.gadgetSlots);
  }
};

export function initSelectGadget(sideKey) {
  for(let i = 0; i < SELECTED_OPERATORS[sideKey].length; i++) {
    const settingId = ELEMENT_IDS.operatorSetting.operatorContainer[sideKey] + `${i + 1}`;
    const legendId  = ELEMENT_IDS.legend.operatorContainer[sideKey] + `${i + 1}`;
    const operatorDOMData = getOperatorDOM(settingId);
    const DOMGadgets = operatorDOMData.gadgets;
    
    operatorDOMData.gadgets.forEach(gadget => {
      gadget.addEventListener('click', (e) => {
        const clickedGadget = e.target;
        const operatorData = SELECTED_OPERATORS[sideKey][i];
        handleGadgetButtonInSettingClick(operatorData, DOMGadgets, clickedGadget);
        applySelectedOperatorGadgetsToLegend(operatorData, legendId);
      })
    })
  }
}

/**
 * legendのオペレータをすべて非アクティブ化する。
 * @param {NodeList} operatorButtons 
 * @param {String} targetId 
 */
export function resetLegendOperatorActivations(targetId = null) {
  const operatorButtons = document.querySelectorAll(SELECTOR_CLASSNAMES.operatorButton);
  const operatorContainers = Array.from(operatorButtons).map(operatorButton => operatorButton.parentElement);
  const operatorItems = Array.from(document.querySelectorAll(SELECTOR_DATA.legend.item));
  const itemCloses = Array.from(document.querySelectorAll(SELECTOR_DATA.legend.close));

  clearOperatorButtonStateInLegend(targetId);
  applyElementsDeactivation(operatorContainers, ACTIVE_CLASSNAMES.operator);
  applyElementsDeactivation(operatorItems, ACTIVE_CLASSNAMES.item);
  applyElementsDeactivation(itemCloses, ACTIVE_CLASSNAMES.close);
}

/**
 * ギア要素を非アクティブ化する。
 */
export function deactivateGears() {
  const gear = document.getElementById(ELEMENT_IDS.legend.gears);
  applyElementDeactivation(gear, ACTIVE_CLASSNAMES.gear)
}

/*****canvas*****/
export function updateStaticCanvasCache(CANVAS_DATA) {
  const {selectedData, context, state, drawnContents} = CANVAS_DATA;
  const {cache, mapImage} = context;

  cache.ctx.clearRect(0, 0, cache.el.width, cache.el.height);

  const destX = state.translate.vX;
  const destY = state.translate.vY;
  const destWidth = state.initialLogicalDraw.width * state.currentImageScale;
  const destHeight = state.initialLogicalDraw.height * state.currentImageScale;

  cache.ctx.drawImage(
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

  applyScaleRatio(CANVAS_DATA);

  drawnContents.lines[selectedData.floor].forEach(line => {
    cache.ctx.beginPath();
    cache.ctx.lineCap = 'round';
    cache.ctx.lineJoin = 'round';
    cache.ctx.lineWidth = line.lineWidth;
    cache.ctx.strokeStyle = line.color;
    cache.ctx.globalAlpha = line.opacity;

    if(line.points.length > 0) {
      let startPoint = logicalToViewport(line.points[0].lX, line.points[0].lY);
      cache.ctx.moveTo(startPoint.vX, startPoint.vY);

      for(let i = 1; i < line.points.length; i++) {
        let nextPoint = logicalToViewport(line.points[i].lX, line.points[i].lY);
        cache.ctx.lineTo(nextPoint.vX, nextPoint.vY);
      }

      cache.ctx.stroke();
    }
  });

  drawnContents.stamps[selectedData.floor].forEach(stamp => {
    if(stamp.points) {
      const img = getCachedImage(stamp.img, () => {
        updateStaticCanvasCache(CANVAS_DATA);
        updateCanvas(CANVAS_DATA);
      });

      if(img) {
        const stampSizePx = window.innerWidth * STAMP_STATE.size / 100;
        const halfStampSize = stampSizePx / 2;
        const stampPoints = logicalToViewport(stamp.points.lX, stamp.points.lY);

        cache.ctx.drawImage(
          img,
          stampPoints.vX - halfStampSize,
          stampPoints.vY - halfStampSize,
          stampSizePx,
          stampSizePx
        );
      }
    }
  });
};

export function updateCanvas({context, state}) {
  const {container, main, cache} = context;
  const {tempDraw} = state;
  
  main.ctx.clearRect(0, 0, container.clientWidth, container.clientHeight);

  if(cache.el.width === 0 || cache.el.height === 0) return;
  main.ctx.drawImage(cache.el, 0, 0, container.clientWidth, container.clientHeight);

  if(tempDraw.linePoints.length > 1) {
    main.ctx.save();
    main.ctx.beginPath();
    main.ctx.lineJoin = 'round';
    main.ctx.lineWidth = DRAW_STATE.penBoldValue;
    main.ctx.strokeStyle = DRAW_STATE.currentColor;
    main.ctx.globalAlpha = DRAW_STATE.currentOpacity;

    const startPoint = logicalToViewport(tempDraw.linePoints[0].lX, tempDraw.linePoints[0].lY);
    main.ctx.moveTo(startPoint.vX, startPoint.vY);

    for(let i = 1; i < tempDraw.linePoints.length; i++) {
      const nextPoint = logicalToViewport(tempDraw.linePoints[i].lX, tempDraw.linePoints[i].lY);
      main.ctx.lineTo(nextPoint.vX, nextPoint.vY);
    }

    main.ctx.stroke();
    main.ctx.restore();
  }
}

/*****canvasHistory*****/
export function saveHistory(CANVAS_DATA) {
  const {drawnContents, state} = CANVAS_DATA;
  const {history} = state; 
  const canRedo = history.index < history.stack.length - 1

  if(canRedo) {
    history.stack = history.stack.slice(0, history.index + 1);
  }

  const snapshot = {
    lines: structuredClone(drawnContents.lines),
    stamps: structuredClone(drawnContents.stamps)
  };

  history.stack.push(snapshot);

  if(history.stack.length > history.max) {
    history.stack.shift();
  }

  history.index = history.stack.length - 1;
  toggleHistoryButtonActive(CANVAS_DATA);
}

export function applyHistory(CANVAS_DATA) {
  const  {drawnContents, state} = CANVAS_DATA;

  const snapshot = state.history.stack[state.history.index];

  drawnContents.lines = structuredClone(snapshot.lines);
  drawnContents.stamps = structuredClone(snapshot.stamps);

  updateStaticCanvasCache(CANVAS_DATA);
  updateCanvas(CANVAS_DATA);
}

/*****canvasZoom*****/
export function pinchCanvasZoom(TOUCH_STATE, CANVAS_DATA) { //HACK: calculatorなどに分割できそう
  const {activePointers, lastPinchDistance, lastPinchCenter} = TOUCH_STATE;
  const {setting, state} = CANVAS_DATA;
  const [p1, p2] = Array.from(activePointers.values());
  const canvasContainer = CANVAS_DATA.context.container;
  const rect = canvasContainer.getBoundingClientRect();
  const currentDistance = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
  const currentCenter = {
    vX: (p1.clientX + p2.clientX) / 2 - rect.left,
    vY: (p1.clientY + p2.clientY) / 2 - rect.top
  }
  
  if(lastPinchDistance && lastPinchCenter) {
    const deltaScale = currentDistance / lastPinchDistance;
    const nextScale = Math.min(setting.maxScale, Math.max(setting.minScale, state.currentImageScale * deltaScale));
    const scaleRatio = nextScale / state.currentImageScale;

    state.translate.vX = currentCenter.vX - (lastPinchCenter.vX - state.translate.vX) * scaleRatio;
    state.translate.vY = currentCenter.vY - (lastPinchCenter.vY - state.translate.vY) * scaleRatio;
    state.currentImageScale = nextScale;
    state.imageScaleIndex = Math.round((state.currentImageScale - 1) / setting.scaleStep);
  }
  TOUCH_STATE.lastPinchDistance = currentDistance;
  TOUCH_STATE.lastPinchCenter = currentCenter;
  return;
}

/*****canvasMove*****/
export function startCanvasImageMoving(e, TOUCH_STATE, CANVAS_DATA) {
  const {point} = TOUCH_STATE;
  const {state, context} = CANVAS_DATA;
  const canvasContainer = context.container;
  const rect = canvasContainer.getBoundingClientRect();

  point.vX = e.clientX - rect.left;
  point.vY = e.clientY - rect.top;
  state.translateBuf.vX = state.translate.vX;
  state.translateBuf.vY = state.translate.vY;
  TOUCH_STATE.press = true;
}

export function moveCanvasImage(e, TOUCH_STATE, CANVAS_DATA) {
  const {context, state} = CANVAS_DATA;
  const {point, draggedPoint} = TOUCH_STATE;
  const canvasContainer = context.container;
  const rect = canvasContainer.getBoundingClientRect();

  if(TOUCH_STATE.press) {
    draggedPoint.vX = e.clientX - rect.left;
    draggedPoint.vY = e.clientY - rect.top;
    state.translate.vX = state.translateBuf.vX - (point.vX - draggedPoint.vX);
    state.translate.vY = state.translateBuf.vY - (point.vY - draggedPoint.vY);
  } else {
    point.vX =  e.clientX - rect.left;
    point.vY =  e.clientY - rect.top;
  }
}

/*****canvasDraw*****/
export function resetAllDrawnContents(CANVAS_DATA) {
  CANVAS_DATA.drawnContents = {
    lines: {
      basement2nd: [],
      basement: [],
      floor1st: [],
      floor2nd: [],
      floor3rd: [],
      roof: [],
    },

    stamps: {
      basement2nd: [],
      basement: [],
      floor1st: [],
      floor2nd: [],
      floor3rd: [],
      roof: [],
    },
  }
}

export function clearDrawnContents(CANVAS_DATA, clearId) {
  const {selectedData, drawnContents} = CANVAS_DATA;
  const isLine = clearId === 'lineClear';
  const isStamp = clearId === 'stampClear';
  const isAll = clearId === 'allClear';
  
  if(isLine) {
    drawnContents.lines[selectedData.floor] = [];
  } else if(isStamp) {
    drawnContents.stamps[selectedData.floor] = [];
  } else if(isAll) {
    drawnContents.lines[selectedData.floor] = [];
    drawnContents.stamps[selectedData.floor] = [];
  }

  updateStaticCanvasCache(CANVAS_DATA);
  updateCanvas(CANVAS_DATA);
}

export function startLineDraw(e) {
  const points = getPointerLocalPositions(e);
  const logicalPoints = viewportToLogical(points.vX, points.vY);

  CANVAS_DATA.state.tempDraw.linePoints = [logicalPoints];
}

export function drawLine(e) {
  if(TOUCH_STATE.press) {
  const points = getPointerLocalPositions(e);
  const logicalPoints = viewportToLogical(points.vX, points.vY);

  CANVAS_DATA.state.tempDraw.linePoints.push(logicalPoints);
  }
}

export function finishLineDraw(CANVAS_DATA, DRAW_STATE) {
  const {selectedData, state, drawnContents} = CANVAS_DATA;
  const {currentColor, currentOpacity, penBoldValue} = DRAW_STATE;
  const lineData = {
    color: currentColor,
    lineWidth: penBoldValue,
    opacity: currentOpacity,
    points: [...state.tempDraw.linePoints],
  }

  drawnContents.lines[selectedData.floor].push(lineData);
  state.tempDraw.linePoints = [];
  TOUCH_STATE.press = false;
};

export function eraseLine(e, CANVAS_DATA) {
  if(!TOUCH_STATE.press) return;
  const {selectedData, drawnContents} = CANVAS_DATA;
  const points = getPointerLocalPositions(e);
  const eraserRadius = DRAW_STATE.eraserBoldValue;
  const eraserCenter = {vX: points.vX, vY: points.vY};
  let newDrawnLines = [];

  drawnContents.lines[selectedData.floor].forEach(drawnLine => {
    let currentSegment = [];

    for(let i = 1; i < drawnLine.points.length; i++) {
      const logicalPoint1 = drawnLine.points[i - 1];
      const logicalPoint2 = drawnLine.points[i];

      const isColliding = isLineColliding(logicalPoint1, logicalPoint2, eraserCenter, eraserRadius);

      if(isColliding) {
        if(currentSegment.length > 0) {
          const lineData = {
            color: drawnLine.color,
            lineWidth: drawnLine.lineWidth,
            points: currentSegment,
          }
          newDrawnLines.push(lineData);
        }

        currentSegment = [];
      } else {
        if(currentSegment.length === 0) {
          currentSegment.push(logicalPoint1);
        }
        currentSegment.push(logicalPoint2);
      }
    }

    if(currentSegment.length > 1) {
      const lineData = {
        color: drawnLine.color,
        lineWidth: drawnLine.lineWidth,
        points: currentSegment,
      }
      newDrawnLines.push(lineData);
    }
  })
  drawnContents.lines[selectedData.floor] = newDrawnLines;
}

/*****canvasStamp*****/
export function createStampFollowedMouse(e, CANVAS_DATA, currentStamp) {
  const {selectedData, drawnContents} = CANVAS_DATA;
  const tempStamp = createStamp(e, currentStamp);
  CANVAS_DATA.context.container.appendChild(tempStamp);
}

export function moveStampFollowdMouse(e, stamp) {
  const stampPositions = getStampPositionsToFollowMouse(e)
  stamp.style.left = stampPositions.vX + 'px';
  stamp.style.top = stampPositions.vY + 'px';
}

export function isCanvasRectColliding(e, CANVAS_DATA) {
  const container = CANVAS_DATA.context.container;
  const stampSizePx = window.innerWidth * STAMP_STATE.size / 100;
  const halfStampSize = stampSizePx / 2;
  const adjustment = halfStampSize * -1;
  const isColliding = isRectColliding(e, container, adjustment);

  return isColliding;
}

export function isDeleteRectColliding(e) {
  const deleteContainer = document.getElementById(ELEMENT_IDS.deleteStamp);
  const isColliding = isRectColliding(e, deleteContainer);

  return isColliding;
}

export function deleteTempStamp(tempStamp, CANVAS_DATA) {
  const {selectedData, context, drawnContents} = CANVAS_DATA;
  const deleteContainer = document.getElementById(ELEMENT_IDS.deleteStamp);
  const id = tempStamp.getAttribute('id');
  const arrayNumber = drawnContents.stamps[selectedData.floor].findIndex((stamp) => stamp.id === id);
  
  tempStamp.remove();
  STAMP_STATE.counter--;
  drawnContents.stamps[selectedData.floor].splice(arrayNumber, 1);
  hideContainerDelayed(deleteContainer, ACTIVE_CLASSNAMES.deleteStamp, 500);
}

export function returnMode() {
  const buttons = getButtonElementsById(BUTTON_IDS.tool);
  const [move, pen, eraser] = buttons;

  TOOL_STATE.activeToolId = TOOL_STATE.lastToolId;

  if(TOOL_STATE.lastToolId === 'move') {
    applyElementActivation(move, ACTIVE_CLASSNAMES.tool);
  } else if(TOOL_STATE.lastToolId === 'pen' && !OPERATOR_STATE.activeOperatorId) {
    applyElementActivation(pen, ACTIVE_CLASSNAMES.tool);
  } else if(TOOL_STATE.lastToolId === 'pen' && OPERATOR_STATE.activeOperatorId) {
    const sideKey = OPERATOR_STATE.activeOperatorId.slice(0, 3);
    const playerNumber = OPERATOR_STATE.activeOperatorId.slice(3);
    const playerContainer = document.getElementById(ELEMENT_IDS.legend.operatorContainer[sideKey] + playerNumber);
    applyElementActivation(playerContainer, ACTIVE_CLASSNAMES.operator)
  } else if(TOOL_STATE.lastToolId === "eraser"){
    applyElementActivation(eraser, ACTIVE_CLASSNAMES.tool);
  }

  changeCursorOnCanvas(TOOL_STATE.lastToolId);
}

export function drawStamp(e) {
  const {selectedData, context, drawnContents} = CANVAS_DATA;
  const tempStamp = context.container.querySelector(SELECTOR_DATA.canvas.tempStamp);
  const stampData = createStampData(e, tempStamp);
  const drawnStamp = drawnContents.stamps[selectedData.floor].find(stamp => stamp.id === stampData.id)

  if(drawnStamp) {
    drawnStamp.id = stampData.id;
    drawnStamp.img = stampData.img;
    drawnStamp.points = stampData.points;
    
  } else {
    drawnContents.stamps[selectedData.floor].push(stampData);
  }

  tempStamp.remove();

  const deleteContainer = document.getElementById(ELEMENT_IDS.deleteStamp);
  applyElementDeactivation(deleteContainer, ACTIVE_CLASSNAMES.deleteStamp);
}

export function startStampRelocate(e, CANVAS_DATA) {
  const currentStamps = getStampsAtPointer(e, CANVAS_DATA)
  if(currentStamps.length <= 0) return;
  
  const currentStamp = currentStamps[currentStamps.length - 1];
  hideStamp(currentStamp, CANVAS_DATA);
  createStampFollowedMouse(e, CANVAS_DATA, currentStamp);
  resetToolSelections();
  deactivateGears();
  resetLegendOperatorActivations();
  activateStampRelocateState();
  changeCursorOnCanvas('stamp');
  const deleteContainer = document.getElementById(ELEMENT_IDS.deleteStamp);
  applyElementActivation(deleteContainer, ACTIVE_CLASSNAMES.deleteStamp);
}

function hideStamp(currentStamp, CANVAS_DATA) {
  const {selectedData, drawnContents} = CANVAS_DATA;
  const id = currentStamp.id;
  const stamp = drawnContents.stamps[selectedData.floor].find((stamp) => stamp.id === id);
  
  stamp.points = {};

  updateStaticCanvasCache(CANVAS_DATA);
  updateCanvas(CANVAS_DATA);
};

/*****operatorSetting*****/

export function clearSelectedGadgetsToSetting(sideKey, index) {
  const settingId = ELEMENT_IDS.operatorSetting.operatorContainer[sideKey] + `${index + 1}`;
  const operatorDOMData = getOperatorDOM(settingId);
  
  operatorDOMData.gadgets.forEach(gadget => {
    gadget.classList.remove(ACTIVE_CLASSNAMES.gadget);
  });
}


/*****operatorSelection*****/
/**
 * operatorSelectionの左側、selectedOperatorの構築。アイコンの反映とクリックイベントの付与。
 * @param {String} sideKey 
 */
export function buildSelectedOperatorToSelection(sideKey) {
  for(let i = 0; i < SELECTED_OPERATORS[sideKey].length; i++) {
    const operatorData = SELECTED_OPERATORS[sideKey][i];
    const containerId = ELEMENT_IDS.operatorSelection.selected[sideKey] + `${i + 1}`;
    const operatorDOMData = getOperatorDOM(containerId);

    applySelectedOperatorIcon(operatorDOMData.icon, operatorData);

    operatorDOMData.icon.addEventListener('click', () => {
      const operatorName = SELECTED_OPERATORS[sideKey][i].operatorName;
      handleSelectedOperatorRemove(sideKey, operatorName);
      clearSelectedGadgetsToSetting(sideKey, i);
      refreshSelectedOperatorsUI();
    })
  }
}

/**
 * operatorSelectionの右側、operatorIconの構築。アイコンにバッジの反映とクリックイベントの付与。
 * @param {String} sideKey 
 */
export function buildReselectOperatorToSelection(sideKey) {
  OPERATOR_ICON_CONTAINERS[sideKey].forEach(operatorIconContainer => {
    const operatorIcon = operatorIconContainer.lastElementChild;
    const iconData = getSelectedOperatorData(operatorIcon);
    
    const selectedOperatorIndex = SELECTED_OPERATORS[sideKey].findIndex(operator => operator.operatorName === iconData.name);
    if(selectedOperatorIndex !== -1) {
      insertBadge(sideKey, operatorIconContainer, selectedOperatorIndex);
    }

    operatorIconContainer.addEventListener('click', (e) => {
      const isSelected = operatorIconContainer.firstElementChild.classList.contains('is-selected');
      const clickedIcon = e.currentTarget.lastElementChild;
      const index = SELECTED_OPERATORS[sideKey].findIndex(operator => operator.operatorName === clickedIcon.dataset.operatorSelection);
      if(isSelected) {
        //console.log('remove');
        const operatorName = operatorIconContainer.lastElementChild.dataset.operatorSelection;
        handleSelectedOperatorRemove(sideKey, operatorName);
        //legend更新
        clearSelectedGadgetsToSetting(sideKey, index);
        refreshSelectedOperatorsUI();
      } else {
        //console.log('replace');
        handleSelectedOperatorReplace(e, sideKey);
        //legend更新
        refreshSelectedOperatorsUI();
      }
    })
  })
}


/*****JSON*****/
/*****export*****/
export async function executeFileSave(blob, fileName, fileTypeDesc, mimeType) {
  if('showSaveFilePicker' in window && window.isSecureContext) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: fileTypeDesc,
          accept: { [mimeType]: [`.${fileName.split('.').pop()}`]}
        }],    
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } catch (error) {
      if(error.name === 'AbortError') return false;
      console.warn('Modern save failed, falling back...', error);
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
  return true;
}

export async function saveTacticsJSON(CANVAS_DATA) {
  const {selectedData} = CANVAS_DATA;
  const jsonString = createExportJSONData(CANVAS_DATA, "json");
  const fileName = generateFileName(
    selectedData.map.mapName || "memo",
    selectedData.floor ||"",
    "json"
  );

  const blob = new Blob([jsonString], { type: "application/json" });
  
  return await executeFileSave(blob, fileName, 'JSON Files', 'application/json');
}

export async function saveTaciticsImageWithMetadata(CANVAS_DATA) {
  const {selectedData, context} = CANVAS_DATA;
  const jsonString = createExportJSONData(CANVAS_DATA, "image");
  const fileName = generateFileName(
    selectedData.map.mapName || "memo",
    selectedData.floor || "",
    "png"
  );

  try {
    const imageBlob = await new Promise(resolve => context.main.el.toBlob(resolve, 'image/png'));
    if(!imageBlob) throw new Error("Canvas blob creation failed");

    const encoder = new TextEncoder();
    const jsonUnit8 = encoder.encode(jsonString);
    const identifier = "--R6SX-DATA-START--";

    const conbinedBlob = new Blob([imageBlob, identifier, jsonUnit8], {type: 'image/png'});

    return await executeFileSave(conbinedBlob, fileName, 'PNG Image', 'image/png');  
  } catch (error) {
    console.error('Image Export Error:', error);
    alert('画像の書き出しに失敗しました。');
    return false;
  }
}

/*****import*****/
export async function importJSONData(file) {
  const textJa = '読み込んだマップの全フロアに描画を上書きしますか。';
  const textEn = 'Overwrite all floors with the loaded map drawing?';

  const isConfirmed = await showConfirmDialog(textJa, textEn);

  if(!isConfirmed) return;

  const data = await parseTacticsFile(file);
  applyImportedData(data, CANVAS_DATA);

  const modalElements = getModalElements(MODAL_IDS.file);
  hideModal(modalElements.modal);
}

export async function importPNGData(file) {
  const textJa = '読み込んだマップの該当するフロアに描画を上書きしますか。';
  const textEn = 'Overwrite the relevant floors with the loaded map drawing?';

  const isConfirmed = await showConfirmDialog(textJa, textEn);

  if(!isConfirmed) return;

  const data = await parseTacticsFile(file);
  applyImportedData(data, CANVAS_DATA);

  const modalElements = getModalElements(MODAL_IDS.file);
  hideModal(modalElements.modal);
}

export async function pickTacticsFile() {
  if('showOpenFilePicker' in window && window.isSecureContext) {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ 
          description: 'Tactics Files (JSON/PNG)',
          accept: {
            'application/json': ['.json'],
            'image/png': ['.png']
          }
        }],
        multiple: false,
      });
      return await handle.getFile();
    } catch (error) {
      if (error.name === 'AbortError') return null;
      throw error;
    }
  }

  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json,.png,image/png';
    input.onchange = () => resolve(input.files[0]);
    input.click();
  });
}

export async function extractMetadataFromImage(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder();
    const content = decoder.decode(arrayBuffer);

    const identifier = "--R6SX-DATA-START--";
    const index = content.lastIndexOf(identifier);

    if(index === -1) {
      throw new Error('この画像には作戦データが含まれていません。');
    }

    const jsonString = content.slice(index + identifier.length);
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('画像の解析に失敗しました: ' + error.message);
  }
}

export async function parseTacticsFile(file) {
  if(!file) return null;

  const isJSON = file.type === "application/json" || file.name.endsWith('.json');
  const isPNG = file.type === "image/png" || file.name.endsWith('.png');

  try {
    let data;

    if(isJSON) {
      const text = await file.text();
      data = JSON.parse(text);
    } else if(isPNG) {
      data = await extractMetadataFromImage(file);
    } else {
      alert("JSONまたはPNGファイルを選択してください。");
      return null;
    }

    if(data.appName !== "R6SX-Briefing-Board") {
      throw new Error('このアプリのデータではありません。');
    }

    return data;
  } catch (error) {
    alert('読み込みエラー:' + error.message);
    return null;
  }
}