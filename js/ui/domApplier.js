import { 
  floorNamesForDisplay
 } from "../data/map_pool.js"

import {
  operatorPool,
  selectedOperators,
 } from "../data/operator_pool.js";
 
import {
  ACTIVE_CLASSNAMES,
  BUTTON_IDS, ELEMENT_IDS,
  SELECTOR_CLASSNAMES,
  SELECTOR_DATA,
} from "../data/selector.js";

import {
  getMapDataFromPool,
} from "../logic/factory.js";

import {
  getMapFromSession,
} from "../logic/storage.js";
import {
  DRAW_STATE,
  TOOL_IDS,
} from "../logic/switcher.js";

import {
  getOperatorDOM,
  getSelectedOperatorIcons,
} from "./domExtractor.js";


/*****モーダル*****/

/**モーダルの展開
 * @param {HTMLElement} modal - モーダル本体
 * @param {String} [classNameToActivate] - 表示する要素がNAV場合、有効化するCSSを記載したクラス名
 */
export function showModal(modal, classNameToActivate = null) {
  const isNav = modal.tagName === 'NAV';
  const isDiv = modal.tagName === 'DIV';
  if(isNav || isDiv) {
    modal.classList.add(classNameToActivate);
    return;
  }

  modal.showModal();
};

/**モーダルの非表示
 * @param {HTMLElement} modal - モーダル本体
 * @param {String} [classNameToActivate] - 表示する要素がNAV場合、有効化するCSSを記載したクラス名
 * @
 */
export function hideModal(modal, classNameToActivate = null) {
  const isNav = modal.tagName === 'NAV';
  const isDiv = modal.tagName === 'DIV';
  
  if(isNav || isDiv) {
    modal.classList.remove(classNameToActivate);
    return;
  }

  modal.close();
};

/*****フッター*****/
/**
 * フッターを表示する。
 */
export function showFooter() {
  const footer = document.querySelector('footer');
  footer.style.display = 'block';
}

/**
 * フッターを非表示にする。
 */
export function hideFooter() {
  const footer = document.querySelector('footer');
  footer.removeAttribute('style');
}

/*****マップ*****/

/**
 * 選択済みマップデータをDOMに反映
 */
export function applySelectedMap() {
  const mapName = getMapFromSession();
  const displayMapElement = document.getElementById(ELEMENT_IDS.selectedMap);
  const displayMapImg = displayMapElement.children[1].children[0];
  const displayMapName = displayMapElement.children[2].children[0];
  const mapData = getMapDataFromPool(mapName);

  displayMapImg.setAttribute('src', mapData.img);
  displayMapImg.setAttribute('alt', mapName);
  displayMapName.textContent = mapName;
}

/**
 * 現在のマップ名をキャンバスの凡例に表示
 * @param {String} mapName - マップ名称
 */
export function displayCurrentMapName(mapName) {
  const mapStatusText = document.getElementById(ELEMENT_IDS.legend.mapStatus.mapName);
  const renamedMapName = mapName.slice(0, 1).toUpperCase() + mapName.slice(1);
  
  mapStatusText.textContent = renamedMapName;
}


/*****フロア*****/

/**
 * マップごとに存在するフロアのみを表示する。
 * @param {Object} map
 */
export function displayExistedFloors({map}) {
  const floors = Object.keys(map.blueprint);

  floors.forEach(floor => {
    const floorContainer = document.getElementById(ELEMENT_IDS.floorSetting[floor]);
    const hasFloor = !(map.blueprint[`${floor}`].length === 0);

    if(hasFloor) {
      floorContainer.style.display = 'block';
    } else {
      floorContainer.style.display = 'none';
    }
  });
};

/**
 * 現在のフロア名をキャンバスの凡例に表示
 * @param {String} selectedFloor 
 */
export function displayCurrentFloorName({floor}) {
  const mapStatusText = document.getElementById(ELEMENT_IDS.legend.mapStatus.floorName);
  mapStatusText.textContent = floorNamesForDisplay[floor];
}

