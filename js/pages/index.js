import { saveMapToSession } from "../logic/storage.js";

import {
  initOpenModal,
  initCloseModal
} from "../ui/controller.js";

/**
 * マップ選択の準備(init:初期化は準備を整える意)
*/

function initWhatsSite() {
  const modalId = 'js-whatsSite';

  initOpenModal (modalId);
  initCloseModal(modalId);
}

function initMapSelection () {
  const maps = document.querySelectorAll('button.c-map');
  
  maps.forEach(map => {
    map.addEventListener('click', (e) => {
      const buttonElement = e.currentTarget;
      const mapName = buttonElement.dataset.map;

      saveMapToSession(mapName);
      window.location.href = 'page-operators.html';
    });
  });
};

initMapSelection();
initWhatsSite();