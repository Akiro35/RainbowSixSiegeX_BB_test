import {
  ACTIVE_CLASSNAMES,
  BUTTON_IDS
} from "../data/selector.js"

import {
  CANVAS_DATA
} from "../ui/canvasManager.js"


export const TOOL_IDS = {
  move: 'move',
  pen: 'pen',
  eraser: 'eraser',
}

export const TOOL_STATE = {
  activeToolId: TOOL_IDS.move,
  lastToolId: TOOL_IDS.move,
  isSettingOpen: false,
}

export const OPERATOR_STATE = {
  activeOperatorId: null,
  isOperatorActive: false,
  isItemsOpen: false,
}


export const DRAW_STATE = {
  currentColor: '#ffffff',
  currentPenColor: '#ffffff',
  currentPlayerColor: null,
  currentOpacity: 1.0,
  penBoldValue: 2,
  eraserBoldValue: 8,
}

export const STAMP_STATE = {
  counter: 0,
  size: 3,
  stampMode: false,
  isStampLocating: false,
  isCheckInRect: false,
}

export const TOUCH_STATE = {
  press: false,
  activePointers: new Map(),
  lastEnd: 0,
  lastPinchDistance: null,
  lastPinchCenter: null,
  point: {
    vX: null,
    vY: null,
  },
  draggedPoint: {
    vX: null,
    vY: null,
  }
}

/*****touch*****/
export function setActivePointer(e) {
  CANVAS_DATA.context.main.el.setPointerCapture(e.pointerId);
  TOUCH_STATE.activePointers.set(e.pointerId, e);
  //console.log(TOUCH_STATE.activePointers);
}

export function resetActivePointer(e) {
  TOUCH_STATE.activePointers.delete(e.pointerId, e);
  //console.log(TOUCH_STATE.activePointers);
  if(TOUCH_STATE.activePointers.size < 2) {
    TOUCH_STATE.lastPinchDistance = null;
    TOUCH_STATE.lastPinchCenter = null;
  }
}

/*****tools*****/

/**
 * ツールステータススイッチ
 * @param {String} targetId - 選択したツールID
 * @returns {boolean} - セッティング画面展開フラグ
 */

export function toggleToolState(targetId) {
  const isDrawTool = (targetId === TOOL_IDS.pen || targetId === TOOL_IDS.eraser);
  
  if(targetId === TOOL_IDS.pen) {
    DRAW_STATE.currentColor = DRAW_STATE.currentPenColor;
  }
  
  if(TOOL_STATE.activeToolId !== targetId || OPERATOR_STATE.activeOperatorId) {
    TOOL_STATE.activeToolId = targetId;
    TOOL_STATE.lastToolId = targetId;
    TOOL_STATE.isSettingOpen = false;
    OPERATOR_STATE.activeOperatorId = null;
    OPERATOR_STATE.isOperatorActive = false;
    OPERATOR_STATE.isItemsOpen = false;
  }

  if(!isDrawTool) return;
  
  const toolButton = document.getElementById(BUTTON_IDS.tool[targetId]);
  const isToolActive = toolButton.classList.contains(ACTIVE_CLASSNAMES.tool);
  
  if(isToolActive) {
    TOOL_STATE.isSettingOpen = true;
  }
};

/**
 * ツールステータスのクリア
 */
export function clearToolState() {
  TOOL_STATE.activeToolId = null;
  TOOL_STATE.isSettingOpen = false;
};

/**
 * penとeraserのbold変更
 * @param {Element} button - Bold変更用ボタン
 * @param {String} settingId - settingモーダル変更用のID
 */

export function changeBoldState(button, settingId) {
  const boldValue = button.firstElementChild.dataset.bold;

  if(settingId === TOOL_IDS.pen) {
    DRAW_STATE.penBoldValue = boldValue;
  } else {
    DRAW_STATE.penBoldValue = boldValue;
  }
  //console.log(boldValue);
}

export function changeColor(colorValue) {
  DRAW_STATE.currentPenColor = colorValue;
  DRAW_STATE.currentColor = DRAW_STATE.currentPenColor;
}

export function activatePenColor() { 
  DRAW_STATE.currentColor = DRAW_STATE.currentPenColor;
}

export function changeOpacity(opacityValue) {
  const opacity = Number(opacityValue) / 100;

  DRAW_STATE.currentOpacity = opacity;
}

/**
 * 凡例のオペレータボタンスイッチ
 */
export function toggleOperatorButtonStateInLegend(operatorId) {
  const isCurrentOperatorActivated = OPERATOR_STATE.activeOperatorId === operatorId;

  if(!isCurrentOperatorActivated) {
    OPERATOR_STATE.isOperatorActive = true;
    OPERATOR_STATE.activeOperatorId = operatorId;
    OPERATOR_STATE.isItemsOpen = false;
    TOOL_STATE.activeToolId = 'pen';
    TOOL_STATE.lastToolId = 'pen';
    TOOL_STATE.isSettingOpen = false;
    DRAW_STATE.currentColor = DRAW_STATE.currentPlayerColor;
    return;
  }

  if(isCurrentOperatorActivated) {
    OPERATOR_STATE.isOperatorActive = true;
  }

  if(!OPERATOR_STATE.isItemsOpen) {
    OPERATOR_STATE.isItemsOpen = true;
  } else {
    OPERATOR_STATE.isItemsOpen = false;
  }
};

/**
 * 凡例のオペレータボタンステータスのクリア
 */
export function clearOperatorButtonStateInLegend(targetId = null) {
  const isDrawTool = (targetId === TOOL_IDS.pen || targetId === TOOL_IDS.eraser);

  TOOL_STATE.activeToolId = null;
  OPERATOR_STATE.isOperatorActive = false;

  if(!targetId === OPERATOR_STATE.activeOperatorId) {
    OPERATOR_STATE.isItemsOpen = false;
  }

  if(isDrawTool) {
    OPERATOR_STATE.activeOperatorId = null;
  }
};

export function updatePlayerColorState(playerColorCode) {
  DRAW_STATE.currentPlayerColor = playerColorCode;
  DRAW_STATE.currentColor = DRAW_STATE.currentPlayerColor;
}

export function activatePlayerColor() {
  DRAW_STATE.currentColor = DRAW_STATE.currentPlayerColor;
};


export function activateStampLocateState() {
  STAMP_STATE.stampMode = 'locate';
  STAMP_STATE.isStampLocating = true;
  STAMP_STATE.isCheckInRect = false;
}

export function activateStampRelocateState() {
  STAMP_STATE.stampMode = 'relocate';
  STAMP_STATE.isStampLocating = true;
  STAMP_STATE.isCheckInRect = false;
}

export function deactivateStampState() {
  STAMP_STATE.stampMode = null;
  STAMP_STATE.isStampLocating = false;
  STAMP_STATE.isCheckInRect = false;
}

export function toggleStampRocatingState(isCanvasContainerColliding) {
  
  if(isCanvasContainerColliding) {
    STAMP_STATE.isCheckInRect = true;
  }

  if(STAMP_STATE.isCheckInRect && isCanvasContainerColliding) {
    STAMP_STATE.isStampLocating = true;
  } else if (STAMP_STATE.isCheckInRect && !isCanvasContainerColliding) {
    STAMP_STATE.isStampLocating = false;
  }
} 