/*****draw*****/
/**
 * 画面のcolor表示を変更する。
 * @param {String} colorValue 
 * @param {String} id 
 */
export function applyCurrentColor(colorValue, id) {
  const displayColor = document.getElementById(ELEMENT_IDS.tool.display.pen);
  
  if(id === PEN_ID) {
    displayColor.style.backgroundColor = colorValue;
  } else {
    console.log('オペレータ色変更');
  }
}

export function applyCurrentOpacity(opacityStr) {
  const displayOpacity = document.getElementById(ELEMENT_IDS.tool.display.opacity);

  displayOpacity.textContent = `${opacityStr}%`; 
}

/**
 * 画面のbold表示を変更する。
 * @param {String} settingId 
 */
export function applyCurrentBold(settingId) {
  const displayBold = document.getElementById(ELEMENT_IDS.tool.display[settingId]);

  if(settingId === TOOL_IDS.pen) {
    displayBold.style.height = DRAW_STATE.penBoldValue + 'px';
  } else {
    displayBold.style.height = DRAW_STATE.eraserBoldValue + 'px';
  }
}

export function applyConfirmDialogMessage(textJa, textEn) {
  const textDisplayJa = document.getElementById(ELEMENT_IDS.dialog.text.ja);
  const textDisplayEn = document.getElementById(ELEMENT_IDS.dialog.text.en);

  textDisplayJa.textContent = textJa;
  textDisplayEn.textContent = textEn;
}


/*****オペレータ*****/

/**
 * 選択したオペレータにバッジを表示する。
 * @param {String} sideKey - 攻撃か防衛かのキー
 * @param {Number} index - 要素が空の配列番号
 */
export function insertBadge(sideKey, operatorIconContainer, index) {
  const operatorNumber = index + 1;
  const badgeHTML = `
    <div class="selected" id="js-count${sideKey}--${operatorNumber}">
      <p>${operatorNumber}</p>
    </div>
  `;

  operatorIconContainer.insertAdjacentHTML('afterbegin', badgeHTML);
}

/**
 * バッジを取り除く
 * @param {String} operatorIconContainer - アイコンのコンテナ
 */
export function removeBadge(operatorIconContainer) {
  if(!operatorIconContainer) return;

  const badge = operatorIconContainer.firstElementChild;
  const isBadge = badge.classList.contains('selected');
  if(isBadge) {
    badge.remove();
  }
};

/**
 * 選択済みオペレータのアイコンを変更する
 * @param {String} sideKey - 攻撃か防衛かのキー
 * @param {Number} emptyArrayNumber - 空の配列番号
 */
export function changeSelectedOperatorsIcon(sideKey, emptyArrayNumber) {
  const selectedOperatorIcons = getSelectedOperatorIcons(sideKey);
  const selectedOperatorIcon = selectedOperatorIcons[emptyArrayNumber];
  const selectedOperatorContainer = selectedOperatorIcon.parentNode;
  const operatorName = selectedOperators[sideKey][emptyArrayNumber].name;
  const newOperatorIconSrc = operatorPool[sideKey][operatorName].icon;
  const newOperatorIconAlt = `operator_${operatorName}`;
  
  selectedOperatorIcon.setAttribute('src', newOperatorIconSrc);
  selectedOperatorIcon.setAttribute('alt', newOperatorIconAlt);
  selectedOperatorContainer.classList.add(ACTIVE_CLASSNAMES.operatorFilled);
}

/**
 * 選択済みのオペレータにバッジを付けなおす。
 * @param {String} sideKey - 攻撃か防衛かのキー
 * @param {{name: String, container: HTMLElement}} selectedOperator - 選択された単一のオペレータ
 * @param {Number} index - 当該オペレータのインデックス番号
 */
export function renumberBadges(sideKey, selectedOperator, index) {
  const badgeElement = selectedOperator.container.firstElementChild;
  const badgeChar = badgeElement.firstElementChild;
  const newBadgeNumber = index + 1;
  const newId = `js-count${sideKey}--${newBadgeNumber}`;

  badgeElement.setAttribute('id', newId);
  badgeChar.textContent = newBadgeNumber;
};

