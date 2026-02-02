/*********menu*********/
const buttonPageForward = document.getElementById('js-howToUse--forward');
const buttonPageBack = document.getElementById('js-howToUse--back');

/*********left*********/
const buttonMove = document.getElementById('js-buttonMove');
const buttonDrawTools = document.querySelectorAll('.js-drawTools');
const penBoldSetting = document.querySelectorAll('.js-penBold');
const eraserBoldSetting = document.querySelectorAll('.js-eraserBold');

let currentColor = '#ffffff';
let currentPenColor = '#ffffff';
let currentUserColor;
let currentOpacity = 1.0;
let penBoldValue = 2;
let eraserBoldValue = 8;

const operatorButtons = document.querySelectorAll('.p-canvas__btn--operator');
const colorPicker = document.querySelector('#js-penColor');
const opacitySlider = document.querySelector('#js-opacity');

let moveMode;
let drawMode;
let hookItemsActive;
let hookGearsActive;

/*********main*********/
const canvas = document.getElementById('js-canvasMap');
const canvasContainer = document.getElementById('js-canvasContainer');

/*********legend*********/
const operatorColorButtons = document.querySelectorAll('.p-canvas__btn--color');
const players = document.querySelectorAll('.playerName');
const gearButton = document.querySelector('.p-canvas__btn--gears');

/*********right*********/
const operatorSettingGadgets = document.querySelectorAll('.js-operatorSetting__gadget');
const iconSettingSelectedIconsLeft = document.querySelectorAll('.js-selectedIcon');

const maps = document.querySelectorAll('.js-mapSetting__map');
const floorContainers = document.querySelectorAll('.js-floorSetting__floorList--floor');


/*********left*********/
/*********menu*********/
function toggleMenu() {
  const menu = document.querySelector('nav.js-board__menu');
  const openButton = document.getElementById('open--boardMenu');
  const closeButton = document.getElementById('close--boardMenu');

  openButton.addEventListener('click', () => {
    menu.classList.toggle('l-body__menu--active');
  });

  closeButton.addEventListener('click', () => {
    menu.classList.toggle('l-body__menu--active');
  });
};

/*********setting*********/
function toggleSetting() {
  const modal = document.querySelector('dialog.js-setting');
  const menu = document.querySelector('nav.js-board__menu');
  const openButton = document.getElementById('open--setting');
  const closeButton = document.getElementById('close--setting');

  openButton.addEventListener('click', () => {
    modal.showModal();
    menu.classList.remove('l-body__menu--active');
  });

  closeButton.addEventListener('click', () => {
    modal.close();
  });
};

/*********HowToUse*********/
const VISITED_KEY = 'canvas_app_visited';

function checkFirstVisit() {
  const hasVisited = localStorage.getItem(VISITED_KEY);
  const howToUse = document.getElementById('js-howToUse');

  if(!hasVisited) {
    const activePage = document.querySelector('.pageContent--active');
    const currentPageNumber = Number(activePage.getAttribute('id').slice(17));
    howToUse.classList.add('p-howToUse--active');
    requestAnimationFrame(() => {
      switchInformation(currentPageNumber);
      document.body.classList.add('isLoaded');
    });
    localStorage.setItem(VISITED_KEY, 'true');
  } else {
    console.log('２回目以降のアクセス');
    document.body.classList.add('isLoaded');
  }
};

function toggleHowToUse() {
  const howToUse = document.getElementById('js-howToUse');
  const menu = document.querySelector('nav.js-board__menu');
  const openButton = document.getElementById('open--howToUse');
  const closeButton = document.getElementById('close--howToUse');

  openButton.addEventListener('click', () => {
    const activePage = document.querySelector('.pageContent--active');
    const currentPageNumber = Number(activePage.getAttribute('id').slice(17));
    menu.classList.remove('l-body__menu--active');
    howToUse.classList.add('p-howToUse--active');
    switchInformation(currentPageNumber);
  });

  closeButton.addEventListener('click', () => {
    howToUse.classList.remove('p-howToUse--active');
    deactivateItems();
    deactivateOperator();
  })
};

function switchInformation(currentPageNumber) {
  switch (currentPageNumber) {
    case 1: //leftの説明
      //console.log(1);
      deactivateItems();
      deactivateOperator();
      setMapStatusPosition();
      setLegendPosition();
      locateHowToUseExplanationPage1();
      break;
    case 2: //rightの説明
      //console.log(2);
      deactivateItems();
      deactivateOperator();
      locateHowToUseExplanationPage2();
      break;
    case 3: //canvasの説明
      //console.log(3);
      deactivateItems();
      deactivateOperator();
      locateHowToUseExplanationPage3();
      break;
    case 4: //オペレータボタンの説明
      //console.log(4);
      const operator = document.querySelector('.p-canvas__operator');
      const items = document.querySelector('.p-canvas__operator--items');
      operator.classList.add('p-canvas__operator--active');
      items.classList.add('items--active');
      locateHowToUseExplanationPage4();
      break;
  }
};

function forwardHowToUsePage() {
  const activePage = document.querySelector('.pageContent--active');
  const nextPage = activePage.nextElementSibling;
  const activeIndicator = document.querySelector('.pageIndicator--active');
  const nextIndicator = activeIndicator.nextElementSibling;

  activePage.classList.remove('pageContent--active');
  activeIndicator.classList.remove('pageIndicator--active');
  nextPage.classList.add('pageContent--active');
  nextIndicator.classList.add('pageIndicator--active');
  buttonPageBack.classList.add('nav--active');
  
  if(nextPage.nextElementSibling === null) {
    buttonPageForward.classList.remove('nav--active');
  }
};

function backHowToUsePage() {
  const activePage = document.querySelector('.pageContent--active');
  const previousPage = activePage.previousElementSibling;
  const activeIndicator = document.querySelector('.pageIndicator--active');
  const previousIndicator = activeIndicator.previousElementSibling;

  activePage.classList.remove('pageContent--active');
  activeIndicator.classList.remove('pageIndicator--active');
  previousPage.classList.add('pageContent--active');
  previousIndicator.classList.add('pageIndicator--active');
  buttonPageForward.classList.add('nav--active');

  if(previousPage.previousElementSibling === null) {
    buttonPageBack.classList.remove('nav--active');
  }
};

