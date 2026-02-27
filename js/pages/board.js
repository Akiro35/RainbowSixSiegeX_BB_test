import { selectedOperators } from "../data/operator_pool.js";

import {
  BUTTON_IDS,
  MODAL_IDS,
  ACTIVE_CLASSNAMES,
  SELECTOR_CLASSNAMES,
  SELECTOR_DATA,
  ELEMENT_IDS,
} from "../data/selector.js";

import {
  initMapImageSize,
  resizeCanvas,
} from "../logic/calculator.js";

import {
  createFirstVisitChecker,
  getMapFromSession,
} from "../logic/storage.js";

import {
  createSelectedOperators,
  getMapDataFromPool,
} from "../logic/factory.js";

import {
  changeColor,
  changeOpacity,
  updatePlayerColorState,
  setActivePointer,
  resetActivePointer,
  TOOL_STATE,
  TOUCH_STATE,
  DRAW_STATE,
} from "../logic/switcher.js";

import {
  getLegendContents,
  getModalElements,
  getButtonElementsById,
} from "../ui/domExtractor.js";

import {
  applyElementsDeactivation,
  toggleElementActivation,
  displayCurrentMapName,
  displayCurrentFloorName,
  displayExistedFloors,
  showModal,
  showFooter,
  hideModal,
  hideFooter,
  applyCurrentColor,
  applyCurrentOpacity,
} from "../ui/domApplier.js";

import {
  initOpenModal,
  initCloseModal,
  initClosePreModal,
  applySelectedOperatorToLegend,
  applySelectedOperatorToSetting,
  buildSelectedOperatorToSelection,
  buildReselectOperatorToSelection,
  initSelectGadget,
  updateStaticCanvasCache,
  updateCanvas,
  deactivateGears,
  resetLegendOperatorActivations,
  initHowToUsePositions,
  switchInformation,
} from "../ui/controller.js";

import {
  handleGearButtonClick,
  handleLegendButtonClick,
  handleOperatorButtonInLegendClick,
  handleOperatorColorInLegendClick,
  handleToolClick,
  handleApplyPlayerNameToLegend,
  handleApplyPlayerNameToSetting,
  handleBoldButtonClick,
  handleMapZoomWheelSpin,
  handleZoomButtonClick,
  handleDoubleTouch,
  handleCanvasPointerDown,
  handleCanvasPointerMove,
  handleCanvasPointerUp,
  handleStampImagePointerDown,
  handleStampImageMove,
  handleStampImagePointerUp,
  handleMapClick,
  handleFloorClick,
  handleLineClearClick,
  handleCancelClick,
  handleOkClick,
  handleStampClearClick,
  handleAllClearClick,
  handleHistoryButton,
  handleDocumentClick,
  handleReturnClick,
  handleHowToUseButtonClick,
} from "../ui/handlers.js";

import {
  CANVAS_DATA,
  loadMapImage,
} from "../ui/canvasManager.js";

const OPERATOR_HEADCOUNT = 5;

/*****ロード*****/
function setupDefaultBehaviors() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });
  });

  document.addEventListener('touchend', (e) => {
    handleDoubleTouch(e);
  }, false);

  document.addEventListener('click', (e) => {
    handleDocumentClick(e);
  });

  window.addEventListener('resize', () => {
    initMapImageSize(CANVAS_DATA);
    resizeCanvas(CANVAS_DATA);
    updateStaticCanvasCache(CANVAS_DATA);
    updateCanvas(CANVAS_DATA);
  })
}

/**
 * 選択済みマップのロード
 */
function loadSelectedMap() {
  const mapName = getMapFromSession();
  
  CANVAS_DATA.selectedData.map = getMapDataFromPool(mapName);
  displayCurrentMapName(mapName);
}

/**
 * 選択済みフロアのロード
 */
function loadSelectedFloor() {
  const {selectedData} = CANVAS_DATA;
  const floor = window.sessionStorage.getItem('SELECTED_FLOOR') ?
    selectedData.floor = window.sessionStorage.getItem('SELECTED_FLOOR') :
    selectedData.floor = 'floor1st';

  displayExistedFloors(selectedData);
  displayCurrentFloorName(selectedData);
};

/**
 * 選択済みオペレータのロード
 */
function loadSelectedOperators() {
  Object.keys(selectedOperators).forEach(sideKey => {
    createSelectedOperators(sideKey);
    applySelectedOperatorToLegend(sideKey);
    applySelectedOperatorToSetting(sideKey);
    initSelectGadget(sideKey);
  });
};