/**
 * オペレータの更新
 * @param {String} sideKey - 攻撃か防衛かのキー
 */
export function updateSelectedOperatorIcons(sideKey) {
  const selectedOperatorIcons = getSelectedOperatorIcons(sideKey);

  for(let i = 0; i < selectedOperators[sideKey].length; i++) {
    const operatorName = selectedOperators[sideKey][i].name;
    const selectedOperatorContainer = selectedOperatorIcons[i].parentNode;
    const newOperatorIconSrc = operatorPool[sideKey][operatorName].icon;
    const newOperatorIconAlt = `operator_${operatorName}`;

    selectedOperatorIcons[i].setAttribute('src', newOperatorIconSrc);
    selectedOperatorIcons[i].setAttribute('alt', newOperatorIconAlt);
    selectedOperatorContainer.classList.add(ACTIVE_CLASSNAMES.operatorFilled);
  }

  for(let i = selectedOperators[sideKey].length; i < selectedOperatorIcons.length; i++) {
    const selectedOperatorContainer = selectedOperatorIcons[i].parentNode;
    const hasClass = selectedOperatorContainer.classList.contains(ACTIVE_CLASSNAMES.operatorFilled);
    const blankIconSrc = operatorPool[sideKey].blank.icon;
    const blankIconAlt = 'operator_blank';

    selectedOperatorIcons[i].setAttribute('src', blankIconSrc);
    selectedOperatorIcons[i].setAttribute('alt', blankIconAlt);

    if(hasClass) {
      selectedOperatorContainer.classList.remove(ACTIVE_CLASSNAMES.operatorFilled);
    }
  }
};

/*****howToUse*****/
export function setExplanationPosition(explanations) {
  const contentsElement = document.querySelector(SELECTOR_CLASSNAMES.howToUse.contents);
  const contentsRect = contentsElement.getBoundingClientRect();

  explanations.forEach(({explanation, target, column, row}) => {
    const explanationElement = document.querySelector(explanation);
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if(!explanationElement || !targetElement) return;

    const explanationRect = explanationElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    
    switch (column) {
      case 'right':
        explanationElement.style.left = `${targetRect.right - contentsRect.left}px`;
        break;
      case 'left':
        explanationElement.style.right = `${(window.innerWidth - targetRect.left) - (window.innerWidth - contentsRect.right)}px`;
        break;
    }

    switch (row) {
      case 'top':
        explanationElement.style.top = `${targetRect.top}px`;
        break;
      case 'center':
        const rowCenter = (targetRect.top + targetRect.height / 2) - (explanationRect.height / 2);
        explanationElement.style.top = `${rowCenter}px`;
        break;
      case 'bottom':
        const rowBottom = window.innerHeight - targetRect.bottom;
        explanationElement.style.bottom = `${rowBottom}px`;
        break;
    }
  });
};

