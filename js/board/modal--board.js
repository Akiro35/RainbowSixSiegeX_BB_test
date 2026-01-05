/*********menu*********/
const buttonPageForward = document.getElementById('js-howToUse--forward');
const buttonPageBack = document.getElementById('js-howToUse--back');

/*********left*********/
const buttonMove = document.getElementById('js-buttonMove');
let checkMoveActive = true;

const buttonDrawTools = document.querySelectorAll('.js-drawTools');
const penBoldSetting = document.querySelectorAll('.js-penBold');
const eraserBoldSetting = document.querySelectorAll('.js-eraserBold');

let currentColor = '#ffffff';
let currentPenColor = '#ffffff';
let currentUserColor;
let penBoldValue = 2;

const operatorButtons = document.querySelectorAll('.p-canvas__btn--operator');
const colorPicker = document.querySelector('#js-penColor');
const transparencySlider = document.querySelector('#penTransparency');

let hookSelectedDrawTool;
let hookItemsActive;

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
function toggleHowToUse() {
  const howToUse = document.getElementById('js-howToUse');
  const menu = document.querySelector('nav.js-board__menu');
  const openButton = document.getElementById('open--howToUse');
  const closeButton = document.getElementById('close--howToUse');

  openButton.addEventListener('click', () => {
    menu.classList.remove('l-body__menu--active');
    howToUse.classList.add('p-howToUse--active');
  });

  closeButton.addEventListener('click', () => {
    howToUse.classList.remove('p-howToUse--active');
    deactivateItems();
    deactivateOperator();
  })
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
  const mapStatusRect = document.getElementById('js-mapStatus');
  const howToUseMapStatus = document.getElementById('js-howToUseLeftMapStatus');
  const mapStatusPosition = mapStatusRect.getBoundingClientRect();
  const offsetValue = 8;
  const topValue = mapStatusPosition.top - offsetValue;
  const rightValue = window.innerWidth - mapStatusPosition.right - offsetValue;
  const widthValue = mapStatusPosition.right - mapStatusPosition.left + offsetValue * 2;
  const heightValue = mapStatusPosition.bottom - mapStatusPosition.top + offsetValue * 2;

  howToUseMapStatus.style.top = topValue + 'px';
  howToUseMapStatus.style.right = rightValue + 'px';
  howToUseMapStatus.style.width = widthValue + 'px';
  howToUseMapStatus.style.height = heightValue + 'px';
}

function setLegendPosition() {
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
  howToUseLegend.style.left = leftValue + offsetWidthValue / 2 + 'px';
  howToUseLegend.style.width = widthValue - offsetWidthValue + 'px';
  howToUseLegend.style.height = heightValue + 'px';
};

function locateCanvasExplanation() {
  const zoomExplanation = document.querySelector('.p-howToUse__canvas--zoom');
  const colorExplanation = document.querySelector('.p-howToUse__canvas--draw');
  const nameExplanation = document.querySelector('.p-howToUse__canvas--name');
  const stampExplanation = document.querySelector('.p-howToUse__canvas--stamp');
  const operatorExplanation = document.querySelector('.p-howToUse__canvas--control');

  const zoomElement = document.querySelector('.p-canvas__btn--zooms');
  const operatorForExample = document.querySelector('.p-canvas__operator');
  const colorElement = operatorForExample.firstElementChild.children[0];
  const nameElement = operatorForExample.firstElementChild.children[1];
  const stampElement = operatorForExample.firstElementChild.children[2];
  const operatorElement = operatorForExample.lastElementChild;

  const zoomPosition = zoomElement.getBoundingClientRect();
  const colorPosition = colorElement.getBoundingClientRect();
  const namePosition = nameElement.getBoundingClientRect();
  const stampPosition = stampElement.getBoundingClientRect();
  const operatorPosition = operatorElement.getBoundingClientRect();

  zoomExplanation.style.top = zoomPosition.y + 'px';
  zoomExplanation.style.left = zoomPosition.right + 'px';

  colorExplanation.style.top = colorPosition.y + 'px';
  colorExplanation.style.left = colorPosition.right + 'px';

  nameExplanation.style.top = namePosition.y + 'px';
  nameExplanation.style.left = namePosition.right + 'px';

  stampExplanation.style.top = stampPosition.y + (stampPosition.bottom - stampPosition.y) / 2 + 'px';
  stampExplanation.style.left = stampPosition.right + 'px';

  operatorExplanation.style.top = operatorPosition.y + 'px';
  operatorExplanation.style.left = operatorPosition.right + 'px';
};

