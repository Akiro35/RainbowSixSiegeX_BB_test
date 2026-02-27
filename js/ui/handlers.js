import {
  selectedOperators
} from "../data/operator_pool.js";

import {
  BUTTON_IDS,
  ACTIVE_CLASSNAMES,
  SELECTOR_DATA,
  MODAL_IDS,
  ELEMENT_IDS,
} from "../data/selector.js";

import {
  toggleToolState,
  toggleOperatorButtonStateInLegend,
  OPERATOR_STATE,
  changeBoldState,
  updatePlayerColorState,
  TOOL_STATE,
  TOOL_IDS,
  STAMP_STATE,
  activateStampLocateState,
  toggleStampRocatingState,
  deactivateStampState,
  setActivePointer,
  DRAW_STATE,
  TOUCH_STATE,
} from "../logic/switcher.js";

import {
  deleteSelectedGadget,
  replaceSelectedGadget,
  pushSelectedGadget,
} from "../logic/collection.js";

import {
  adjustMapCenter,
  checkRectColliding,
  getPointerLocalPositions,
  updateCanvasScale
} from "../logic/calculator.js";

import {
  getOperatorDataFromPool,
} from "../logic/factory.js";

import {
  getOperatorIconFromSelection,
  getPlayerName,
  getPlayerColor,
  getButtonElementsById,
  identifyStampContainer,
  getModalElements,
} from "./domExtractor.js";

import {
  applyElementsDeactivation,
  applyElementDeactivation,
  applyElementActivation,
  changeCursorOnCanvas,
  toggleElementActivation,
  showModal,
  applyPlayerNameToLegend,
  applyPlayerNameToSetting,
  applyCurrentBold,
  removeBadge,
  insertBadge,
  updateSeleceteOperatorIconsToSelection,
  applyPlayerColorToLegend,
  hideModal,
  applyDeleteContainerToggle,
  displayCurrentMapName,
  displayExistedFloors,
  displayCurrentFloorName,
  applyConfirmDialogMessage,
  toggleHistoryButtonActive,
} from "./domApplier.js";

import {
  disableDoubleTouch,
  moveCanvasImage,
  pinchCanvasZoom,
  startCanvasImageMoving,
  startLineDraw,
  drawLine,
  eraseLine,
  finishLineDraw,
  updateStaticCanvasCache,
  updateCanvas,
  createStampFollowedMouse,
  isCanvasRectColliding,
  moveStampFollowdMouse,
  isDeleteRectColliding,
  deleteTempStamp,
  drawStamp,
  returnMode,
  startStampRelocate,
  resetToolSelections,
  deactivateGears,
  resetLegendOperatorActivations,
  applyHistory,
  saveHistory,
  shiftHowToUsePage,
  switchInformation,
  initHowToUsePositions,
} from "./controller.js";

import {
  CANVAS_DATA,
  loadMapImage,
  rewriteFloorData,
  rewriteMapData,
} from "./canvasManager.js";
/*****defaultBehaviors*****/

export function handleDoubleTouch(e) {
  const isInteractive = 
    e.target.closest('#' + BUTTON_IDS.zoom.up) ||
    e.target.closest('#' + BUTTON_IDS.zoom.down) ||
    e.target.closest('#' + BUTTON_IDS.history.undo) ||
    e.target.closest('#' + BUTTON_IDS.history.redo) ||
    e.target.closest('#' + ELEMENT_IDS.canvas.container) ||
    e.target.closest(SELECTOR_DATA.legend.icon) ||
    e.target.closest('dialog');

  if(isInteractive) return;

  disableDoubleTouch(e)
};

export function handleDocumentClick(e) {
  const gears = document.getElementById(ELEMENT_IDS.legend.gears);
  const isGearsActive = gears.classList.contains(ACTIVE_CLASSNAMES.gear);
  const isOperatorItemActive = OPERATOR_STATE.isItemsOpen; 

  if(!isGearsActive && !isOperatorItemActive) return; //gearsがdeactiveできない。

  let isContainerColliding = false;

  for(let i = 0; i < Object.keys(SELECTOR_DATA.legend.playerContainer).length; i++) {
    const data = Object.values(SELECTOR_DATA.legend.playerContainer)[i];
    const playerContainer = document.querySelector(data);

    const isColliding = checkRectColliding(e, playerContainer);
    if(isColliding) {
      isContainerColliding = true;
    }
  }

  const isColliding = checkRectColliding(e, gears);
  if(isColliding) {
    isContainerColliding = true;
  }

  if(!isContainerColliding) {
    resetLegendOperatorActivations();
    deactivateGears();
    returnMode();
  }
}