function setMapStatusPosition() {
  const contentsElement = document.querySelector('.p-howToUse__contents');
  const contentsRect =    contentsElement.getBoundingClientRect();
  const offsetRight = innerWidth - contentsRect.right;
  const mapStatusRect = document.getElementById('js-mapStatus');
  const howToUseMapStatus = document.getElementById('js-howToUseLeftMapStatus');
  const mapStatusPosition = mapStatusRect.getBoundingClientRect();
  const offsetValue = 8;
  const topValue = mapStatusPosition.top - offsetValue;
  const rightValue = window.innerWidth - mapStatusPosition.right - offsetValue;
  const widthValue = mapStatusPosition.right - mapStatusPosition.left + offsetValue * 2;
  const heightValue = mapStatusPosition.bottom - mapStatusPosition.top + offsetValue * 2;

  howToUseMapStatus.style.top = topValue + 'px';
  howToUseMapStatus.style.right = rightValue - offsetRight + 'px';
  howToUseMapStatus.style.width = widthValue + 'px';
  howToUseMapStatus.style.height = heightValue + 'px';
}

function setLegendPosition() {
  const contentsElement = document.querySelector('.p-howToUse__contents');
  const contentsRect =    contentsElement.getBoundingClientRect();
  const operatorElement = document.getElementById('js-legendOperator');
  const howToUseLegend = document.getElementById('js-howToUseLeftOperator');
  const legendPosition = operatorElement.getBoundingClientRect();
  const offsetValue = 8;
  const offsetWidthValue = innerWidth * 0.1;
  const bottomValue = window.innerHeight - legendPosition.bottom - offsetValue;
  const leftValue = legendPosition.left -offsetValue;
  const widthValue = legendPosition.right - legendPosition.left + offsetValue * 2;
  const heightValue = legendPosition.bottom - legendPosition.top + offsetValue * 2;

  howToUseLegend.style.bottom = bottomValue + 'px';
  howToUseLegend.style.left = leftValue + offsetWidthValue / 2 - contentsRect.left + 'px';
  howToUseLegend.style.width = widthValue - offsetWidthValue + 'px';
  howToUseLegend.style.height = heightValue + 'px';
};

function getPositionOfExplanation(configs) {
  const contentsElement = document.querySelector('.p-howToUse__contents');
  const contentsRect =    contentsElement.getBoundingClientRect();

  configs.forEach(({ explanation, target, column, row}) => {
    const explanationElement = document.querySelector(explanation);
    const targetElement = typeof target === 'string' ?
      document.querySelector(target) : target;
  
    if(!explanationElement || !targetElement) return;

    const explanationRect = explanationElement.getBoundingClientRect();
    const targetRect =      targetElement.getBoundingClientRect();
    switch (column) {
      case 'right':
        explanationElement.style.left = `${targetRect.right - contentsRect.left}px`;
        break;
      case 'left':
        explanationElement.style.right = `${(window.innerWidth - targetRect.left) - (window.innerWidth - contentsRect.right)}px`;
        break;
      }
      
    switch(row) {
      case 'top':
        explanationElement.style.top = `${targetRect.top}px`;
        break;
      case 'center':
        const rowCenter = (targetRect.top + targetRect.height / 2) - (explanationRect.height / 2);
        explanationElement.style.top = `${rowCenter}px`;
        break;
      case 'bottom':
        const rowBottom = window.innerHeight - targetRect.bottom;
        explanationElement.style.bottom = `${rowBottom}px` 
    }
  });
};

function locateHowToUseExplanationPage1() {
  const configs = [
    {explanation: '.p-howToUse__left--menu',    target: '#open--boardMenu', 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__left--move',    target: '#js-buttonMove', 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__left--draw',    target: '#open--penSetting', 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__left--erase',   target: '#open--eraserSetting', 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__left--legend',  target: '#js-buttonLegend', 
      column:'right', row: 'center'}
    ];
        
  getPositionOfExplanation(configs);
}

function locateHowToUseExplanationPage2() {
  const configs = [
    {explanation: '.p-howToUse__right--operators',  target: '#open--operatorSetting', 
      column:'left', row: 'center'},
    {explanation: '.p-howToUse__right--stamps',     target: '#open--stampSetting', 
      column:'left', row: 'center'},
    {explanation: '.p-howToUse__right--maps',       target: '#open--mapSetting', 
      column:'left', row: 'center'},
    {explanation: '.p-howToUse__right--floors',     target: '#open--floorSetting', 
      column:'left', row: 'center'}
  ];

  getPositionOfExplanation(configs);
}

function locateHowToUseExplanationPage3() {
  const configs = [
    {explanation: '.p-howToUse__canvas--history',         target: '.p-canvas__history', 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__canvas--zoom',            target: '.p-canvas__btn--zooms', 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__canvas--operatorButton',  target: '#js-legend__operator--ATK1', 
      column:'right', row: 'bottom'}
  ];

  getPositionOfExplanation(configs);
}

function locateHowToUseExplanationPage4() {
  const operatorInLegend =  document.querySelector('#js-legend__operator--ATK1');
  const operatorItems = operatorInLegend.firstElementChild.children;
  const operatorStamp = operatorInLegend.lastElementChild;
  
  const configs = [
    {explanation: '.p-howToUse__canvas--draw',          target: operatorItems[0], 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__canvas--name',          target: operatorItems[1],
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__canvas--stamp',         target: operatorItems[2], 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__canvas--stampOperator', target: operatorStamp, 
      column:'right', row: 'center'}
  ];

  getPositionOfExplanation(configs);
}

/*********whatsSite*********/
function toggleWhatsSiteBoard() {
  const modal = document.querySelector('dialog.js-whatsSite');
  const openButton = document.getElementById('open--whatsSiteBoard');
  const closeButton = document.getElementById('close--whatsSite');

  openButton.addEventListener('click', () => {
    modal.parentNode.style.display = 'block';
    modal.style.display = 'block';
    modal.showModal();
  });

  closeButton.addEventListener('click', () => {
    modal.parentNode.style.display = 'none';
    modal.removeAttribute('style');
    modal.close();
  });
};