/*****menu*****/
/**
 * メニュー開閉の初期設定
 */
function initMenu() {
  const modalId = MODAL_IDS.menu;
  const classNameToActivate = ACTIVE_CLASSNAMES.menu;

  initOpenModal(modalId, classNameToActivate);
  initCloseModal(modalId, classNameToActivate);
};


/**
 * セッティング開閉の初期設定
 */
function initSetting() {
  const modalId = MODAL_IDS.setting;
  const modalIdToClose = MODAL_IDS.menu;
  const classNameToActivateForClosing = ACTIVE_CLASSNAMES.menu;

  initOpenModal (modalId);
  initClosePreModal(modalId, modalIdToClose, classNameToActivateForClosing);
  initCloseModal(modalId);
};

/**
 * HowToUse開閉の初期設定
 */
function setupHowToUse() {
  const modalId = MODAL_IDS.howToUse;
  const classNameToActivate = ACTIVE_CLASSNAMES.howToUse.modal;
  const modalIdToClose = MODAL_IDS.menu;
  const classNameToActivateForClosing = ACTIVE_CLASSNAMES.menu;

  initOpenModal (modalId, classNameToActivate);
  initClosePreModal(modalId, modalIdToClose, classNameToActivateForClosing);
  initCloseModal(modalId, classNameToActivate);

  const modals = getModalElements(modalId);
  modals.open.addEventListener('click', () => {
    const activePage = document.querySelector('.' + ACTIVE_CLASSNAMES.howToUse.page);
    const activePageData = activePage.dataset.howToUse;
    switchInformation(activePageData);
    initHowToUsePositions();
  });

  modals.close.addEventListener('click', () => {
    resetLegendOperatorActivations();
  });

  const buttons = getButtonElementsById(BUTTON_IDS.howToUse);
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const buttonId = button.dataset.howToUse;
      handleHowToUseButtonClick(buttonId);
    })
  })

  const checkFirstVisit = createFirstVisitChecker();
  checkFirstVisit(modalId);
};


function initWhatsSite() {
  const modalId = MODAL_IDS.whatsSite;
  const modalElements = getModalElements(modalId);
  const modalIdToClose = MODAL_IDS.menu;
  const modalElementsToClose = getModalElements(modalIdToClose);
  const classNameToActivateForClosing = ACTIVE_CLASSNAMES.menu;
  const openButtonFromMenu = document.getElementById(BUTTON_IDS.whatsSiteFromMenu);
  
  openButtonFromMenu.addEventListener('click', () => {
    showFooter();
    hideModal(modalElementsToClose.modal, classNameToActivateForClosing);
    showModal(modalElements.modal);
  });

  modalElements.close.addEventListener('click', () => {
    hideFooter();
    hideModal(modalElements.modal);
  })

  initOpenModal(modalId);
  initCloseModal(modalId);
};

/*****left*****/

/*****tools*****/

function initTools() {
  const toolButtons = getButtonElementsById(BUTTON_IDS.tool);

  toolButtons.forEach(button => {
    const toolId = button.dataset.tool;
    const modalId = BUTTON_IDS.toolSetting[toolId];
    const isDrawTool = (toolId === 'pen' || toolId === 'eraser');
    let elements;
    
    if(isDrawTool) {
      elements = getModalElements(modalId);
    } else {
      elements = {modal: null, open: button, close: null};
    }

    button.addEventListener('click', () => {
      resetLegendOperatorActivations(toolId);
      deactivateGears();
      handleToolClick(toolId, elements);
      initCloseModal(modalId);
    });
  })
}