/*****menu*****/

export function handleHowToUseButtonClick(buttonId) {
  shiftHowToUsePage(buttonId);

  const activePage = document.querySelector('.' + ACTIVE_CLASSNAMES.howToUse.page);
  const activePageData = activePage.dataset.howToUse;
  switchInformation(activePageData);
  initHowToUsePositions();
}

/****Left*****/

/*****Tools*****/
/**
 * ツールボタンクリック時のハンドル。1クリック目はアクティブ化、2クリック目はモーダル展開。
 * @param {String} toolId 
 * @param {Elements} elements 
 */
export function handleToolClick(toolId, elements) {
  const classNameToActivate = ACTIVE_CLASSNAMES.tool;
  const buttons = getButtonElementsById(BUTTON_IDS.tool);
  toggleToolState(toolId);
  applyElementsDeactivation(buttons, classNameToActivate);
  applyElementActivation(elements.open, classNameToActivate);
  if(TOOL_STATE.isSettingOpen) {
    showModal(elements.modal);
  }
  changeCursorOnCanvas(toolId)
};

export function handleLineClearClick() {
  const modal = document.getElementById(MODAL_IDS.confirm);
  const textJa = '描画した線をすべて削除しますか？';
  const textEn = 'Are you sure you want to delete all lines?';

  applyConfirmDialogMessage(textJa, textEn);
  showModal(modal);
}

export function handleStampClearClick() {
  const modal = document.getElementById(MODAL_IDS.confirm);
  const textJa = '描画したスタンプをすべて削除しますか？';
  const textEn = 'Are you sure you want to delete all stamps?';

  applyConfirmDialogMessage(textJa, textEn);
  showModal(modal);
}

export function handleAllClearClick() {
  const modal = document.getElementById(MODAL_IDS.confirm);
  const textJa = 'すべての描画(線とスタンプ)を消去しますか？';
  const textEn = 'Are you sure you want to clear everything?';

  applyConfirmDialogMessage(textJa, textEn);
  showModal(modal);
}

export function handleCancelClick() {
  const modal = document.getElementById(MODAL_IDS.confirm);
  hideModal(modal);
}

export function handleOkClick(clearId, CANVAS_DATA) {
  const {selectedData, drawnContents} = CANVAS_DATA;
  const confirmModal = document.getElementById(MODAL_IDS.confirm);
  const eraserSetting = document.getElementById(BUTTON_IDS.toolSetting.eraser);
  hideModal(confirmModal);
  hideModal(eraserSetting, ACTIVE_CLASSNAMES.tool);

  if(clearId === 'lineClear') {
    drawnContents.lines[selectedData.floor] = [];
  } else if (clearId === 'stampClear') {
    drawnContents.stamps[selectedData.floor] = [];
  } else if(clearId === 'allClear') {
    drawnContents.lines[selectedData.floor] = [];
    drawnContents.stamps[selectedData.floor] = [];
  }

  updateStaticCanvasCache(CANVAS_DATA);
  updateCanvas(CANVAS_DATA);
}
/****LegendInLeftBar*****/
/**
 * ボールド設定ボタンのハンドル。選択したボールド設定をアクティブ化。
 * @param {Element} button 
 * @param {String} settingId 
 */
export function handleBoldButtonClick(button, settingId) {
  changeBoldState(button, settingId);
  applyElementActivation(button, ACTIVE_CLASSNAMES.bold[settingId]);
  applyCurrentBold(settingId);
}

/**
 * legendのON / OFFボタンのハンドル。対象のlegendをON/OFFする。
 * @param {{elements: element[], classNamesToActivate: String[]}} legendContents 
 */