/*********draw*********/
function deactivateMove() {
  buttonMove.classList.remove('p-board__tools--active');
  moveMode = false;
  changeCanvasCursor();
};

function activateMove() {
  buttonMove.classList.add('p-board__tools--active');
  moveMode = true;
  lastMode = 'move';
  changeCanvasCursor();
};

function deactivateTools() {
  buttonDrawTools.forEach((drawTool) => {
    const isCheckActivation = drawTool.classList.contains('p-board__tools--active');

    if(isCheckActivation) {
      drawTool.classList.remove('p-board__tools--active');
    }
  });

  moveMode = false;
  drawMode = false;
};

function activateTools(clickedDrawTool) {
  clickedDrawTool.classList.add('p-board__tools--active');
  
  const id = clickedDrawTool.getAttribute('id');

  if(id === 'open--penSetting') {
    drawMode = 'pen';
    moveMode = false;
    lastMode = 'pen';
    changeCanvasCursor();

    currentColor = currentPenColor;
  } else {
    drawMode = 'eraser';
    moveMode = false;
    lastMode = 'eraser';
    changeCanvasCursor();
  }
};

function toggleDrawSetting(target) {
  const modal = target;
  const closeButton = target.children[0].children[0];
  const active = 'js-setting--active';
  
  modal.classList.add(active);
  modal.showModal();

  closeButton.addEventListener('click', () => {
    modal.classList.remove(active);
    modal.close();
  });
};

function deactivatePenBold() {
  penBoldSetting.forEach(penBold => {
    penBold.classList.remove('js-penBoldSelected')
  });
};

function activatePenBold(selectedBold, boldValue) {
  const selectedBoldElement = selectedBold.currentTarget;
  const displayPenBold = document.querySelector('.js-penBoldDisplay');

  selectedBoldElement.classList.add('js-penBoldSelected');
  displayPenBold.style.height = boldValue;

  const selectedBoldElementChild = selectedBoldElement.children[0]
  const isBold2px = selectedBoldElementChild.classList.contains('c-modal__penBold--2px');
  const isBold4px = selectedBoldElementChild.classList.contains('c-modal__penBold--4px');
  const isBold8px = selectedBoldElementChild.classList.contains('c-modal__penBold--8px');

  if(isBold2px) {
    penBoldValue = 2;
  } else if(isBold4px) {
    penBoldValue = 4;
  } else if(isBold8px) {
    penBoldValue = 8;
  }
};

function changeColorFromModal(color) {
  const displayColor = document.querySelector('.js-color');
  const colorValue = color.target.value;

  displayColor.style.backgroundColor = colorValue;
  console.log(colorValue);
  currentPenColor = colorValue;
};

function toggleOpacity() {
  const element = document.querySelector('.c-modal__opacity');
  const toggleSwitch = document.querySelector('.c-modal__penSetting--opacity');
  
  toggleSwitch.addEventListener('click', () => {
    const isOpened = element.classList.contains('js-opacityOpened');

    if(!isOpened) {
      element.classList.add('js-opacityOpened');
    } else {
      element.classList.remove('js-opacityOpened');
    }
  });
};

function changeOpacity(opacityStr) {
  const displayOpacity = document.querySelector('#js-displayOpacity');
  const opacityNum = Number(opacityStr);
  const opacity = opacityNum / 100;

  displayOpacity.textContent = `${opacityStr}%`;
  currentOpacity = opacity;
};

function deactivateEraserBold() {
  eraserBoldSetting.forEach(eraserBold => {
    eraserBold.classList.remove('js-eraserBoldSelected');
  });
};

function activateEraserBold(selectedBold, boldValue) {
  const selectedBoldElement = selectedBold.currentTarget;
  const displayEraserBold = document.querySelector('.js-eraserBoldDisplay');

  selectedBoldElement.classList.add('js-eraserBoldSelected');
  displayEraserBold.style.height = boldValue;

  const selectedBoldElementChild = selectedBoldElement.children[0];
  const isBold2px = selectedBoldElementChild.classList.contains('c-modal__eraserBold--2px');
  const isBold4px = selectedBoldElementChild.classList.contains('c-modal__eraserBold--4px');
  const isBold8px = selectedBoldElementChild.classList.contains('c-modal__eraserBold--8px');

  if(isBold2px) {
    eraserBoldValue = 2;
  } else if(isBold4px) {
    eraserBoldValue = 4;
  } else if(isBold8px) {
    eraserBoldValue = 8;
  }
};

/*********legend*********/
function toggleLegend() {
  const legend = document.querySelector('.p-canvas__legend');
  const mapStatus = document.querySelector('.p-canvas__mapStatus');
  const legendButton = document.getElementById('js-buttonLegend');

  legendButton.addEventListener('click', () => {
    legend.classList.toggle('p-canvas__legend--active');
    mapStatus.classList.toggle('p-canvas__mapStatus--active');
    legendButton.classList.toggle('p-board__legend--active');
  });
};

function updateMapStatus() {
  const mapStatusTextOfMap = document.getElementById('js-mapStatus--map');
  const mapStatusTextOfFloor = document.getElementById('js-mapStatus--floor');
  const floorNumber = floors.findIndex((floor) => floor === selectedFloor);

  mapStatusTextOfMap.textContent = selectedMap.mapName;
  mapStatusTextOfFloor.textContent = floorsNameForDisplay[floorNumber];
};

function changeColorFromLegend(activatedOperatorElement) {
  const userColor = getComputedStyle(activatedOperatorElement).borderTopColor;

  currentUserColor = userColor;
};



function deactivateOperator() {
  const operators = document.querySelectorAll('.p-canvas__operator');
  
  operators.forEach(operator => {
    operator.classList.remove('p-canvas__operator--active');
  });

  drawMode = false;
};

function deactivateItems() {
  const operatorGadgets = document.querySelectorAll('.p-canvas__operator--items');

  operatorGadgets.forEach(operatorGadget => {
    operatorGadget.classList.remove('items--active');
  });

  hookItemsActive = false;
};

function activateOperator(event) {
  const operator = event.target;
  const activateElement = operator.parentNode.parentNode;
  const targetKey = activateElement.getAttribute('id').slice(21);

  activateElement.classList.add('p-canvas__operator--active');

  deactivateMove();
  changeCanvasCursor();
  drawMode = 'pen';
  lastMode = `operatorPen--${targetKey}`;
};