function initToolSettings() {
  const penSettingModal = document.getElementById(BUTTON_IDS.toolSetting.pen);
  const eraserSettingModal = document.getElementById(BUTTON_IDS.toolSetting.eraser);
  const drawModals = [penSettingModal, eraserSettingModal];
  drawModals.forEach(drawModal => {
    const settingId = drawModal.dataset.draw;
    const boldButtons = drawModal.querySelectorAll(SELECTOR_DATA.draw.bold);

    boldButtons.forEach(boldButton => {
      boldButton.addEventListener('click', () => {
        applyElementsDeactivation(boldButtons, ACTIVE_CLASSNAMES.bold[settingId]);
        handleBoldButtonClick(boldButton, settingId);
      });
    });
  });

  const colorPicker = document.getElementById(ELEMENT_IDS.tool.color.picker); 
  colorPicker.addEventListener('input', (e) => {
    const colorValue = e.target.value;
    changeColor(colorValue);
    applyCurrentColor(colorValue, PEN_ID);
  });

  const opacityIds = ELEMENT_IDS.tool.opacity;
  const opactiyButton = document.getElementById(opacityIds.el);
  const opacityContainer = document.getElementById(opacityIds.container);
  const opacitySlider = document.getElementById(opacityIds.slider);

  opactiyButton.addEventListener('click', () => {
    toggleElementActivation(opacityContainer, ACTIVE_CLASSNAMES.opacity);
    opacitySlider.addEventListener('change', () => {
      const opacityStr = opacitySlider.value;
      changeOpacity(opacityStr);
      applyCurrentOpacity(opacityStr);
    });
  });

  const lineClearButton = document.getElementById(ELEMENT_IDS.tool.clear.line);
  lineClearButton.addEventListener('click', () => {
    const clearId = lineClearButton.dataset.draw;
    handleLineClearClick();
    initConfirmDialogButton(clearId, CANVAS_DATA);
  });

  const stampClearButton = document.getElementById(ELEMENT_IDS.tool.clear.stamp);
  stampClearButton.addEventListener('click', () => {
    const clearId = stampClearButton.dataset.draw;
    handleStampClearClick();
    initConfirmDialogButton(clearId, CANVAS_DATA);
  });
  
  const allClearButton = document.getElementById(ELEMENT_IDS.tool.clear.all);
  allClearButton.addEventListener('click', () => {
    const clearId = allClearButton.dataset.draw;
    handleAllClearClick();
    initConfirmDialogButton(clearId, CANVAS_DATA);
  });

}

function initConfirmDialogButton(clearId, CANVAS_DATA) {
  const cancelButton = document.getElementById(BUTTON_IDS.confirm.cancel);
  const newCancelButton = cancelButton.cloneNode(true);
  const okButton = document.getElementById(BUTTON_IDS.confirm.ok);
  const newOkButton = okButton.cloneNode(true);

  cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
  okButton.parentNode.replaceChild(newOkButton, okButton);

  newCancelButton.addEventListener('click', () => {
    handleCancelClick()
  });

  newOkButton.addEventListener('click', () => {
    handleOkClick(clearId, CANVAS_DATA)
  });
}

/*****canvas*****/
function initCanvasContext() {
  const container = document.getElementById(ELEMENT_IDS.canvas.container);
  const mainCanvas = document.getElementById(ELEMENT_IDS.canvas.canvas);

  CANVAS_DATA.context.container = container;
  CANVAS_DATA.context.main.el = mainCanvas;
  CANVAS_DATA.context.main.ctx = mainCanvas.getContext('2d');

  const staticCanvas = document.createElement('canvas');
  CANVAS_DATA.context.cache.el = staticCanvas,
  CANVAS_DATA.context.cache.ctx = staticCanvas.getContext('2d');
}


function buildCanvas() {
  const {context} = CANVAS_DATA;
  const {main} = context;
  initCanvasContext();
  resizeCanvas(CANVAS_DATA);
  loadMapImage(CANVAS_DATA);

  const zoomButtons = getButtonElementsById(BUTTON_IDS.zoom);

  zoomButtons.forEach(button => {
    button.addEventListener('click', () => {
      const buttonId = button.dataset.zoom;

      handleZoomButtonClick(buttonId);
      updateStaticCanvasCache(CANVAS_DATA);
      updateCanvas(CANVAS_DATA);
    });
  });


  const historyButtons = getButtonElementsById(BUTTON_IDS.history);
  historyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const buttonId = button.dataset.history;
      handleHistoryButton(buttonId, CANVAS_DATA);
    })
  });

  main.el.addEventListener('wheel', (e) => {
    e.preventDefault();
    handleMapZoomWheelSpin(e);
    updateStaticCanvasCache(CANVAS_DATA);
    updateCanvas(CANVAS_DATA);
  }, { passive: false});

  main.el.addEventListener('pointerdown', (e) => {
    setActivePointer(e);
    handleCanvasPointerDown(e, TOOL_STATE, TOUCH_STATE, CANVAS_DATA);
  })

  main.el.addEventListener('pointerup', (e) => {
    resetActivePointer(e);
    handleCanvasPointerUp(e, TOOL_STATE, CANVAS_DATA, DRAW_STATE);
    TOUCH_STATE.press = false;
    handleStampImagePointerUp(e);
  })

  main.el.addEventListener('pointerout', (e) => {
    resetActivePointer(e);
    TOUCH_STATE.press = false;
  })

  main.el.addEventListener('pointercancel', (e) => {
    resetActivePointer(e);
    TOUCH_STATE.press = false;
  })

  main.el.addEventListener('pointermove', (e) => {
    //console.log(TOUCH_STATE.press);
    setActivePointer(e);
    handleCanvasPointerMove(e, TOOL_STATE, TOUCH_STATE, CANVAS_DATA);
    updateStaticCanvasCache(CANVAS_DATA);
    updateCanvas(CANVAS_DATA);
  })
}