export function handleLegendButtonClick(legendContents) {
  for(let i = 0; i <legendContents.elements.length; i++) {
    const element = legendContents.elements[i];
    const classNameToActivate = legendContents.classNamesToActivate[i];
    toggleElementActivation(element, classNameToActivate);
  }
};
/*****canvas******/
export function handleHistoryButton(buttonId, CANVAS_DATA) {
  const {state} = CANVAS_DATA;
  const canUndo = state.history.index > 0;
  const canRedo = state.history.index < state.history.stack.length - 1;
  if(buttonId === 'undo' && canUndo) {
    state.history.index--;
    applyHistory(CANVAS_DATA);
    toggleHistoryButtonActive(CANVAS_DATA);
  }

  if(buttonId === 'redo' && canRedo) {
    state.history.index++;
    applyHistory(CANVAS_DATA);
    toggleHistoryButtonActive(CANVAS_DATA);
  }
}

export function handleMapZoomWheelSpin(e) {
    const {setting, state} = CANVAS_DATA;
  const wheelDelta = e.deltaY ? - (e.deltaY) : e.wheelDelta;
  //memo:e.deltaYが存在すればe.deltaYの符号を逆転した値が定義。
  //memo:e.deltaYが存在しなければe.wheelDeltaYが定義。(ブラウザ互換性対応)

  const isZoomUp = wheelDelta > 0;
  const isZoomDown = !isZoomUp;
  const canvasPositions = getPointerLocalPositions(e);

  updateCanvasScale(CANVAS_DATA, canvasPositions, isZoomUp, isZoomDown);

  if(state.currentImageScale === setting.minScale) {
    adjustMapCenter(CANVAS_DATA);
  }
}

export function handleZoomButtonClick(buttonId) {
  const {context, setting, state} = CANVAS_DATA;
  const container = context.container;
  const isZoomUp = buttonId === Object.keys(BUTTON_IDS.zoom)[0];
  const isZoomDown = buttonId === Object.keys(BUTTON_IDS.zoom)[1];
  const center = {
    vX: container.clientWidth  / 2,
    vY: container.clientHeight / 2
  };

  updateCanvasScale(CANVAS_DATA, center, isZoomUp, isZoomDown);

  if(state.currentImageScale === setting.minScale) {
    adjustMapCenter(CANVAS_DATA);
  }
}

export function handleCanvasPointerDown(e, TOOL_STATE, TOUCH_STATE, CANVAS_DATA) {
  const isMoveMode = TOOL_STATE.activeToolId === TOOL_IDS.move;
  const isPenMode = TOOL_STATE.activeToolId === TOOL_IDS.pen;

  if(TOUCH_STATE.activePointers.size >= 2) return;

  startStampRelocate(e, CANVAS_DATA);

  if(isMoveMode) {
    startCanvasImageMoving(e, TOUCH_STATE, CANVAS_DATA);
  } else if (isPenMode) {
    startLineDraw(e);
  }

  TOUCH_STATE.press = true;
}

export function handleCanvasPointerUp(e, TOOL_STATE, CANVAS_DATA, DRAW_STATE) {
  const {selectedData, drawnContents} = CANVAS_DATA;
  const isPenMode = TOOL_STATE.activeToolId === TOOL_IDS.pen;
  if(isPenMode) {
    finishLineDraw(CANVAS_DATA, DRAW_STATE);
    
    const lastIndex = drawnContents.lines[selectedData.floor].length - 1;
    const isPoint = drawnContents.lines[selectedData.floor][lastIndex].points.length <= 1;
    if(isPoint) {
      drawnContents.lines[selectedData.floor].pop();
    } else {
      saveHistory(CANVAS_DATA);
    }
  }

  TOUCH_STATE.press = false;
}