function activateItems(event) {
  const operator = event.currentTarget;
  const gadgetElement = operator.previousElementSibling;

  gadgetElement.classList.add('items--active');
  hookItemsActive = true;
};

function activateGears() {
  const gears = document.querySelector('.p-canvas__gears');

  gears.classList.add('p-canvas__gears--active');
  hookGearsActive = true;
};

function deactivateGears() {
  const gears = document.querySelector('.p-canvas__gears');

  gears.classList.remove('p-canvas__gears--active');
  hookGearsActive = false;
};


function loadLegend() {
  Object.keys(selectedOperators).forEach(key => {
    //operatorセット時、もしくはblank時の処理
    for(let i = 0; i < selectedOperators[key].length; i++) {
      const operatorName = selectedOperators[key][i].operatorName;
      const hasSelectedGadgets = selectedOperators[key][i].hasOwnProperty('selectedGadgets');
      const selectedGadgets = selectedOperators[key][i].selectedGadgets;
      const isStriker = operatorName === 'striker';
      const isSentry  = operatorName === 'sentry';
      const isBlank   = operatorName === 'blank';
      const operatorContainer = document.querySelector(`#js-legend__operator--${key}${i + 1}`);
      const icon = operatorContainer.lastElementChild.lastElementChild;
      const ability = operatorContainer.firstElementChild.children[3];
      const gadgetContainer = operatorContainer.firstElementChild.children[2];
      const gadgets = Array.from(gadgetContainer.children);
      
      icon.setAttribute('src', selectedOperators[key][i].icon);
      icon.setAttribute('alt', 'operator_' + selectedOperators[key][i].operatorName);

      if(isStriker || isSentry) {
        ability.style.display = `none`;
      } else if (!isBlank) {
        ability.style.display = 'block';
        ability.setAttribute('src', selectedOperators[key][i].ability.img);
        ability.setAttribute('alt', 'ability_' + selectedOperators[key][i].ability.abilityName);
      }

      if(hasSelectedGadgets && selectedGadgets.length > 0) {
        for(let j = 0; j < selectedGadgets.length; j++) {
          gadgets[j].removeAttribute('style');
          gadgets[j].setAttribute('src', selectedGadgets[j].img);
          gadgets[j].setAttribute('alt', 'selectedGadget_' + selectedGadgets[j].gadgetName);
        }

        for(let j = selectedGadgets.length; j < gadgets.length; j++) {
          gadgets[j].style.display = 'none';
        }

      } else {
        for(let j = 0; j < gadgets.length; j++) {
        const gadgetNumber = `gadget${j + 1}`;
        
        const isCheckOperatorBlank = selectedOperators[key][i].operatorName === 'blank';
        const hasGadget = selectedOperators[key][i].hasOwnProperty([gadgetNumber]);


        if (!hasGadget && isCheckOperatorBlank) {
          gadgets[0].removeAttribute('style');

          for(let k = 1; k < gadgets.length; k++) {
            gadgets[k].style.display = 'none';
          }
          continue;
        } else if(!hasGadget && !isCheckOperatorBlank){
          gadgets[j].style.display = 'none';
          continue;
        }

        if(!hasSelectedGadgets ||selectedGadgets.length === 0) {
          gadgets[j].removeAttribute('style');
        }

        gadgets[j].setAttribute('src', selectedOperators[key][i][gadgetNumber].img);
        gadgets[j].setAttribute('alt', selectedOperators[key][i][gadgetNumber].gadgetName);
        }
      }
    }

    //operator未選択の時の処理
    for(let i = selectedOperators[key].length; i < 5; i++) {
      const operatorContainer = document.querySelector(`#js-legend__operator--${key}${i + 1}`);
      const gadgetContainer = operatorContainer.firstElementChild.children[2];
      const gadgets = Array.from(gadgetContainer.children);

      gadgets[0].removeAttribute('style');

      for(let j = 1; j < gadgets.length; j++) {
        gadgets[j].style.display = 'none';
      }
    }
  });
};

function nameChange(event) {
  const playerName = event.currentTarget.value;
  const outputPlayerNameToLegend = event.currentTarget.parentNode.nextElementSibling.firstElementChild;
  const arrayKind = 'operator' + event.currentTarget.getAttribute('name').slice(10, 13) + 's';
  const arrayNumber = Number(event.currentTarget.getAttribute('name').slice(13)) - 1;

  outputPlayerNameToLegend.textContent = playerName;
  selectedOperators[arrayKind][arrayNumber].playerName = playerName;
};

function changeOperatorColor(event) {
  const operatorColor = event.target.value;
  const displayElement = event.target.parentNode.parentNode.parentNode;

  displayElement.style.borderTopColor = operatorColor;
};

/*********right*********/
/*********operator*********/

function toggleOperatorSetting() {
  const modal = document.querySelector('dialog.js-operatorSetting');
  const openButton = document.getElementById('open--operatorSetting');
  const closeButton = document.getElementById('close--operatorSetting');

  openButton.addEventListener('click', () => {
    modal.showModal();
  });

  closeButton.addEventListener('click', () => {
    modal.close();
  });
};