export function setHowToUseRectPosition() {
  const contentsElement = document.querySelector(SELECTOR_CLASSNAMES.howToUse.contents);
  const contentsRect = contentsElement.getBoundingClientRect();
  const offsetRight = innerWidth - contentsRect.right;
  const offsetValue = 8;

  const mapStatusElement = document.getElementById(ELEMENT_IDS.legend.mapStatus.container);
  const mapStatusRect = mapStatusElement.getBoundingClientRect();
  const howToUseMapStatus = document.querySelector(SELECTOR_CLASSNAMES.howToUse.mapStatus);

  const mapStatusPositions = {
    top:    mapStatusRect.top - offsetValue,
    right:  window.innerWidth - mapStatusRect.right - offsetValue,
    width:  mapStatusRect.right - mapStatusRect.left + offsetValue * 2,
    height: mapStatusRect.bottom - mapStatusRect.top + offsetValue * 2,
  }

  howToUseMapStatus.style.top =    mapStatusPositions.top + 'px';
  howToUseMapStatus.style.right =  mapStatusPositions.right - offsetRight + 'px';
  howToUseMapStatus.style.width =  mapStatusPositions.width + 'px';
  howToUseMapStatus.style.height = mapStatusPositions.height + 'px';

  const playersElement = document.getElementById(ELEMENT_IDS.legend.operators);
  const playersRect = playersElement.getBoundingClientRect();
  const howToUsePlayers = document.querySelector(SELECTOR_CLASSNAMES.howToUse.legendPlayers);
  const offsetWidthValue = innerWidth * 0.1;

  const playersPositions = {
    bottom: window.innerHeight - playersRect.bottom - offsetValue,
    left: playersRect.left - offsetValue,
    width: playersRect.right - playersRect.left + offsetValue * 2,
    height: playersRect.bottom - playersRect.top + offsetValue * 2,
    }

    howToUsePlayers.style.bottom = playersPositions.bottom + 'px';
    howToUsePlayers.style.left =   playersPositions.left + offsetWidthValue / 2 - contentsRect.left + 'px';
    howToUsePlayers.style.width =  playersPositions.width - offsetWidthValue + 'px';
    howToUsePlayers.style.height = playersPositions.height + 'px'; 
}

/*****board*****/
/**
 * 要素をアクティブ化表示する。
 * @param {Element} element - アクティブ化したい要素
 * @param {String} classNameToActivate - アクティブ化をCSSで記述したクラス名
 */
export function applyElementActivation(element, classNameToActivate) {
  element.classList.add(classNameToActivate);
}

/**
 * 要素を非アクティブ化表示する。
 * @param {HTMLElement} element - 非アクティブ化したい要素
 * @param {String} classNameToActivate - アクティブ化をCSSで記述したクラス名
 */
export function applyElementDeactivation(element, classNameToActivate) {
  element.classList.remove(classNameToActivate);
}

/**
 * 要素をすべて非アクティブ化する。
 * @param {HTMLElement[]} elements - 非アクティブ化する要素を格納した配列
 * @param {String} classNameToActivate - アクティブ化をCSSで記述したクラス名
 */
export function applyElementsDeactivation(elements, classNameToActivate) {
  elements.forEach(element => {
    element.classList.remove(classNameToActivate);
  });
};

/**
 * 要素のアクティブ/非アクティブを切り替える
 * @param {HTMLElement[]} element - トグルを実行する要素
 * @param {String} classNameToActivate - アクティブ化をCSSで記述したクラス名
 */
export function toggleElementActivation(element, classNameToActivate) {
  element.classList.toggle(classNameToActivate);
}

/**
 * 選択済オペレータアイコンを表示する
 * @param {Element} icon - DOMから取得したオペレータアイコン要素
 * @param operatorData { ReturnType<typeof import("../logic/factory.js").getOperatorDataFromPool} 
 */
export function applySelectedOperatorIcon(icon, operatorData) {
  icon.setAttribute('src', operatorData.icon);
  icon.setAttribute('alt', 'operator_' + operatorData.operatorName);
};

/**
 * オペレータ選択画面の、選択済オペレータアイコンを一括アップデートする。
 * @param {String} sideKey 
 */
export function updateSeleceteOperatorIconsToSelection(sideKey) {
  for(let i = 0; i < selectedOperators[sideKey].length; i++) {
    const operatorData = selectedOperators[sideKey][i];
    const containerId = ELEMENT_IDS.operatorSelection.selected[sideKey] + `${i + 1}`;
    const operatorDOMData = getOperatorDOM(containerId);
    applySelectedOperatorIcon(operatorDOMData.icon, operatorData);
  }
};

/**
 * アビリティアイコンを表示する(アイコンがない場合は表示しない)
 * @param {Element} ability - DOMから取得したアビリティアイコン要素
 * @param operatorData { ReturnType<typeof import("../logic/factory.js").getOperatorDataFromPool} 
 */
export function applySelectedOperatorAbility(ability, operatorData) {
  const hasAbility = operatorData.hasOwnProperty('ability');
  if(hasAbility) {
    ability.removeAttribute('style');
    ability.setAttribute('src', operatorData.ability.img);
    ability.setAttribute('alt', 'operator_' + operatorData.ability.abilityName);
  } else {
    ability.style.display = 'none';
  }
};

