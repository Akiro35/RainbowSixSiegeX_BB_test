import {
  ELEMENT_IDS,
  ACTIVE_CLASSNAMES,
  SELECTOR_DATA,
  MODAL_IDS,
} from "../data/selector.js";

/**選択するオペレータアイコン配列を格納したオブジェクト
 * @type {{ATK: [HTMLElement], DEF: [HTMLElement]}}
 */
export const OPERATOR_ICON_CONTAINERS = {
  ATK: document.querySelectorAll('.js-operatorATK'),
  DEF: document.querySelectorAll('.js-operatorDEF')
}; //HACK: ちょっと浮いてる。グローバルの定数に置きたくないので、要検討。


/*****オペレータ*****/

/**
 * 選択済オペレータを表示するアイコンエレメントをすべて抽出。
 * @param {String} sideKey - オフジェクトキー(ATK or DEF);
 * @returns {[HTMLElement]} - 各サイドのオペレータicon(5人)の配列 
 */
export function getSelectedOperatorIcons(sideKey) {
  const operatorIcons = [];
  const headcount = 5;

  for(let i = 1; i <= headcount; i++) {
    const icon = document.getElementById(ELEMENT_IDS.operator.icon[sideKey] + `${i}`);
    operatorIcons.push(icon);
  }

  return operatorIcons;
}

/** 選択したオペレータアイコンから情報を取得する。
 * @param {HTMLElement} clickedIcon - 選択したアイコン
 * @return {{name: String, container: HTMLElement}} - オペレータの情報 
 */
export function getSelectedOperatorData(icon) {
  const operatorName = icon.getAttribute('alt').slice(9);
  const operatorContainer = icon.parentNode;
  
  return {name: operatorName, container: operatorContainer};
}

export function getOperatorIconFromSelection(sideKey, operatorName) {
  const containers = Array.from(OPERATOR_ICON_CONTAINERS[sideKey]);
  const operatorIcon = containers.find(operatorIconContainer => 
    operatorIconContainer.lastElementChild.dataset.operatorSelection === operatorName 
  );

  return operatorIcon;
}

/*****buttons*****/
/**
 * IDからボタン要素を取得する。
 * @param {Object} idObj 
 * @returns {Element[]}
 */
export function getButtonElementsById(idObj) {
  const keyArray = Object.keys(idObj);
  const valueArray = Object.values(idObj);
  const elements = [];

  for(let i = 0; i < keyArray.length; i++) {
    const element = document.getElementById(valueArray[i]);
    elements.push(element);
  }

  return elements;
}

/*****モーダル*****/

/**
 * モーダルに関係する要素を取得する。
 * @param {String} modalId - モーダルを読み込むためのId
 * @returns {{modal: HTMLElement, open: HTMLElement, close: HTMLElement}}
 */
export function getModalElements(modalId) {
  const modal = document.getElementById(`${modalId}`);
  const open = document.getElementById(`${modalId}--open`);
  const close = document.getElementById(`${modalId}--close`);

  return {modal, open, close};
};

/**
 * howToUseで現在開いているページ番号を返す
 * @returns {Number}
 */
export function getActiveHowToUsePage() {
  const activePage = document.querySelector('.' + ACTIVE_CLASSNAMES.howToUse.page);
  const activePageData = activePage.dataset.howToUse;

  return activePageData;
}

/**
 * 凡例としてON/OFFを有効にする要素を取得。
 * @param {HTMLElement} button - ON/OFFを切り替える要素。
 * @returns {{elements: HTMLElement[], classNamesToActivate: String[]}};
 */
export function getLegendContents(button) {
  const mapStatus = document.getElementById(ELEMENT_IDS.legend.mapStatus.container);
  const operators = document.getElementById(ELEMENT_IDS.legend.operators);
  const buttonClassName    = ACTIVE_CLASSNAMES.legend;
  const mapStatusClassName = ACTIVE_CLASSNAMES.mapStatus;
  const operatorsClassName = ACTIVE_CLASSNAMES.operators;

  //memo: 並びを統一すること。
  return {
    elements: [button, mapStatus, operators],
    classNamesToActivate: [buttonClassName, mapStatusClassName, operatorsClassName]
  };
}