function loadOperatorForOperatorSetting() {
  Object.keys(selectedOperators).forEach(key => {

    //operatorがselectedもしくはblankの場合
    for(let i = 0; i < selectedOperators[key].length; i++) {
      const operatorData = selectedOperators[key][i];
      const operatorName = operatorData.operatorName;
      const isStriker = operatorName === 'striker';
      const isSentry  = operatorName === 'sentry';
      const isBlank   = operatorName === 'blank';
      const operatorContainer = document.getElementById(`js-operatorSetting${key}${i + 1}`);
      const playerName = operatorContainer.children[0];
      const icon = operatorContainer.children[1];
      const ability = operatorContainer.children[2];
      const maxGadgetContainerCount = 7;
      const gadgetContainers = {};
      const gadgets = {};
      
      for(let j = 0; j < maxGadgetContainerCount; j++) {
        const containerKey = `operatorGadgetContainer${j + 1}`;
        gadgetContainers[containerKey] = operatorContainer.children[3].children[j];
        const gadgetKey =`gadget${j + 1}`;
        gadgets[gadgetKey] = gadgetContainers[containerKey].firstElementChild;
      }

      if(selectedOperators[key][i].hasOwnProperty('playerName')) {
        playerName.textContent = selectedOperators[key][i].playerName;

      } else if (isBlank) {
        playerName.textContent = 'name';

      } else {
        const text = selectedOperators[key][i].operatorName;
        playerName.textContent = text.charAt(0).toUpperCase() + text.slice(1);
      }

      icon.setAttribute('src', selectedOperators[key][i].icon);
      icon.setAttribute('alt', 'operator_' + selectedOperators[key][i].operatorName);
    
      if(isStriker || isSentry) {
        ability.style.display = 'none';
      } else {
        ability.removeAttribute('style');
        ability.setAttribute('src', selectedOperators[key][i].ability.img);
        ability.setAttribute('alt', 'ability_' + selectedOperators[key][i].ability.abilityName);
      }

      loadGadgetsForOperatorSetting(operatorData, operatorContainer);
    }
    
    //operatorがundefindの場合
    for(let i = selectedOperators[key].length; i < 5; i++) {
      const operatorContainer = document.getElementById(`js-operatorSetting${key}${i + 1}`);
      const gadgetContainers = operatorContainer.lastElementChild.children;

      for(let j = 0; j < 3; j++) {
        gadgetContainers[j].style.display = 'block';
      }

      for(let j = 3; j < gadgetContainers.length; j++) {
        gadgetContainers[j].style.display = 'none';
      }
    }
  });
};

function loadGadgetsForOperatorSetting(operatorData, operatorContainer) {
  const gadgetContainers = operatorContainer.lastElementChild.children;

  for(let i = 0; i < gadgetContainers.length /*maxGadgetContainerCount*/; i++) {
    const gadgetIcon = gadgetContainers[i].firstElementChild;
    const gadgetKey = `gadget${i + 1}`;
    const hasGadget = operatorData.hasOwnProperty(gadgetKey);

    if(hasGadget) {
      gadgetContainers[i].removeAttribute('style');
      gadgetContainers[i].classList.remove('blank');
      gadgetIcon.setAttribute('src', operatorData[gadgetKey].img);
      gadgetIcon.setAttribute('alt',`gadget${i}` + operatorData[gadgetKey].gadgetName);
      continue;
    } else if (!hasGadget && i < 3) {
      gadgetContainers[i].classList.add('blank');
      continue;
    } else {
      gadgetContainers[i].style.display = 'none';
    }
  }
};

let strikerGadgetCounter = 0;
let sentryGadgetCounter = 0;

function selectGadgetForOperatorSetting (e) {
  const targetGadgetContainer = e.currentTarget;
  const targetGadget = targetGadgetContainer.firstElementChild;
  const parentGadgetContainer = targetGadgetContainer.parentNode;
  const operatorIcon = parentGadgetContainer.previousElementSibling.previousElementSibling;
  const operatorName = operatorIcon.getAttribute('alt').slice(9);
  const gadgetContainers = Array.from(parentGadgetContainer.children);
  const gadgets = [];

  gadgetContainers.forEach(gadgetContainer => {
    gadgets.push(gadgetContainer.firstElementChild);
  });

  const isBlank = targetGadgetContainer.classList.contains('blank');

  if(isBlank) {
    return;
  }

  if(operatorName === 'striker') {
    const hasClassSelected = targetGadget.classList.contains('js-selectedGadget');

    if(!hasClassSelected && strikerGadgetCounter < 2 ) {
      addSelectedGadget(targetGadget);
      writeSelectedGadgetToSelectedOperators(operatorName, targetGadget);
      strikerGadgetCounter++;
      return;

    } else if (hasClassSelected && strikerGadgetCounter <= 2){
      removeSelectedGadget(targetGadget);
      removeSelectedGadgetToSelectedOperators(operatorName, targetGadget);
      strikerGadgetCounter--;
      return;

    } else {
      return;
    }
  } else if (operatorName ==='sentry'){
    const hasClassSelected = targetGadget.classList.contains('js-selectedGadget');

    if(!hasClassSelected && sentryGadgetCounter < 2) {
      addSelectedGadget(targetGadget);
      writeSelectedGadgetToSelectedOperators(operatorName, targetGadget);
      sentryGadgetCounter++;
      return;

    } else if(hasClassSelected && sentryGadgetCounter <= 2) {
      removeSelectedGadget(targetGadget);
      removeSelectedGadgetToSelectedOperators(operatorName, targetGadget);
      sentryGadgetCounter--;
      return;

    } else {
      return;
    }
  } else {
    gadgets.forEach(gadget => {
      gadget.classList.remove('js-selectedGadget');
    });
    targetGadget.classList.add('js-selectedGadget');
    writeSelectedGadgetToSelectedOperators(operatorName, targetGadget);
  }
};

function addSelectedGadget(targetGadget) {
  targetGadget.classList.add('js-selectedGadget');
};

function removeSelectedGadget(targetGadget) {
  targetGadget.classList.remove('js-selectedGadget');
};

function writeSelectedGadgetToSelectedOperators(operatorName, targetGadget) {
  Object.keys(selectedOperators).forEach(key => {

    selectedOperators[key].forEach(selectedOperator => {
      const isOperator = selectedOperator.operatorName === operatorName;
      const isStriker = operatorName === 'striker';
      const isSentry  = operatorName === 'sentry';

      if(isOperator) {
        currentGadget = {};
        currentGadget.img = targetGadget.getAttribute('src');
        currentGadget.gadgetName = targetGadget.getAttribute('alt');

        selectedOperator.selectedGadgets.push(currentGadget);
        if(!(isStriker || isSentry) && selectedOperator.selectedGadgets.length >= 2) {
          selectedOperator.selectedGadgets.shift();
        }
      }
    });
  });
};

