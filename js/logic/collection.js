import {
  getPointerLocalPositions,
  getStampHitbox,
  isStampColliding
} from "./calculator.js";

/**
 * オブジェクト内の配列から、空の配列番号を取得する。
 * @param {Object} object - 検索対象のオブジェクト
 * @param {string} key - 検索対象の配列を指定するオフジェクトキー
 * @returns {number | string} - 空の配列番号(検索結果がundefindの場合は-1) 
 */
export function getEmptyArrayNumber(object, key) {
  for(let i = 0; i <= object[key].length; i++){
    const hasNumber = i in object[key];

    if(!hasNumber) return i;
  }

  return 'full';
};

/**
 * 配列の空白を詰める
 * @param {Array} array - 対象の配列
 * @returns {Array} - 空白を詰めた配列
 */
export function getCompactArray(array) {
  return array.filter((array) => true);
}

/**
 * 選択したガジェットアイコンの情報を、各オペレータの選択済ガジェット配列に格納する
 * @param {import("./factory.js").SelectedOperatorData} operatorData - オペレータデータオブジェクト
 * @param {HTMLImageElement} clickedGadget - クリックしたガジェットアイコン
 */
export function pushSelectedGadget(operatorData, clickedGadget) {
  const currentGadget = {
    img: clickedGadget.getAttribute('src'),
    gadgetName: clickedGadget.getAttribute('alt'),
    gadgetIcon: clickedGadget
  }
  
  operatorData.selectedGadgets.push(currentGadget);
}

/**
 * ガジェットを選びなおす。選択済みのガジェットアイコン情報を削除し、新しく選択したガジェットアイコン情報を各オペレータの選択済みガジェット配列に格納する。
 * @param {import("./factory.js").SelectedOperatorData} operatorData - オペレータデータオブジェクト
 * @param {HTMLImageElement} clickedGadget - クリックしたガジェットアイコン
 */
export function replaceSelectedGadget(operatorData, clickedGadget) {
  operatorData.selectedGadgets.shift();

  const currentGadget = {
    img: clickedGadget.getAttribute('src'),
    gadgetName: clickedGadget.getAttribute('alt'),
    gadgetIcon: clickedGadget
  }
  
  operatorData.selectedGadgets.push(currentGadget);
}

/**
 * 選択済みガジェットを未選択状態にする。
 * @param {import("./factory.js").SelectedOperatorData} operatorData - オペレータデータオブジェクト
 * @param {HTMLImageElement} DOMGadgetIcon - クリックしたガジェットアイコン
 */
export function deleteSelectedGadget(operatorData, DOMGadgetIcon) {
  const gadgetNumber = operatorData.selectedGadgets.findIndex((gadget) => {
    const clickedGadgetName = DOMGadgetIcon.getAttribute('alt'); 
    return gadget.gadgetName === clickedGadgetName;
  });

  operatorData.selectedGadgets.splice(gadgetNumber, 1);
}


/*****canvas*****/

/**
 * ポインタに衝突したスタンプデータを格納した配列を返す
 * @param {MouseEvent | Touch} e - マウスイベントまたはタッチオブジェクト
 * @param {import("../ui/canvasManager.js").FullCanvasDataStructure} CANVAS_DATA - キャンバス状態オブジェクト
 * @returns {import("./calculator.js").stampData[]} - 衝突したスタンプの配列
 */
export function getStampsAtPointer(e, CANVAS_DATA) {
  const {selectedData, drawnContents} = CANVAS_DATA;
  const canvasPositions = getPointerLocalPositions(e);
  const pointerCenter = {vX: canvasPositions.vX, vY: canvasPositions.vY};
  const pointerRadius = 1;
  const currentStamps = [];

  drawnContents.stamps[selectedData.floor].forEach(drawnStamp => {
    const stampHitbox = getStampHitbox(drawnStamp);

    if(isStampColliding(stampHitbox, pointerCenter, pointerRadius)) {
      currentStamps.push(drawnStamp);
    }
  })

  return currentStamps;
}