/**
 * オペレータ関係の要素をDOMから読み込む
 * @param {String} containerId
 * @return {{
 * operatorContainer: HTMLElement,
 * icon: Element,
 * ability: Element,
 * gadgetContainer: Element,
 * gadgetSlots: Element[],
 * gadgets: Element[]
 * }} 
 */
export function getOperatorDOM(containerId) {
  const operatorContainer = document.getElementById(containerId);
  const isLegendId = containerId.startsWith(ELEMENT_IDS.legend.operatorContainer.ATK.slice(0, 9));
  const isSettingId = containerId.startsWith(ELEMENT_IDS.operatorSetting.operatorContainer.ATK.slice(0, 18));
  let selectorKey;

  if(isLegendId) {
    selectorKey = 'legend';
  } else if(isSettingId) {
    selectorKey = 'operatorSetting';
  } else {
    selectorKey = 'operatorSelection';
    const icon = operatorContainer.querySelector(SELECTOR_DATA[selectorKey].icon);
    return {icon: icon};
  }



  const icon = operatorContainer.querySelector(SELECTOR_DATA[selectorKey].icon);
  const ability = operatorContainer.querySelector(SELECTOR_DATA[selectorKey].ability);
  const gadgetContainer = operatorContainer.querySelector(SELECTOR_DATA[selectorKey].gadgetContainer);
  
  let gadgetSlots
  if(isLegendId) {
    gadgetSlots = null;
  } else {
    gadgetSlots = Array.from(gadgetContainer.children);
  }

  let gadgets;
  if(isLegendId) {
    gadgets = Array.from(gadgetContainer.children);
  } else {
    gadgets = Array.from(operatorContainer.querySelectorAll(SELECTOR_DATA[selectorKey].gadget));
  }

  return {
    operatorContainer,
    icon,
    ability,
    gadgetContainer,
    gadgetSlots,
    gadgets
  };
}

/**
 * プレイヤー名の入力者IDと入力値を取得。
 * @param {Object} e 
 * @returns {{id: String, name: String}}
 */
export function getPlayerName(e) {
  const playerNameForm = e.currentTarget;
  const playerName = playerNameForm.value;
  const playerId = playerNameForm.getAttribute('name').slice(10);
  
  return {id: playerId, name: playerName};
}

/**
 * プレイヤー色の入力者IDと入力値を取得。
 * @param {Object} e 
 * @returns {{id: String, color: String}}
 */
export function getPlayerColor(e) {
  const playerColor = e.target.value;
  const playerId = e.target.getAttribute('id').slice(19).slice(0, 4);
  
  return {id: playerId, color: playerColor};
}

/*****stampSelection*****/
function getItemContainer(playerId) {
  const playerContainer = document.querySelector(SELECTOR_DATA.legend.playerContainer[playerId]);
  const itemContainer = playerContainer.querySelector(SELECTOR_DATA.legend.item);
  return itemContainer;
}

export function identifyStampContainer(e) {
  const clickedStamp = e.target;
  const stampIdentifire = clickedStamp.dataset.stamp;
  const isLegendPlayerStamp = /legend....--operator/.test(stampIdentifire) ||
    /legend....--ability/.test(stampIdentifire) ||
    /legend....--gadget/.test(stampIdentifire);

  if(isLegendPlayerStamp) {
    const playerId = stampIdentifire.substr(6, 4);
    const container = getItemContainer(playerId);
    return container;
  } else if(stampIdentifire === 'legend--gear') {
    const container = document.getElementById(ELEMENT_IDS.legend.gears);
    return container;
  } else if(stampIdentifire === 'stamp-selection') {
    const modal = document.getElementById(MODAL_IDS.stampCollection);
    return modal;
  }
};