function removeSelectedGadgetToSelectedOperators(operatorName, targetGadget) {
  Object.keys(selectedOperators).forEach(key => {
    selectedOperators[key].forEach(selectedOperator => { //HACK:findで書き直せるかも
      const isOperator = selectedOperator.operatorName === operatorName;
      const targetGadgetName = targetGadget.getAttribute('alt');
      
      if(isOperator) {
        const selectedGadgets = selectedOperator.selectedGadgets;
        const gadgetIndex = selectedGadgets.findIndex((selectedGadget) => selectedGadget.gadgetName === targetGadgetName);

        selectedGadgets.splice(gadgetIndex, 1);
      }
    })
  })
}


function initializeGadgetsInOperatorSetting(side, operatorNumber) {
  const operatorContainer = document.querySelector(`#js-operatorSetting${side}${operatorNumber}`);
  const gadgets = Array.from(operatorContainer.children[3].children);
  
  gadgets.forEach(gadget => {
    const gadgetIcon = gadget.firstElementChild;

    gadget.classList.remove('blank');
    gadgetIcon.classList.remove('js-selectedGadget');
    gadget.classList.add('blank');
  });
};


function toggleIconSettingATK() {
  const modal = document.querySelector('dialog.js-iconSettingATK');
  const openButton = document.getElementById('open--iconSettingATK');
  const closeButton = document.getElementById('close--iconSettingATK')

  openButton.addEventListener('click', () => {
    modal.showModal();
  });

  closeButton.addEventListener('click', () => {
    modal.close();
  });
};

function toggleIconSettingDEF() {
  const modal = document.querySelector('dialog.js-iconSettingDEF');
  const openButton = document.getElementById('open--iconSettingDEF');
  const closeButton = document.getElementById('close--iconSettingDEF')

  openButton.addEventListener('click', () => {
    modal.showModal();
  });

  closeButton.addEventListener('click', () => {
    modal.close();
  });
};

function loadIconSetting() {
  Object.keys(selectedOperators).forEach(key => {
    const sideContainer = document.querySelector(`#js-iconSetting__selected${key}`);

    for(let i = 0; i < selectedOperators[key].length; i++) {
      const operatorContainer = sideContainer.children[i + 1];
      const operatorIcon = operatorContainer.children[1];
      const playerName = operatorContainer.lastElementChild;

      operatorIcon.setAttribute('src', selectedOperators[key][i].icon)
      operatorIcon.setAttribute('alt', 'selectedOperator_' + selectedOperators[key][i].operatorName);
      playerName.textContent = selectedOperators[key][i].playerName;
    }
  });
};

function iconSettingRemoveSelectedIcon(e) {
  const iconContainer = e.currentTarget;
  const icon = iconContainer.children[1];

  icon.setAttribute('src', 'image/icon_operator/figure.png');
  icon.setAttribute('alt', 'icon_blank');

  const id = iconContainer.getAttribute('id');
  const key = id.slice(24, 27);
  const operatorNumber = Number(id.slice(29));
  const arrayNumber = operatorNumber - 1;
  const targetArray = selectedOperators[key][arrayNumber];

  targetArray.icon = 'image/icon_operator/figure.png';
  targetArray.operatorName = 'blank';

  targetArray.ability = {};
  targetArray.ability.img = 'image/icon_ability/ability__empty.png';
  targetArray.ability.abilityName = 'blank';

  for(let i = 1; i <= 3; i++) {
    const gadgetKey = `gadget${i}`;

    if(targetArray.hasOwnProperty(gadgetKey)) {
      targetArray[gadgetKey].img = 'image/icon_gadget/gadget__empty.png';
      targetArray[gadgetKey].gadgetName = 'blank';
    } 
  }

  for(let i = 4; i < 8; i++) {
    const gadgetKey = `gadget${i}`;
    if(targetArray.hasOwnProperty(gadgetKey)) {
      delete targetArray[gadgetKey];
    }
  }

  initializeGadgetsInOperatorSetting(key, operatorNumber);
};

function loadIconSetttingSelectedIconsRight() {
  Object.keys(selectedOperators).forEach(key => {
    const operatorContainers = Array.from(document.querySelectorAll(`.js-operator${key}`));
    
    const selectedOperatorsRight = selectedOperators[key].map(selectedOperator => {
      return selectedOperator.operatorName;
    });

    for(let i = 0; i < selectedOperatorsRight.length; i++) {
      const selectedOperatorName = selectedOperatorsRight[i];

      operatorContainers.forEach(operatorContainer => {
        const operator = operatorContainer.lastElementChild;
        const operatorName = operator.getAttribute('alt').slice(9);
        const checkName = selectedOperatorName === operatorName;
        const checkElement = operatorContainer.firstElementChild;
        const checkClass = checkElement.classList.contains('counter');
        

        if(!checkName && !checkClass) {
          return;
        } else if(!checkName && checkClass) {
          const checkNumber = checkElement.firstElementChild.textContent === `${i + 1}`;

          if(!checkNumber) {
            return;
          } else {
            operatorContainer.firstElementChild.remove();
            return;
          }
        
        } else if(checkName && !checkClass) {
          operatorContainer.insertAdjacentHTML("afterbegin",
            `
              <div class="counter">
                <p>${i + 1}</p>
              </div>
            `
          );
          return;
        }
      });
    }
  });
};

function initializeSelectedOperatorToArray(targetArrayOperator) {
  targetArrayOperator.icon = 'image/icon_operator/figure.png';
  targetArrayOperator.operatorName = 'blank';

  targetArrayOperator.ability = {};
  targetArrayOperator.ability.img = 'image/icon_ability/ability__empty.png';
  targetArrayOperator.ability.abilityName = 'blank';

  for(let i = 1; i <= 3; i++ ) {
    const gadgetKey = `gadget${i}`;

    if(targetArrayOperator.hasOwnProperty(gadgetKey)) {
      targetArrayOperator[gadgetKey].img = 'image/icon_gadget/gadget__empty.png';
      targetArrayOperator[gadgetKey].gadgetName = 'blank';
    }
  }

  for(let i = 4; i < 8; i++) {
    const gadgetKey = `gadget${i}`;
    if(targetArrayOperator.hasOwnProperty(gadgetKey)) {   
      delete targetArrayOperator[gadgetKey];
    }
  }
};

