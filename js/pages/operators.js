import {
  SELECTED_OPERATORS
} from "../data/operator_pool.js";

import { 
  clearSelectedMap,
  clearSelectedOperators,
  saveOperatorsToSession
} from "../logic/storage.js";

import { 
  getEmptyArrayNumber,
  getCompactArray
} from "../logic/collection.js";

import { 
  applySelectedMap,
  changeSelectedOperatorsIcon,
  insertBadge,
  removeBadge,
  renumberBadges,
  updateSelectedOperatorIcons
} from "../ui/domApplier.js";

import { 
  OPERATOR_ICON_CONTAINERS,
  getSelectedOperatorData,
} from "../ui/domExtractor.js";

import {
  initOpenModal,
  initCloseModal
} from "../ui/controller.js";

function initReselectMap () {
  const selectedMap = document.querySelector('button.c-map--selected');
  
  selectedMap.addEventListener('click', () => {
    clearSelectedMap();
    window.location.href = 'index.html';
  });
};

function initSelectOperatorModal() {
  Object.keys(SELECTED_OPERATORS).forEach(sideKey => {
    const modalId = `js-selectOperator${sideKey}`;

    initOpenModal(modalId);
    initCloseModal(modalId);
  });
};

function initSelectOperators() {
  Object.keys(SELECTED_OPERATORS).forEach(sideKey => {
    OPERATOR_ICON_CONTAINERS[sideKey].forEach(operatorIconContainer => {
      operatorIconContainer.addEventListener('click', (e) => {
        if(SELECTED_OPERATORS[sideKey].length > 5) return;

        const clickedIcon = e.target;
        const operatorData = getSelectedOperatorData(clickedIcon);
        const selectedOperatorArrayNumber = SELECTED_OPERATORS[sideKey].findIndex((selectedOperator) => {
          return selectedOperator.name === operatorData.name;
        });

        if(selectedOperatorArrayNumber >= 0 ) {
          removeBadge(operatorData.container);
          delete SELECTED_OPERATORS[sideKey][selectedOperatorArrayNumber];
          SELECTED_OPERATORS[sideKey] = getCompactArray(SELECTED_OPERATORS[sideKey]);
          SELECTED_OPERATORS[sideKey].forEach((selectedOperator, index) => {
            renumberBadges(sideKey, selectedOperator, index);
          });
          updateSelectedOperatorIcons(sideKey);
          return;
        }

        if(SELECTED_OPERATORS[sideKey].length < 5) {
          const emptyArrayNumber = getEmptyArrayNumber(SELECTED_OPERATORS, sideKey);
          SELECTED_OPERATORS[sideKey].push(operatorData);
          
          insertBadge(sideKey, operatorData.container, emptyArrayNumber);
          changeSelectedOperatorsIcon(sideKey, emptyArrayNumber);
        }
      });
    });
  });
};

function initOperatorSelection () {
  window.addEventListener('load', () => {
    clearSelectedOperators();
  });

  const startButton = document.querySelector('button#js-startBriefing');
  
  startButton.addEventListener('click', () => {
    Object.keys(SELECTED_OPERATORS).forEach(sideKey => {
      saveOperatorsToSession(SELECTED_OPERATORS[sideKey], sideKey);
    });
    window.location.href = 'page-board.html';
  });
};

function initWhatsSite() {
  const modalId = 'js-whatsSite';

  initOpenModal (modalId);
  initCloseModal(modalId);
}

applySelectedMap();
initReselectMap();
initSelectOperatorModal();
initOperatorSelection()
initSelectOperators();
initWhatsSite();