export function handleCanvasPointerMove(e, TOOL_STATE, TOUCH_STATE, CANVAS_DATA) {
  const {activePointers} = TOUCH_STATE;
  const {context} = CANVAS_DATA;
  const canvasContainer = context.container;
  const isCanvasContainerColliding = checkRectColliding(e, canvasContainer);

  if(!isCanvasContainerColliding) return;

  const isMoveMode = TOOL_STATE.activeToolId === TOOL_IDS.move;
  const isPenMode = TOOL_STATE.activeToolId === TOOL_IDS.pen;
  const isEraserMode = TOOL_STATE.activeToolId === TOOL_IDS.eraser;

  if(activePointers.size >= 3) return;

  if(activePointers.size === 2) {
    pinchCanvasZoom(TOUCH_STATE, CANVAS_DATA);
    return;
  }

  if(isMoveMode) {
    moveCanvasImage(e, TOUCH_STATE, CANVAS_DATA);
  } else if (isPenMode) {
    drawLine(e);
  } else if (isEraserMode) {
    eraseLine(e, CANVAS_DATA);
    updateStaticCanvasCache(CANVAS_DATA);
    updateCanvas(CANVAS_DATA);
  }
}

/*****LegendOnCanvas*****/

/*****Operator*****/
/**
 * legendのオペレータボタンのハンドル。1クリック目でアクティブ化、2クリック目でitem展開。
 * @param {NodeList} operatorButtons 
 * @param {Element} button 
 */
export const handleOperatorButtonInLegendClick = (button) => {
  const operatorContainer = button.parentElement;
  console.log(operatorContainer);
  const operatorId = operatorContainer.dataset.legend;
  const item = operatorContainer.querySelector(SELECTOR_DATA.legend.item);
  const playerColor = getComputedStyle(operatorContainer).borderTopColor;
  
  resetLegendOperatorActivations(operatorId);
  resetToolSelections();
  deactivateGears();
  toggleOperatorButtonStateInLegend(operatorId);
  
  if(OPERATOR_STATE.isOperatorActive) {
    applyElementActivation(operatorContainer, ACTIVE_CLASSNAMES.operator);
    //console.log(playerColor); //TODO:ここで、rgbで出力される。16進数コードで出力されていないので、エラーの元かも。注意。
    updatePlayerColorState(playerColor);
  }

  if(OPERATOR_STATE.isItemsOpen) {
    applyElementActivation(item, ACTIVE_CLASSNAMES.item);
  } else {
    //applyElementDeactivation(item, itemClassNameToActivate);
  }

  //console.log(IS_OPERATOR_ACTIVE); //デバッグ用
  //console.log(IS_ITEMS_OPEN);  //デバッグ用
}

export function handleOperatorColorInLegendClick(e) {
  const playerColorData = getPlayerColor(e);

  applyPlayerColorToLegend(playerColorData);
}

/**
 * legendにプレイヤー名を反映する。
 * @param {Object} e 
 */
export function handleApplyPlayerNameToLegend(e) {
  const playerNameData = getPlayerName(e);

  applyPlayerNameToLegend(playerNameData);
};

/**
 * operatorSettingにプレイヤー名を反映する。
 * @param {Object} e 
 */
export function handleApplyPlayerNameToSetting(e) {
  const playerNameData = getPlayerName(e);

  applyPlayerNameToSetting(playerNameData);
}


/*****gear*****/
/**
 * ギアボタンのハンドル。ギア要素の開閉。
 */
export function handleGearButtonClick() {
  const gear = document.getElementById(ELEMENT_IDS.legend.gears);
  const isActive = gear.classList.contains(ACTIVE_CLASSNAMES.gear);

  if(isActive) {
    returnMode();
    toggleElementActivation(gear, ACTIVE_CLASSNAMES.gear);
  } else {
    resetLegendOperatorActivations();
    console.log(DRAW_STATE);
    toggleElementActivation(gear, ACTIVE_CLASSNAMES.gear);
  }
};

/*****operatorSetting*****/
/**
 * operatorSettingガジェットボタンのハンドル。選択したガジェットのアクティブ化と、legendへの反映。
 * @param operatorData { ReturnType<typeof import("../logic/factory.js").getOperatorDataFromPool}
 * @param {Elements} DOMGadgets 
 * @param {Element} DOMGadgetIcon 
 */