function removeIconSettingIcon(key, e) { 
  const clickedIconContainer = e.currentTarget;
  const removedNumber = Number(clickedIconContainer.firstElementChild.textContent);
  const removedArrayNumber = removedNumber - 1;
  const removedArrayOperator = selectedOperators[key][removedArrayNumber];

  clickedIconContainer.firstElementChild.remove();

  initializeSelectedOperatorToArray(removedArrayOperator);
  loadIconSetting();
  initializeGadgetsInOperatorSetting(key, removedNumber);
  loadOperatorForOperatorSetting();
  loadLegend();
};

function insertIconSettingIcon(key, e) {
  const clickedIconContainer = e.currentTarget;

  const arrayToFind = selectedOperators[key].map(selectedOperator => {
    return selectedOperator.operatorName;
  });

  const changeIcon = (arrayNumber) => {
    clickedIconContainer.insertAdjacentHTML("afterbegin",
      `
        <div class="counter">
        <p>${arrayNumber + 1}</p>
        </div>
      `
    );

    const clickedOperatorName = clickedIconContainer.lastElementChild.getAttribute('alt').slice(9);
    const operatorItem = operatorPool[key][clickedOperatorName];
    operatorItem.operatorName = clickedOperatorName;
    operatorItem.selectedGadgets = [];
    const newOperator = JSON.parse(JSON.stringify(operatorItem));
    selectedOperators[key][arrayNumber] = newOperator;

    loadIconSetting();
  };

  const blankArrayNumber = arrayToFind.findIndex((operatorName) => operatorName === 'blank');

  if(blankArrayNumber === -1 && arrayToFind.length <= 4) {
    const notSelectedNumber = arrayToFind.length;
    changeIcon(notSelectedNumber);
    return;
  } else if (blankArrayNumber === -1 && arrayToFind.length > 4) {
    console.log('error:overload')
    return;
  }
  
  changeIcon(blankArrayNumber);
};

/*********stamp*********/
function toggleStamp() {
  const modal = document.querySelector('dialog.js-stampSetting');
  const openButton = document.getElementById('open--stampSetting');
  const closeButton = document.getElementById('close--stampSetting');

  openButton.addEventListener('click', () => {
    modal.showModal();
  });

  closeButton.addEventListener('click', () => {
    modal.close();
  });
};

/*********maps*********/
function toggleMapSetting() {
  const modal = document.querySelector('dialog.js-mapSetting');
  const openButton = document.getElementById('open--mapSetting');
  const closeButton = document.getElementById('close--mapSetting');

  openButton.addEventListener('click', () => {
    modal.showModal();
  });

  closeButton.addEventListener('click', () => {
    modal.close();
  });
};

function loadSelectedMapObjFromMapSetting(e) {
  const mapContainer = e.currentTarget;
  const mapName = mapContainer.getAttribute('id').slice(15);
  const map = {
    blueprint: {}
  };

  map.mapName = mapName;
  map.img = mapPool[mapName].img;
  map.blueprint.basement2nd = mapPool[mapName].basement2nd ? mapPool[mapName].basement2nd : '';
  map.blueprint.basement = mapPool[mapName].basement ? mapPool[mapName].basement : '';
  map.blueprint.floor1st = mapPool[mapName].floor1st ? mapPool[mapName].floor1st : '';
  map.blueprint.floor2nd = mapPool[mapName].floor2nd ? mapPool[mapName].floor2nd : '';
  map.blueprint.floor3rd = mapPool[mapName].floor3rd ? mapPool[mapName].floor3rd : '';
  map.blueprint.roof = mapPool[mapName].roof ? mapPool[mapName].roof : ''; 
  
  const newMap = JSON.parse(JSON.stringify(map));
  selectedMap = newMap;

  window.sessionStorage.setItem('selectedMapName', mapName);
  window.sessionStorage.setItem('selectedMapURL', selectedMap.img);
};

/*********floor*********/
function toggleFloorSetting() {
  const modal = document.querySelector('dialog.js-floorSetting');
  const openButton = document.getElementById('open--floorSetting');
  const closeButton = document.getElementById('close--floorSetting');

  openButton.addEventListener('click', () => {
    modal.showModal();
  });

  closeButton.addEventListener('click', () => {
    modal.close();
  });
};

function loadSelectedFloorFromFloorSetting(e) {
  const floorContainer = e.currentTarget;
  const floor = floorContainer.getAttribute('id').slice(28);
  
  selectedFloor = floor;

  window.sessionStorage.setItem('selectedFloor', floor);

  floors.forEach(floor => {
    const floorContainer = document.getElementById(`js-floorSetting__floorList--${floor}`);
    isCheck = selectedMap.blueprint[`${floor}`] === '';
    
    if (isCheck) {
      floorContainer.style.display = 'none';
    } else {
      floorContainer.style.display ='block';
    }
  });
};

/*********実行*********/

window.addEventListener('load', () => {
  toggleMenu();
  toggleSetting();
  toggleHowToUse();
  activateMove();
  setMapStatusPosition(); //メンテナンス中はここをコメントアウト
  setLegendPosition(); //メンテナンス中はここをコメントアウト
  checkFirstVisit();
});

window.addEventListener('resize', () => {
  setMapStatusPosition(); //メンテナンス中はここをコメントアウト
  setLegendPosition(); //メンテナンス中はここをコメントアウト
  locateHowToUseExplanationPage1();
});

/*howToUse*/ //メンテナンス中はここをコメントアウト

buttonPageForward.addEventListener('click', () => {
  forwardHowToUsePage();

  const activePage = document.querySelector('.pageContent--active');
  const currentPageNumber = Number(activePage.getAttribute('id').slice(17));
  switchInformation(currentPageNumber);
});

buttonPageBack.addEventListener('click', () => {
  backHowToUsePage();

  const activePage = document.querySelector('.pageContent--active');
  const currentPageNumber = Number(activePage.getAttribute('id').slice(17));
  switchInformation(currentPageNumber);
});

toggleWhatsSiteBoard();

buttonMove.addEventListener('click', () => {
  deactivateTools();
  deactivateOperator();
  drawMode = false;
  activateMove();
});