/*********whatsSite*********/
function toggleWhatsSiteBoard() {
  const modal = document.querySelector('dialog.js-whatsSite');
  const openButton = document.getElementById('open--whatsSiteBoard');
  const closeButton = document.getElementById('close--whatsSite');

  openButton.addEventListener('click', () => {
    modal.style.display = 'block';
    modal.showModal();
  });

  closeButton.addEventListener('click', () => {
    modal.close();
  });
};

/*********draw*********/
function deactivateMove() {
  const checkActivation = buttonMove.classList.contains('p-board__tools--active');

  if(checkActivation) {
    buttonMove.classList.remove('p-board__tools--active');
    checkMoveActive = false;
  }
};

function activeMove() {
  buttonMove.classList.add('p-board__tools--active');
  checkMoveActive = true;
};

function deactivateTools() {
  buttonDrawTools.forEach((drawTool) => {
    const checkActivation = drawTool.classList.contains('p-board__tools--active');

    if(checkActivation) {
      drawTool.classList.remove('p-board__tools--active');
    }
  });
};

function activateTools(clickedDrawTool) {
  clickedDrawTool.classList.add('p-board__tools--active');
  
  const id = clickedDrawTool.getAttribute('id');

  if(id === 'open--penSetting') {
    hookSelectedDrawTool = 'pen';
    checkMoveActive = false;
    currentColor = currentPenColor;
  } else {
    hookSelectedDrawTool = 'eraser';
    checkMoveActive = false;
  }
};

function toggleDrawSetting(button, target) {
  const openButton = button;
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
  const checkBold2px = selectedBoldElementChild.classList.contains('c-modal__penBold--2px');
  const checkBold4px = selectedBoldElementChild.classList.contains('c-modal__penBold--4px');
  const checkBold8px = selectedBoldElementChild.classList.contains('c-modal__penBold--8px');

  if(checkBold2px) {
    penBoldValue = 2;
  } else if(checkBold4px) {
    penBoldValue = 4;
  } else if(checkBold8px) {
    penBoldValue = 8;
  }
};

function changeColorFromModal(color) {
  const displayColor = document.querySelector('.js-color');
  const colorValue = color.target.value;

  displayColor.style.backgroundColor = colorValue;
  currentPenColor = colorValue;
};

function toggleTransparency() {
  const element = document.querySelector('.c-modal__transparency');
  const toggleSwitch = document.querySelector('.c-modal__penSetting--transparency');

  toggleSwitch.addEventListener('click', () => {
    element.classList.toggle('js-transparencyOpened');
  });
};

function changeTransparency(transparency) {
  const displayTransparency = document.querySelector('#js-displayTransparency');

  displayTransparency.textContent = `${transparency}%` ;
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
};

/*********legend*********/
function toggleLegend() {
  const legend = document.querySelector('.p-canvas__legend');
  const mapStatus = document.querySelector('.p-canvas__mapStatus');
  const legendButton = document.getElementById('buttonLegend');

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
};

function deactivateItems() {
  const operatorGadgets = document.querySelectorAll('.p-canvas__operator--items');

  operatorGadgets.forEach(operatorGadget => {
    operatorGadget.classList.remove('items--active');
  });
};

function activateOperator(event) {
  const operator = event.target;
  const activateElement = operator.parentNode.parentNode;

  activateElement.classList.add('p-canvas__operator--active');
  hookSelectedDrawTool = 'pen';
};