/*****legend*****/
function setupLegend() {
  const legendButton = document.getElementById(BUTTON_IDS.legend);
  const legendContents = getLegendContents(legendButton);
  const operatorButtons = document.querySelectorAll(SELECTOR_CLASSNAMES.operatorButton);
  const gearButton = document.getElementById(BUTTON_IDS.gear);
  const playerColorButtons = document.querySelectorAll(SELECTOR_CLASSNAMES.playerColor);
  const nameForms = document.querySelectorAll(SELECTOR_CLASSNAMES.playerName);

  legendButton.addEventListener('click', (e) => {
    handleLegendButtonClick(legendContents);
  });

  gearButton.addEventListener('click', (e) => {
    e.stopPropagation()
    handleGearButtonClick();
  });

  operatorButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      handleOperatorButtonInLegendClick(button);
    })
  })

  //TODO: settingのreturnボタン作る。
  playerColorButtons.forEach(button => {
    button.addEventListener('input', (e) => {
      const playerColor = e.target.value;
      handleOperatorColorInLegendClick(e);
      updatePlayerColorState(playerColor);
    });
  });

  nameForms.forEach(nameForm => {
    nameForm.addEventListener('input', (e) => {
      handleApplyPlayerNameToLegend(e);
      handleApplyPlayerNameToSetting(e);
    })
  })
};


/*****right*****/
function initOperatorSetting () {
  const modalId = MODAL_IDS.operatorSetting;

  initOpenModal(modalId);
  initCloseModal(modalId);
};


function initOperatorSelections() {
  Object.keys(selectedOperators).forEach(sideKey => {
    const modalId = MODAL_IDS.operatorSelection[sideKey];
    initOpenModal(modalId);
    initCloseModal(modalId);

    buildSelectedOperatorToSelection(sideKey); //HACK: ここ汚いので、余裕があれば整理。
    buildReselectOperatorToSelection(sideKey);

    const returnButton = document.getElementById(ELEMENT_IDS.operatorSelection.return[sideKey]);
    returnButton.addEventListener('click', () => {
      handleReturnClick(sideKey);
    })
  });  
};

function initStampCollection() {
  const modalId = MODAL_IDS.stampCollection;
  initOpenModal(modalId);
  initCloseModal(modalId);
}

function initStampBehavior() {
  const stamps = document.querySelectorAll(SELECTOR_CLASSNAMES.stamp);
  stamps.forEach(stamp => {
    stamp.addEventListener('pointerdown', (e) => {
      handleStampImagePointerDown(e);
    });
  });

  document.addEventListener('pointermove', (e) => {
    handleStampImageMove(e);
  })
} 

function initMapSetting() {
  const modalId = MODAL_IDS.mapSetting;
  initOpenModal(modalId);
  initCloseModal(modalId);

  const maps = document.querySelectorAll(SELECTOR_CLASSNAMES.map);
  maps.forEach(map => {
    map.addEventListener('click', (e) => {
      handleMapClick(e, CANVAS_DATA);
    })
  })
}

function initFloorSetting() {
  const modalId = MODAL_IDS.floorSetting;
  initOpenModal(modalId);
  initCloseModal(modalId);

  const floorContainers = document.querySelectorAll(SELECTOR_CLASSNAMES.floor);
  floorContainers.forEach(floorContainer => {
    floorContainer.addEventListener('click', (e) => {
      handleFloorClick(e, CANVAS_DATA);
    })
  })
}



function initModals() {
  //memo:ナビゲーション
  initMenu();
  initSetting();
  setupHowToUse();
  initWhatsSite();
  //memo: アプリの設定・操作
  initOperatorSetting();
  initOperatorSelections();
  initStampCollection();
  //memo: マップ
  initMapSetting();
  initFloorSetting();
};

setupDefaultBehaviors();
loadSelectedMap();
loadSelectedFloor();
loadSelectedOperators();
initModals();
initTools();
initToolSettings();
setupLegend();
buildCanvas();
initStampBehavior();