export function handleGadgetButtonInSettingClick(operatorData, DOMGadgets, DOMGadgetIcon) {
  const hasActiveClass = DOMGadgetIcon.classList.contains(ACTIVE_CLASSNAMES.gadget);
  const operators2gadget = ['striker', 'sentry'];
  let gadgetCapacity;

  if(operatorData.operatorName === 'blank') {
    gadgetCapacity = 0;
  } else if (operators2gadget.includes(operatorData.operatorName)) {
    gadgetCapacity = 2;
  } else {
    gadgetCapacity = 1;
  }

  switch (gadgetCapacity) {
    case 0:
      //memo: 何もしない
      break;
    case 1: //memo: operators2Gadgets以外
      if(!hasActiveClass) {
        applyElementsDeactivation(DOMGadgets, ACTIVE_CLASSNAMES.gadget);
        replaceSelectedGadget(operatorData, DOMGadgetIcon);
        applyElementActivation(DOMGadgetIcon, ACTIVE_CLASSNAMES.gadget);
      } else {
        applyElementDeactivation(DOMGadgetIcon, ACTIVE_CLASSNAMES.gadget);
      }
      break;
    case 2: //memo: operators2Gadget
      const gadgetCounter = operatorData.selectedGadgets.length;

      if(!hasActiveClass && gadgetCounter < gadgetCapacity) {
        pushSelectedGadget(operatorData, DOMGadgetIcon);
        applyElementActivation(DOMGadgetIcon, ACTIVE_CLASSNAMES.gadget);
      } else if(!hasActiveClass && gadgetCounter >= gadgetCapacity) {
        applyElementDeactivation(operatorData.selectedGadgets[0].gadgetIcon, ACTIVE_CLASSNAMES.gadget);
        replaceSelectedGadget(operatorData, DOMGadgetIcon);
        applyElementActivation(DOMGadgetIcon, ACTIVE_CLASSNAMES.gadget);
      } else if (hasActiveClass) {
        deleteSelectedGadget(operatorData, DOMGadgetIcon);
        applyElementDeactivation(DOMGadgetIcon, ACTIVE_CLASSNAMES.gadget);
      }
      //console.log(operatorData.selectedGadgets);
      break; 
  }
}

/*****operatorSelection*****/

/**
 * 選択したオペレータに対し、BlankOperatorを上書きする。
 * @param {String} sideKey 
 * @param {String} operatorName 
 */
export function handleSelectedOperatorRemove(sideKey, operatorName) {
  const selectedOperatorIndex = selectedOperators[sideKey].findIndex(operator => operator.operatorName === operatorName);
  const operatorIconContainer = getOperatorIconFromSelection(sideKey, operatorName);
  const operatorBlankData = getOperatorDataFromPool('blank', sideKey);

  selectedOperators[sideKey][selectedOperatorIndex] = operatorBlankData;
  removeBadge(operatorIconContainer);
  updateSeleceteOperatorIconsToSelection(sideKey);
}

/**
 * 選択したオペレータを最初のopereatorBrankに上書きする。
 * @param {Object} e 
 * @param {String} sideKey 
 */
export function handleSelectedOperatorReplace(e, sideKey) {
  const operatorIconContainer = e.currentTarget;
  const clickedOperatorIcon = operatorIconContainer.lastElementChild;
  const operatorName = clickedOperatorIcon.dataset.operatorSelection;
  const operatorData = getOperatorDataFromPool(operatorName, sideKey);
  const blankIndex = selectedOperators[sideKey].findIndex(operator => operator.operatorName === 'blank');
  
  if(blankIndex === -1) return;

  selectedOperators[sideKey][blankIndex] = operatorData;
  insertBadge(sideKey, operatorIconContainer, blankIndex);
  updateSeleceteOperatorIconsToSelection(sideKey);
}

export function handleReturnClick(sideKey) {
  const operatorNames = selectedOperators[sideKey].map((operator) => operator.operatorName);
  const convertedArray = JSON.stringify(operatorNames);

  window.sessionStorage.setItem(`selectedOperator${sideKey}s`, convertedArray);

  const modal = document.getElementById(MODAL_IDS.operatorSelection[sideKey]);
  hideModal(modal);
}