/**
 * ガジェットアイコンを表示する(ガジェットがない場合は表示しない)
 * @param operatorData { ReturnType<typeof import("../logic/factory.js").getOperatorDataFromPool}
 * @param containerId - コンテナ識別用ID
 */
export function applySelectedOperatorGadgetsToLegend(operatorData, containerId) {
  const operatorDOMData = getOperatorDOM(containerId);
  const operatorGadgets = Object.keys(operatorData).filter(key => key.startsWith('gadget'));
  const selectedGadgetCount = operatorData.selectedGadgets.length;
  
  if(selectedGadgetCount === 0) {
    for(let i = 0; i < operatorGadgets.length; i++) {
      operatorDOMData.gadgets[i].removeAttribute('style');
      operatorDOMData.gadgets[i].setAttribute('src', operatorData[operatorGadgets[i]].img);
      operatorDOMData.gadgets[i].setAttribute('alt', operatorData[operatorGadgets[i]].gadgetName);
    }

    if(operatorGadgets.length > 6) return;

    for(let i = operatorGadgets.length; i < operatorDOMData.gadgets.length; i++) {
      operatorDOMData.gadgets[i].style.display = 'none';
    }
  } else {
    for(let i = 0; i < selectedGadgetCount; i++) {
      operatorDOMData.gadgets[i].removeAttribute('style');
      operatorDOMData.gadgets[i].setAttribute('src', operatorData.selectedGadgets[i].img);
      operatorDOMData.gadgets[i].setAttribute('alt', operatorData.selectedGadgets[i].gadgetName);
    }

    for(let i = selectedGadgetCount; i < operatorDOMData.gadgets.length; i++) {
      operatorDOMData.gadgets[i].style.display = 'none';
    }
  }
}


/**
 * ガジェットアイコンを表示する(ガジェットがない場合は表示しない)
 * @param operatorData { ReturnType<typeof import("../logic/factory.js").getOperatorDataFromPool}
 * @param {String} containerId - コンテナ識別用Id
 */
export function applySelectedOperatorGadgetsToSetting(operatorData, containerId, gadgetSlots = null) {
  const operatorDOMData = getOperatorDOM(containerId);
  const operatorGadgets = Object.keys(operatorData).filter(key => key.startsWith('gadget'))
  for(let i = 0; i < operatorGadgets.length; i++) {
    if(gadgetSlots !== null && operatorData.operatorName !== 'blank') {
      gadgetSlots[i].classList.add('active');
    } else {
      gadgetSlots[i].classList.remove('active');
    }
    operatorDOMData.gadgets[i].removeAttribute('style');
    operatorDOMData.gadgets[i].setAttribute('src', operatorData[operatorGadgets[i]].img);
    operatorDOMData.gadgets[i].setAttribute('alt', operatorData[operatorGadgets[i]].gadgetName);
  }

  if(operatorGadgets.length > 6) return;

  for(let i = 3; i < operatorDOMData.gadgets.length; i++) {
    operatorDOMData.gadgets[i].style.display = 'none';
  }
}

/**
 * プレイヤーネームを凡例に表示
 * @param playerNameData { ReturnType<typeof import("../ui/domExtractor.js").getPlayerName}
 */
export function applyPlayerNameToLegend(playerNameData) {
  const sideKey = playerNameData.id.slice(0, 3);
  const selectedOperatorNumber = Number(playerNameData.id.slice(3));
  const playerKey = sideKey + selectedOperatorNumber;
  const playerContainer = document.querySelector(SELECTOR_DATA.legend.playerContainer[
    playerKey]);
  const displayName = playerContainer. querySelector(SELECTOR_DATA.legend.playerName);

  displayName.textContent = playerNameData.name;
  selectedOperators[sideKey][selectedOperatorNumber].playerName = playerNameData.name;
};