function activateItems(event) {
  const operator = event.currentTarget;
  const gadgetElement = operator.previousElementSibling;

  gadgetElement.classList.add('items--active');
};

function activateGears() {
  const gears = document.querySelector('.p-canvas__gears');

  gears.classList.add('p-canvas__gears--active');
};

function deactivateGears() {
  const gears = document.querySelector('.p-canvas__gears');

  gears.classList.remove('p-canvas__gears--active');
};


//TODO: strikerなどの仕様を追加する。
function loadLegend() {
  Object.keys(selectedOperators).forEach(key => {

    for(let i = 0; i < selectedOperators[key].length; i++) {
      const operatorContainer = document.querySelector(`#js-legend__operator--${key}${i + 1}`);
      const icon = operatorContainer.lastElementChild.lastElementChild;
      const ability = operatorContainer.firstElementChild.children[3];
      const gadgetContainer = operatorContainer.firstElementChild.children[2];
      const gadgets = Array.from(gadgetContainer.children);

      icon.setAttribute('src', selectedOperators[key][i].icon);
      icon.setAttribute('alt', 'operator_' + selectedOperators[key][i].operatorName);

      ability.setAttribute('src', selectedOperators[key][i].ability.img);
      ability.setAttribute('alt', 'ability_' + selectedOperators[key][i].ability.abilityName);

      if(selectedOperators[key][i].hasOwnProperty('selectedGadget')) {
        gadgets[0].setAttribute('src', selectedOperators[key][i].selectedGadget.img);
        gadgets[0].setAttribute('alt', 'selectedGadget_' + selectedOperators[key][i].selectedGadget.gadgetName);

        for(let j = 1; j < gadgets.length; j++) {
          gadgets[j].style.display = 'none';
        }

      } else {
        for(let j = 0; j < gadgets.length; j++) {
        const gadgetNumber = `gadget${j + 1}`;
        
        const checkOperator = selectedOperators[key][i].operatorName === 'blank';

        if (!selectedOperators[key][i].hasOwnProperty([gadgetNumber]) && checkOperator) {
          gadgets[j].removeAttribute('style');
          continue;
        } else if(!selectedOperators[key][i].hasOwnProperty([gadgetNumber]) && !checkOperator){
          gadgets[j].style.display = 'none';
          continue;
        }

        gadgets[j].setAttribute('src', selectedOperators[key][i][gadgetNumber].img);
        gadgets[j].setAttribute('alt', selectedOperators[key][i][gadgetNumber].gadgetName);
        }
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

function loadOperatorSetting() {
  Object.keys(selectedOperators).forEach(key => {
    
    for(let i = 0; i < selectedOperators[key].length; i++) {
      const operatorContainer = document.getElementById(`js-operatorSetting${key}${i + 1}`);
      const playerName = operatorContainer.children[0];
      const operatorIcon = operatorContainer.children[1];
      const operatorAbility = operatorContainer.children[2];
      const operatorGadgetContainers = {};
      const operatorGadgets = {};
      
      for(let j = 0; j < 3; j++) {
        const containerKey = `operatorGadgetContainer${j + 1}`;
        operatorGadgetContainers[containerKey] = operatorContainer.children[3].children[j];
        const gadgetKey =`gadget${j + 1}`;
        operatorGadgets[gadgetKey] = operatorGadgetContainers[containerKey].firstElementChild;

      }

      if(selectedOperators[key][i].hasOwnProperty('playerName')) {
        playerName.textContent = selectedOperators[key][i].playerName;

      } else if (selectedOperators[key][i].operatorName === 'blank') {
        playerName.textContent = 'name';

      } else {
        const text = selectedOperators[key][i].operatorName;
        playerName.textContent = text.charAt(0).toUpperCase() + text.slice(1);
      }

      operatorIcon.setAttribute('src', selectedOperators[key][i].icon);
      operatorIcon.setAttribute('alt', 'operator_' + selectedOperators[key][i].operatorName);
      operatorAbility.setAttribute('src', selectedOperators[key][i].ability.img);
      operatorAbility.setAttribute('alt', 'ability_' + selectedOperators[key][i].ability.abilityName);

      for(let j = 0; j < 3; j++) {
        const gadgetKey = `gadget${j + 1}`;
        const containerKey = `operatorGadgetContainer${j + 1}`;
        if(selectedOperators[key][i].hasOwnProperty(gadgetKey)) {
          const checkGadgetBlank = selectedOperators[key][i][gadgetKey].gadgetName === 'blank';
          if(!checkGadgetBlank) {
            operatorGadgetContainers[containerKey].classList.remove('blank');
          }
          
          operatorGadgets[gadgetKey].setAttribute('src', selectedOperators[key][i][gadgetKey].img);
          operatorGadgets[gadgetKey].setAttribute('alt', `gadget${j}` + selectedOperators[key][i][gadgetKey].gadgetName);
        }
      }
    }
  });
};

function selectGadget(e) {
  const targetGadgetContainer = e.currentTarget;
  const targetGadget = targetGadgetContainer.firstElementChild;
  const parentGadgetContainer = targetGadgetContainer.parentNode;
  const gadgetContainers = Array.from(parentGadgetContainer.children);
  const gadgets = [];

  gadgetContainers.forEach(gadgetContainer => {
    gadgets.push(gadgetContainer.firstElementChild);
  });

  const checkBlank = targetGadgetContainer.classList.contains('blank');

  if(checkBlank) {
    return;
  } else {
    gadgets.forEach(gadget => {
      gadget.classList.remove('js-selectedGadget');
    });
    targetGadget.classList.add('js-selectedGadget');

    const operatorIcon = parentGadgetContainer.previousElementSibling.previousElementSibling;
    const operatorName = operatorIcon.getAttribute('alt').slice(9);

    Object.keys(selectedOperators).forEach(key => {
      selectedOperators[key].forEach(operator => {
        if (operator.operatorName === operatorName) {
          operator.selectedGadget = {};
          operator.selectedGadget.img = targetGadget.getAttribute('src');
          operator.selectedGadget.gadgetName = targetGadget.getAttribute('alt');
        }
      });
    });
  }
};

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
  targetArray.ability.img = 'image/icon_ability/ability__empty.png';
  targetArray.ability.abilityName = 'blank';

  for(let i = 1; i <= 3; i++) {
    const gadgetKey = `gadget${i}`;

    if(!targetArray.hasOwnProperty(gadgetKey)){
      continue;
    }

    targetArray[gadgetKey].img = 'image/icon_gadget/gadget__empty.png';
    targetArray[gadgetKey].gadgetName = 'blank';
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
  targetArrayOperator.ability.img = 'image/icon_ability/ability__empty.png';
  targetArrayOperator.ability.abilityName = 'blank';
  for(let i = 1; i <= 3; i++ ) {
    const gadgetKey = `gadget${i}`;

    if(targetArrayOperator.hasOwnProperty(gadgetKey)) {
      targetArrayOperator[gadgetKey].img = 'image/icon_gadget/gadget__empty.png';
      targetArrayOperator[gadgetKey].gadgetName = 'blank';
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
  loadOperatorSetting();
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

  floors.forEach(floor => { //謎の変数指定がある。要修正。
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
toggleMenu();
toggleSetting();
toggleHowToUse();

window.addEventListener('load', () => {
  setMapStatusPosition();
  setLegendPosition();
});

window.addEventListener('resize', () => {
  setMapStatusPosition();
  setLegendPosition();
  locateCanvasExplanation();
});

buttonPageForward.addEventListener('click', () => {
  forwardHowToUsePage();

  const activePage = document.querySelector('.pageContent--active');
  const canvasPageNumber = 3;
  const isCheckCanvasPage = Number(activePage.getAttribute('id').slice(17)) === canvasPageNumber;

  if(isCheckCanvasPage) {
    const operator = document.querySelector('.p-canvas__operator');
    const items = document.querySelector('.p-canvas__operator--items');
    operator.classList.add('p-canvas__operator--active');
    items.classList.add('items--active');
    locateCanvasExplanation();
  } else {
    deactivateItems();
    deactivateOperator();
  }
});

buttonPageBack.addEventListener('click', () => {
  backHowToUsePage();

  const activePage = document.querySelector('.pageContent--active');
  const canvasPageNumber = 3;
  const isCheckCanvasPage = Number(activePage.getAttribute('id').slice(17)) === canvasPageNumber;

  if(isCheckCanvasPage) {
    const operator = document.querySelector('.p-canvas__operator');
    const items = document.querySelector('.p-canvas__operator--items');
    operator.classList.add('p-canvas__operator--active');
    items.classList.add('items--active');
    locateCanvasExplanation();
  } else {
    deactivateItems();
    deactivateOperator();
  }
});

toggleWhatsSiteBoard();

buttonMove.addEventListener('click', () => {
  deactivateTools();
  activeMove();
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
      toggleDrawSetting(clickedDrawTool, targetSetting);
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
});

toggleTransparency();

transparencySlider.addEventListener('change', (event) => {
  const transparency = transparencySlider.value;
  
  changeTransparency(transparency);
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
  clickedButton.addEventListener('click', (event) => {
    const activatedOperatorElement = clickedButton.parentNode;
    const activatedItemsElement = clickedButton.previousElementSibling;
    const checkOperatorActive = activatedOperatorElement.classList.contains('p-canvas__operator--active');
    const checkItemsActive = activatedItemsElement.classList.contains('items--active');

    if(checkOperatorActive === true && checkItemsActive === true) {
      
      console.log(1);
      deactivateItems();
      deactivateOperator();
      activateOperator(event);
      
    }else if(checkOperatorActive === true && checkItemsActive === false) {
      console.log(2);
      activateItems(event);
      hookItemsActive = true;

    }else if(checkOperatorActive === false) {
      console.log(3);
      deactivateTools();
      deactivateItems();
      deactivateOperator();
      deactivateGears();
      activateOperator(event);
      changeColorFromLegend(activatedOperatorElement);
      currentColor = currentUserColor;
    }
  });
});

document.addEventListener('click', (e) => {
  if(hookItemsActive){
    const activatedOperatorElement = document.querySelector('.p-canvas__operator--active');
    const rect = activatedOperatorElement.getBoundingClientRect();
    const mX = e.clientX;
    const mY = e.clientY;
    const isCheckRect = mX < rect.left ||
      mX > rect.right ||
      mY < rect.top ||
      mY > rect.bottom;

    if(isCheckRect) {
      deactivateItems();
      deactivateGears();
      hookItemsActive = false;
    }
  }
});

gearButton.addEventListener('click', () => {
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

players.forEach(player => {
  player.addEventListener('input',(event) => {
    nameChange(event);
    loadOperatorSetting();
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
    selectGadget(e);
    loadLegend();
  });
});


/*********right*********/
loadOperatorSetting();

toggleIconSettingATK();
toggleIconSettingDEF();
loadIconSetting();

iconSettingSelectedIconsLeft.forEach(selectedIcon => {
  selectedIcon.addEventListener('click', (e) => {
    iconSettingRemoveSelectedIcon(e);
    loadIconSetttingSelectedIconsRight();
    loadOperatorSetting();
    loadLegend();
  });
});

loadIconSetttingSelectedIconsRight();

Object.keys(selectedOperators).forEach(key => {
  const iconSettingOperators = document.querySelectorAll(`.js-operator${key}`);
  //const buttonReturn = document.getElementById(`js-iconSettingReturn${key}`);

  iconSettingOperators.forEach(iconSettingOperator => {
    iconSettingOperator.addEventListener('click', (e) => {
      const targetIconContainer = e.currentTarget;
      const checkCounter = targetIconContainer.firstElementChild.classList.contains('counter');

      if(checkCounter) {
        removeIconSettingIcon(key, e);
        loadOperatorSetting();
        loadLegend();
      } else {
        insertIconSettingIcon(key, e);
        loadOperatorSetting();
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