buttonDrawTools.forEach((buttonDrawTool) => {
  buttonDrawTool.addEventListener('click', (event) => {
    const clickedDrawTool = event.currentTarget;
    const checkDrawToolActive = clickedDrawTool.classList.contains('p-board__tools--active');
    const targetSetting = clickedDrawTool.nextElementSibling;
    const checkSettingActive = targetSetting.classList.contains('js-setting--active');
    
    if(checkDrawToolActive === false && checkSettingActive === false ) {
      deactivateOperator();
      deactivateMove();
      deactivateTools();
      activateTools(clickedDrawTool);
    } else if (checkDrawToolActive === true && checkSettingActive === false) {
      toggleDrawSetting(targetSetting);
    }
  });
});

penBoldSetting.forEach(boldButton => {
  boldButton.addEventListener('click', (event) => {
    const boldElement = event.currentTarget.children[0];
    const boldValue = getComputedStyle(boldElement).height;

    deactivatePenBold();
    activatePenBold(event, boldValue);
  });
});

colorPicker.addEventListener('input', (event) => {
  changeColorFromModal(event);
  currentColor = currentPenColor;
});

toggleOpacity();

opacitySlider.addEventListener('change', () => {
  const opacityStr = opacitySlider.value;
  
  changeOpacity(opacityStr);
});

eraserBoldSetting.forEach(boldButton => {
  boldButton.addEventListener('click', (event) => {
    const boldElement = event.currentTarget.children[0];
    const boldValue = getComputedStyle(boldElement).height;

    deactivateEraserBold();
    activateEraserBold(event, boldValue);
  });
});

toggleLegend();
loadLegend();

operatorButtons.forEach(clickedButton => {
  clickedButton.addEventListener('click', (e) => {
    const activatedOperatorElement = clickedButton.parentNode;
    const activatedItemsElement = clickedButton.previousElementSibling;
    const checkOperatorActive = activatedOperatorElement.classList.contains('p-canvas__operator--active');
    const checkItemsActive = activatedItemsElement.classList.contains('items--active');

    if(checkOperatorActive === true && checkItemsActive === true) {
      //console.log(1);
      deactivateItems();
      deactivateOperator();
      activateOperator(e);
      
    }else if(checkOperatorActive === true && checkItemsActive === false) {
      //console.log(2);
      activateItems(e);

    }else if(checkOperatorActive === false) {
      //console.log(3);
      deactivateTools();
      deactivateItems();
      deactivateOperator();
      deactivateGears();
      activateOperator(e);
      changeColorFromLegend(activatedOperatorElement);
      currentColor = currentUserColor;
    }
  });
});

gearButton.addEventListener('click', (e) => {
  e.stopPropagation();
  const gears = document.querySelector('.p-canvas__gears');
  const checkGearsActive = gears.classList.contains('p-canvas__gears--active');

  if(!checkGearsActive) {
    deactivateItems();
    deactivateOperator();
    activateGears();
  } else {
    deactivateGears();
  }
});


document.addEventListener('click', (e) => {
  if(hookItemsActive){
    const activatedOperatorElement = document.querySelector('.p-canvas__operator--active');
    const rect = activatedOperatorElement.getBoundingClientRect();
    const isItemsColliding = isRectColliding(e, rect);

    if(!isItemsColliding) {
      deactivateItems();
      deactivateGears();
    }
  } 
  
  if(hookGearsActive) {
    const gears = document.querySelector('.p-canvas__gears');
    const isGearsColliding = isRectColliding(e, gears);

    if(!isGearsColliding) {
      deactivateGears();
    }
  }
});

players.forEach(player => {
  player.addEventListener('input',(event) => {
    nameChange(event);
    loadOperatorForOperatorSetting();
    loadIconSetting();
  });
});

operatorColorButtons.forEach(operatorColorButton => {
  operatorColorButton.addEventListener('input', (event) => {
    const activatedOperatorElement = event.target.parentNode.parentNode.parentNode;
    
    changeOperatorColor(event);
    changeColorFromLegend(activatedOperatorElement);
    currentColor = currentUserColor;
  });
});


operatorSettingGadgets.forEach(operatorSettingGadget => {
  operatorSettingGadget.addEventListener('click', (e) => {
    selectGadgetForOperatorSetting(e);
    loadLegend();
  });
});


/*********right*********/
loadOperatorForOperatorSetting();

toggleIconSettingATK();
toggleIconSettingDEF();
loadIconSetting();
loadIconSetttingSelectedIconsRight();

iconSettingSelectedIconsLeft.forEach(selectedIcon => {
  selectedIcon.addEventListener('click', (e) => {
    iconSettingRemoveSelectedIcon(e);
    loadIconSetttingSelectedIconsRight();
    loadOperatorForOperatorSetting();
    loadLegend();
  });
});

Object.keys(selectedOperators).forEach(key => {
  const iconSettingOperators = document.querySelectorAll(`.js-operator${key}`);
  //const buttonReturn = document.getElementById(`js-iconSettingReturn${key}`);

  iconSettingOperators.forEach(iconSettingOperator => {
    iconSettingOperator.addEventListener('click', (e) => {
      const targetIconContainer = e.currentTarget;
      const checkCounter = targetIconContainer.firstElementChild.classList.contains('counter');

      if(checkCounter) {
        removeIconSettingIcon(key, e);
        loadOperatorForOperatorSetting();
        loadLegend();
      } else {
        insertIconSettingIcon(key, e);
        loadOperatorForOperatorSetting();
        loadLegend();
      }
    });
  });

  //TODO: operatorsをセッションに保存。returnのクリック時。
});

maps.forEach(map => {
  map.addEventListener('click', (e) => {
    const modal = document.querySelector('dialog.js-mapSetting');
    selectedFloor = 'floor1st';
    window.sessionStorage.setItem('selectedFloor', 'floor1st');
    loadSelectedMapObjFromMapSetting(e);
    canvasAllClear();
    updateMapStatus();
    loadSelectedFloorFromSession();
    loadMap();
    modal.close(); 
  });
});

floorContainers.forEach(floorContainer => {
  floorContainer.addEventListener('click', (e) => {
    const modal = document.querySelector('dialog.js-floorSetting');
    loadSelectedFloorFromFloorSetting(e);
    updateMapStatus();
    loadMap();
    modal.close();
  });
});

toggleOperatorSetting();
toggleStamp();
toggleMapSetting();
toggleFloorSetting();