/**
 * プレイヤーカラーを凡例に表示
 * @param playerColorData { ReturnType<typeof import("../ui/domExtractor.js").getPlayerColor}
 */
export function applyPlayerColorToLegend(playerColorData) {
  const sideKey = playerColorData.id.slice(0, 3);
  const selectedOperatorNumber = Number(playerColorData.id.slice(3));
  const playerKey = sideKey + selectedOperatorNumber;
  const playerContainer = document.querySelector(SELECTOR_DATA.legend.playerContainer[playerKey]);

  playerContainer.style.borderTopColor = playerColorData.color;
}

/**
 * プレイヤーネームをオペレータ設定に表示
 * @param playerData { ReturnType<typeof import("../ui/domExtractor.js").getPlayerName}
 */
export function applyPlayerNameToSetting(playerData) {
  const sideKey = playerData.id.slice(0, 3);
  const selectedOperatorNumber = Number(playerData.id.slice(3));
  //const playerKey = sideKey + selectedOperatorNumber;
  const playerContainer = document.getElementById(ELEMENT_IDS.operatorSetting.operatorContainer[sideKey] + `${selectedOperatorNumber}`);
  const displayName = playerContainer.querySelector(SELECTOR_DATA.operatorSetting.playerName);

  displayName.textContent = playerData.name;
  selectedOperators[sideKey][selectedOperatorNumber].playerName = playerData.name;
};


/****canvas*****/
/**
 * キャンバス上のカーソルを変更する。
 * @param {String} toolId - ツールID
 */
export function changeCursorOnCanvas(toolId) {
  const canvas = document.getElementById(ELEMENT_IDS.canvas.canvas);

  canvas.addEventListener('mouseover', () => {
      canvas.style.cursor = 'default';
    });
    canvas.addEventListener('mousedown', () => {
      canvas.style.cursor = 'default';
    });
    canvas.addEventListener('mouseup', () => {
      canvas.style.cursor = 'default';
    });

  if(toolId === 'move') {
    canvas.addEventListener('mouseover', () => {
      canvas.style.cursor = 'grab';
    });
    canvas.addEventListener('mousedown', () => {
      canvas.style.cursor = 'grabbing';
    });
    canvas.addEventListener('mouseup', () => {
      canvas.style.cursor = 'grab';
    });

  } else if(toolId === 'pen' || toolId === 'eraser') {
    canvas.addEventListener('mousedown', () => {
      canvas.style.cursor = 'crosshair';
    });
  }
};

export function toggleHistoryButtonActive(CANVAS_DATA) {
  const {history} = CANVAS_DATA.state;
  const isOldest = history.index === 0;
  const isLatest = history.index === history.stack.length - 1;
  const undoButton = document.getElementById(BUTTON_IDS.history.undo);
  const redoButton = document.getElementById(BUTTON_IDS.history.redo);

  if(isOldest) {
    undoButton.style.opacity = 0.3;
    undoButton.style.pointerEvents = 'none';
  } else {
    undoButton.removeAttribute('style');
  }

  if(isLatest) {
    redoButton.style.opacity = 0.3;
    redoButton.style.pointerEvents = 'none';
  } else {
    redoButton.removeAttribute('style');
  }
}

export function applyScaleRatio({setting, state}) {
  const scaleRatioEl = document.getElementById(ELEMENT_IDS.scaleRatio);
  const scaleRatioForDisplay = Math.floor((state.imageScaleIndex * setting.scaleStep + 1) * 10) / 10;
  
  scaleRatioEl.textContent = scaleRatioForDisplay.toFixed(1) + 'x';
}

export function applyDeleteContainerToggle(isDeleteContainerColliding) {
  const deleteContainer = document.getElementById(ELEMENT_IDS.deleteStamp);
  if(isDeleteContainerColliding) {
    deleteContainer.style.opacity = '1.0';
  } else {
    deleteContainer.style.opacity = '0.6';
  }
}

export function hideContainerDelayed(element, className, delayTime) {
  setTimeout(() => {
    element.classList.remove(className);
  }, delayTime);
};

