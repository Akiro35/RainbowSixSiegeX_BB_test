import { initMapImageSize } from "../logic/calculator.js";
import { getMapDataFromPool } from "../logic/factory.js";
import { saveHistory, updateCanvas, updateStaticCanvasCache } from "./controller.js";

/**
 * フロアごとのデータコンテナ
 * @template T
 * @typedef {Object} FloorData
 * @property {T[]} basement2nd
 * @property {T[]} basement
 * @property {T[]} floor1st
 * @property {T[]} floor2nd
 * @property {T[]} floor3rd
 * @property {T[]} roof
 */

/**
 * キャンバス要素のセット
 * @typedef {Object} CanvasSet
 * @property {HTMLCanvasElement | null} el
 * @property {CanvasRenderingContext2D | null} ctx
 */

/**
 * 描画中の一時的なセッションデータ
 * @typedef {Object} TempDrawData
 * @property {logicalPosition[]} linePoints - 描きかけの線の座標リスト
 * @property {Record<string, HTMLImageElement>} imageCache - アイコンの画像キャッシュ
 */

/**
 * キャンバスの実行環境データ
 * @typedef {Object} CanvasContext
 * @property {HTMLElement | null} container
 * @property {CanvasSet} main
 * @property {CanvasSet} cache
 * @property {HTMLImageElement} mapImage
 */

/**
 * キャンバスの状態管理
 * @typedef {Object} CanvasState
 * @property {{width: number, height: number}} initialLogicalDraw
 * @property {import("../logic/calculator.js").viewportPositions} translate - 現在の移動量
 * @property {import("../logic/calculator.js").viewportPositions} translateBuf - 移動量のバッファ
 * @property {number} currentImageScale - 現在の倍率
 * @property {number} imageScaleIndex - 倍率のインデックス
 * @property {TempDrawData} tempDraw - 描画中の一時データ
 * @property {Object} history - 履歴の管理データ
 * @property {any[]} history.stack - 操作時点での線とスタンプのデータ
 * @property {number} history.index - 履歴番号(stackの配列番号に対応)
 * @property {number} history.max - 履歴保存の最大値
 */

/**
 * 全体の構造を定義
 * @typedef {Object} FullCanvasDataStructure
 * @property {Object} selectedData - 選択中のマップ情報
 * @property {string|null} selectedData.map
 * @property {string|null} selectedData.floor
 * @property {CanvasContext} context - キャンバス要素とコンテキスト
 * @property {Object} setting - スケール設定
 * @property {number} setting.maxScale
 * @property {number} setting.minScale
 * @property {number} setting.scaleStep
 * @property {CanvasState} state - 動作状態
 * @property {Object} drawnContents - 描画済みの内容
 * @property {FloorData<any>} drawnContents.lines - フロア別の線データ
 * @property {FloorData<any>} drawnContents.stamps - フロア別のスタンプデータ
 */

/** 
 * アプリケーションの全描画データと状態を保持するコアオブジェクト
 * @type {FullCanvasDataStructure}
 */
export const CANVAS_DATA = {
  selectedData: {
    map: null,
    floor: null,
  },

  context: {
    container: null,
    main: {
      el: null,
      ctx: null
    },
    cache: {
      el: null,
      ctx: null
    },
    mapImage: new Image(),
  },

  setting: { 
    maxScale: 8.0,
    minScale: 1.0,
    scaleStep: 0.2
  },

  state: {
    initialLogicalDraw: {
      width: 0,
      height: 0,
    },
    translate: {
      vX: 0,
      vY: 0,
    },
    translateBuf: {
      vX: 0,
      vY: 0,
    },
    currentImageScale: 1,
    imageScaleIndex: 0,
    tempDraw: {
      linePoints: [],
      imageCache: {},
    },
    history: {
      stack: [],
      index: -1,
      max: 50,
    }
  },

  drawnContents: {
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
  },
};


/*****map*****/

export function loadMapImage(CANVAS_DATA) {
  const {selectedData, context} = CANVAS_DATA;
  const mapData = selectedData.map ? selectedData.map.blueprint[selectedData.floor] : ''; 
  if(!mapData) return; //memo:URLがない場合は処理しない
  context.mapImage.src = mapData;

  context.mapImage.onload = () => {
    initMapImageSize(CANVAS_DATA);
    updateStaticCanvasCache(CANVAS_DATA);
    updateCanvas(CANVAS_DATA);
    saveHistory(CANVAS_DATA);
  };
}

export function rewriteMapData({selectedData}, mapName) {
  const mapData = getMapDataFromPool(mapName);
  
  selectedData.map = mapData;
  window.sessionStorage.setItem('SELECTED_MAP_NAME', mapName);
}

/*****floor*****/
export function rewriteFloorData({selectedData}, floorName = 'floor1st') {
  selectedData.floor = floorName;
  window.sessionStorage.setItem('SELECTED_FLOOR', floorName);
}