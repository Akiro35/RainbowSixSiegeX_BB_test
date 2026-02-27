import {
  mapPool,
} from "../data/map_pool.js";

import {
  operatorPool,
  selectedOperators,
} from "../data/operator_pool.js";

import {
  getStampPositionsToFollowMouse,
  getStampPositionsToRecord,
  viewportToLogical,
} from "./calculator.js";

import {
  getOperatorsFromSession,
} from "./storage.js";

import {
  STAMP_STATE,
} from "./switcher.js";

/*****map*****/

/**
 * マッププールからデータを読み込む。
 * @param {String} mapName - マップ名称
 * @returns {{
 * mapName: String,
 * img: String,
 * blueprint: Object
 * }}
 */
export function getMapDataFromPool(mapName) {
  const map = {
    blueprint: {}
  };

  map.mapName               = mapName;
  map.img                   = mapPool[mapName].img;
  map.blueprint.basement2nd = mapPool[mapName].basement2nd  ? mapPool[mapName].basement2nd  : '';
  map.blueprint.basement    = mapPool[mapName].basement     ? mapPool[mapName].basement     : '';
  map.blueprint.floor1st    = mapPool[mapName].floor1st     ? mapPool[mapName].floor1st     : '';
  map.blueprint.floor2nd    = mapPool[mapName].floor2nd     ? mapPool[mapName].floor2nd     : '';
  map.blueprint.floor3rd    = mapPool[mapName].floor3rd     ? mapPool[mapName].floor3rd     : '';
  map.blueprint.roof        = mapPool[mapName].roof         ? mapPool[mapName].roof         : '';

  const newMapData = structuredClone(map);
  return newMapData;
};


/*****operator*****/
/**
 * オペレータプールからデータを読み込む。
 * @param {String} operatorName 
 * @param {String} sideKey 
 * @returns {{
 * operatorName: String, 
 * icon: String,
 * ability: {img: String, abilityName: String},
 * gadget_Number: {img: String, gadgetName: String},
 * selectedGadgets: []
 * }}
 */
export function getOperatorDataFromPool(operatorName, sideKey) {
  const operatorData = operatorPool[sideKey][operatorName];
  operatorData.operatorName = operatorName;
  operatorData.selectedGadgets = [];

  const newOperatorData = structuredClone(operatorData);

  return newOperatorData;
};

/**
 * 選択済みオペレータを一元管理するselectedOperatorsオブジェクトを作成する。
 * @param {String} sideKey 
 */
export function createSelectedOperators(sideKey) {
  const operators = getOperatorsFromSession(sideKey);

  for(let i = 0; i < operators.length; i++) {
    const operatorData = getOperatorDataFromPool(operators[i], sideKey);
    selectedOperators[sideKey].push(operatorData);
  }

  console.log(selectedOperators[sideKey]); //デバッグ用
}


export function createStamp(e ,currentStamp = null) {
  const stamp = new Image();

  const imageSrc = currentStamp ? currentStamp.img : e.target.getAttribute('src');
  const id = currentStamp ? currentStamp.id : 'stamp--' + STAMP_STATE.counter;
  
  //const selectedImageURL = e.target.getAttribute('src');
  const stampPositions = getStampPositionsToFollowMouse(e);

  stamp.src = imageSrc;
  stamp.id = id;
  stamp.dataset.stamp = 'stamp--temp';
  stamp.style.width = STAMP_STATE.size + 'vw';
  stamp.style.height = STAMP_STATE.size + 'vw';
  stamp.style.display = 'block';
  stamp.style.position = 'fixed';
  stamp.style.zIndex = '900';
  stamp.style.left = stampPositions.vX + 'px';
  stamp.style.top = stampPositions.vY + 'px';
  stamp.style.pointerEvents = 'none';
  stamp.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  return stamp;
}

export function createStampData(e, tempStamp) {
  const stampPositions = getStampPositionsToRecord(e);
  const logicalPositions = viewportToLogical(stampPositions.vX, stampPositions.vY);
  const stampData = {
    id: tempStamp.id,
    img: tempStamp.src,
    points: logicalPositions
  };

  return stampData;
}