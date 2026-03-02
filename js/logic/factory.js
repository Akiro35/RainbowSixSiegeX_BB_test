import {
  MAP_POOL,
} from "../data/map_pool.js";

import {
  OPERATOR_POOL,
  SELECTED_OPERATORS,
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

/**
 * @typedef {import("../data/operator_pool.js").Operator & {
 * operatorName : string,
 * selectedGadgets : any[]
 * }} SelectedOperatorData - 選択済みのオペレータデータ
 */

/**
 * マップ階層ごとの俯瞰図オブジェクト
 * @typedef {Object} blueprint
 * @property {string} [blueprint.basement2nd] - 地下2階の俯瞰図パス
 * @property {string} [blueprint.basement] - 地下1階の俯瞰図パス
 * @property {string} [blueprint.floor1st] - 1階の俯瞰図パス
 * @property {string} [blueprint.floor2nd] - 2階の俯瞰図パス
 * @property {string} [blueprint.floor3rd] - 3階の俯瞰図パス
 * @property {string} [blueprint.roof] - 屋上の俯瞰図パス
 */

/**
 * @typedef {Object} mapData
 * @property {string} mapName - マップ名
 * @property {string} img - マップのアイコンパス
 * @property {blueprint} blueprint - マップ階層ごとの俯瞰図オブジェクト
 */

/*****map*****/

/**
 * マッププールからデータを読み込む。
 * @param {String} mapName - マップ名称
 * @returns {mapData}
 */
export function getMapDataFromPool(mapName) {
  const map = {
    blueprint: {}
  };

  map.mapName               = mapName;
  map.img                   = MAP_POOL[mapName].img;
  map.blueprint.basement2nd = MAP_POOL[mapName].basement2nd  ? MAP_POOL[mapName].basement2nd  : '';
  map.blueprint.basement    = MAP_POOL[mapName].basement     ? MAP_POOL[mapName].basement     : '';
  map.blueprint.floor1st    = MAP_POOL[mapName].floor1st     ? MAP_POOL[mapName].floor1st     : '';
  map.blueprint.floor2nd    = MAP_POOL[mapName].floor2nd     ? MAP_POOL[mapName].floor2nd     : '';
  map.blueprint.floor3rd    = MAP_POOL[mapName].floor3rd     ? MAP_POOL[mapName].floor3rd     : '';
  map.blueprint.roof        = MAP_POOL[mapName].roof         ? MAP_POOL[mapName].roof         : '';

  const newMapData = structuredClone(map);
  return newMapData;
};


/*****operator*****/

/**
 * オペレータプールからデータを読み込む。
 * @param {String} operatorName 
 * @param {String} sideKey 
 * @returns {SelectedOperatorData}
 */
export function getOperatorDataFromPool(operatorName, sideKey) {
  const operatorData = OPERATOR_POOL[sideKey][operatorName];
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
    SELECTED_OPERATORS[sideKey].push(operatorData);
  }

  //console.log(SELECTED_OPERATORS[sideKey]); //デバッグ用
}

/**
 * マウス追随用のスタンプイメージを作成。
 * @param {MouseEvent | Touch} e - マウスイベントまたはタッチオブジェクト
 * @param {stampData} [currentStamp] - 任意のスタンプデータ。引数がなければスタンプイメージを作成。 
 * @returns {HTMLImageElement}
 */
export function createStamp(e ,currentStamp = null) {
  const stamp = new Image();

  const imageSrc = currentStamp ? currentStamp.img : e.target.getAttribute('src');
  const id = currentStamp ? currentStamp.id : 'stamp--' + STAMP_STATE.counter;
  
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

/**
 * マウス追随中の一時スタンプ要素から、スタンプデータを抽出してオブジェクトを返す
 * @param {MouseEvent | Touch} e - マウスイベントまたはタッチオブジェクト 
 * @param {HTMLImageElement} tempStamp - マウス追随中のスタンプ要素 
 * @returns {import("./calculator.js").stampData}
 */
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