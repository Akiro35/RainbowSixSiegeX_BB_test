import { initMapImageSize } from "../logic/calculator.js";
import { getMapDataFromPool } from "../logic/factory.js";
import { saveHistory, updateCanvas, updateStaticCanvasCache } from "./controller.js";

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