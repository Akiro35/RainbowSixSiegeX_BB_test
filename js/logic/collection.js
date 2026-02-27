import { getPointerLocalPositions, getStampHitbox, isStampColliding } from "./calculator.js";

/**
 * 各サイドの配列から、空の配列番号を取得する。
 * @param {Object} object - 選択済みのオペレータオブジェクト
 * @param {String} key - オフジェクトキー(ATK or DEF)
 * @return {Number} - 空の配列番号(検索結果がundefindの場合は-1) 
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

export function pushSelectedGadget(operatorData, clickedGadget) {

  const currentGadget = {
    img: clickedGadget.getAttribute('src'),
    gadgetName: clickedGadget.getAttribute('alt'),
    gadgetIcon: clickedGadget
  }
  
  operatorData.selectedGadgets.push(currentGadget);
}

export function replaceSelectedGadget(operatorData, clickedGadget) {
  operatorData.selectedGadgets.shift();

  const currentGadget = {
    img: clickedGadget.getAttribute('src'),
    gadgetName: clickedGadget.getAttribute('alt'),
    gadgetIcon: clickedGadget
  }
  
  operatorData.selectedGadgets.push(currentGadget);
}

export function deleteSelectedGadget(operatorData, DOMGadgetIcon) {
  const gadgetNumber = operatorData.selectedGadgets.findIndex((gadget) => {
    const clickedGadgetName = DOMGadgetIcon.getAttribute('alt'); 
    return gadget.gadgetName === clickedGadgetName;
  });

  operatorData.selectedGadgets.splice(gadgetNumber, 1);
}

/*****canvas*****/

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