/*****stampSelection*****/
export function handleStampImagePointerDown(e) {
  const stampContainer = identifyStampContainer(e);

  const isItemsActive = stampContainer.classList.contains(ACTIVE_CLASSNAMES.item);
  const isGearsActive = stampContainer.classList.contains(ACTIVE_CLASSNAMES.gear);
  const isStampSelectionActive = stampContainer.hasAttribute('open');
  
  if(!(isItemsActive || isGearsActive || isStampSelectionActive)) return;

  if(isItemsActive) {
    hideModal(stampContainer, ACTIVE_CLASSNAMES.item);
  } else if(isGearsActive) {
    hideModal(stampContainer, ACTIVE_CLASSNAMES.gear);
  } else if(isStampSelectionActive) {
    hideModal(stampContainer);
  }
  
  setActivePointer(e);
  STAMP_STATE.counter++;
  createStampFollowedMouse(e, CANVAS_DATA);
  resetToolSelections();
  resetLegendOperatorActivations();
  activateStampLocateState();
  const deleteContainer = document.getElementById(ELEMENT_IDS.deleteStamp);
  applyElementActivation(deleteContainer, ACTIVE_CLASSNAMES.deleteStamp);
}

export function handleStampImagePointerUp(e) {
  const tempStamp = CANVAS_DATA.context.container.querySelector(SELECTOR_DATA.canvas.tempStamp) ? 
    CANVAS_DATA.context.container.querySelector(SELECTOR_DATA.canvas.tempStamp) : null;
  
  if(tempStamp === null) return;

  const isCanvasContainerColligind = isCanvasRectColliding(e, CANVAS_DATA);
  const isDeleteContainerColliding = isDeleteRectColliding(e);
  
  if(isDeleteContainerColliding || !isCanvasContainerColligind) {
    deleteTempStamp(tempStamp, CANVAS_DATA);
    if(STAMP_STATE.stampMode === 'relocate') {
      saveHistory(CANVAS_DATA);
    }
    returnMode();
    deactivateStampState();
    return;
  }

  if(STAMP_STATE.stampMode && STAMP_STATE.isStampLocating) {
    drawStamp(e);
    returnMode();
    deactivateStampState();
    updateStaticCanvasCache(CANVAS_DATA);
    updateCanvas(CANVAS_DATA);
    saveHistory(CANVAS_DATA);
  }
}

export function handleStampImageMove(e) {
  const isCanvasContainerColligind = isCanvasRectColliding(e, CANVAS_DATA);
  const isDeleteContainerColliding = isDeleteRectColliding(e);

  toggleStampRocatingState(isCanvasContainerColligind);

  if(STAMP_STATE.stampMode === 'locate' && STAMP_STATE.isStampLocating) {
    const stamp = CANVAS_DATA.context.container.querySelector(SELECTOR_DATA.canvas.tempStamp);
    moveStampFollowdMouse(e, stamp);
  } else if(STAMP_STATE.stampMode === 'relocate' && STAMP_STATE.isStampLocating) { //TODO: RelocateMode
    const stamp = CANVAS_DATA.context.container.querySelector(SELECTOR_DATA.canvas.tempStamp);
    moveStampFollowdMouse(e, stamp);
  }

  applyDeleteContainerToggle(isDeleteContainerColliding);
}

/*****mapSelection*****/
export function handleMapClick(e, CANVAS_DATA) {
  const {selectedData} = CANVAS_DATA;
  const mapName = e.currentTarget.dataset.map;

  rewriteMapData(CANVAS_DATA, mapName);
  rewriteFloorData(CANVAS_DATA);
  displayCurrentMapName(mapName);
  loadMapImage(CANVAS_DATA);
  //CanvasのAllclear
  updateStaticCanvasCache(CANVAS_DATA);
  updateCanvas(CANVAS_DATA);

  const modalElements = getModalElements(MODAL_IDS.mapSetting);
  hideModal(modalElements.modal);
  displayExistedFloors(selectedData);
}

/*****floorSelection*****/
export function handleFloorClick(e, CANVAS_DATA) {
  const {selectedData} = CANVAS_DATA;
  const floorName = e.currentTarget.dataset.floor;

  rewriteFloorData(CANVAS_DATA, floorName);
  displayCurrentFloorName(selectedData);
  loadMapImage(CANVAS_DATA);
  updateStaticCanvasCache(CANVAS_DATA);
  updateCanvas(CANVAS_DATA);

  const modalElements = getModalElements(MODAL_IDS.floorSetting);
  hideModal(modalElements.modal);
}