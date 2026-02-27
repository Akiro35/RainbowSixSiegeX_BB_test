import { selectedOperators } from "../data/operator_pool.js";
import { ACTIVE_CLASSNAMES } from "../data/selector.js";
import { CANVAS_DATA } from "../ui/canvasManager.js";
import { initHowToUsePositions} from "../ui/controller.js";
import { getModalElements } from "../ui/domExtractor.js";

/*****セッション*****/

/*****マップ*****/

/**
 * マップ情報をセッションストレージに保存する
 * @param {String} mapName - マップ名
*/
export function saveMapToSession(mapName) {
  window.sessionStorage.setItem('SELECTED_MAP_NAME', mapName);
};

/**
 * マップ情報をセッションストレージから読み込む
 * @returns {{mapName: string}} - マップ情報
*/ 
export function getMapFromSession() {
  const mapName = window.sessionStorage.getItem('SELECTED_MAP_NAME');

  return mapName;
}

/**
 * 選択済みマップをリセットする。
 */
export function clearSelectedMap() {
  window.sessionStorage.removeItem('SELECTED_MAP_NAME');
};

/*****オペレータ*****/

/**
 * 選択済みオペレータ情報をセッションストレージに保存する
 * @param {Array} selectedOperatorsArray - 各サイドの選択済みオペレータ配列
 * @param {String} sideKey - サイドのキー 
 */
export function saveOperatorsToSession(selectedOperatorsArray, sideKey) {
  const array = selectedOperatorsArray.map((value) => value.name);
  const convertedArray = JSON.stringify(array);

  window.sessionStorage.setItem(`selectedOperator${sideKey}s`, convertedArray);
};

/**
 * セッションから選択済みオペレータを取得
 * @param {String} sideKey 
 * @returns {Array}
 */
export function getOperatorsFromSession(sideKey) {
  const convertedArray = window.sessionStorage.getItem(`selectedOperator${sideKey}s`);
  const operators = JSON.parse(convertedArray);
  let operatorCounter = operators.length;

  while(operatorCounter < 5) {
    operators.push('blank');
    operatorCounter++;
  }
  
  return operators;
}

/**
 * 選択済みのオペレータを全クリアする。
 */

export function clearSelectedOperators() {
  Object.keys(selectedOperators).forEach(sideKey => {
  window.sessionStorage.removeItem(`selectedOperator${sideKey}s`);
});
};

/*****キャッシュ*****/
export function getCachedImage(src, callback) {
  const imageCache = CANVAS_DATA.state.tempDraw.imageCache;
  
  if(imageCache[src]) {
    if(imageCache[src].complete) {
      return imageCache[src];
    }
    return null;
  }

  const img = new Image();

  img.onload = () => {
    if(callback) callback();
  };

  img.onerror = () => {
    console.error(`画像の読み込みに失敗しました: ${src}`);
  };

  img.src = src;
  imageCache[src] = img;

  return null;
}

/*****ローカル*****/

/**
 * 
 * @param {String} modalId - HowToUseのモーダルID
 * @returns {function showHowToUse(modalId) {
  フェードアニメーションの有効化とHowToUseの表示
 }}
 */
export const createFirstVisitChecker = (modalId) => {
  const VISITED_KEY = 'canvas_app_visited';

  return (modalId) => {
    const hasVisited = localStorage.getItem(VISITED_KEY);

    document.body.classList.add('isLoaded'); 
    // //HACK: アニメーションが増えてきたらモジュール化を検討。      
    if(!hasVisited) {
      const modalElements = getModalElements(modalId);

      modalElements.modal.classList.add(ACTIVE_CLASSNAMES.howToUse.modal);
      requestAnimationFrame(() => {
        initHowToUsePositions();
      });
      localStorage.setItem(VISITED_KEY, 'true');
    } else {
      console.log('2回目以降のアクセス');
    }
  }
}