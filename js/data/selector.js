/*****id*****/
export const ELEMENT_IDS = {
  selectedMap: 'js-operators__selectedMap',
  operator: {
    icon: {
      ATK: 'js-iconATK',
      DEF: 'js-iconDEF'
    },
  },
  tool: {
    display: {
      pen:     'js-penDisplay',
      eraser:  'js-eraserDisplay',
      opacity: 'js-opacityDisplay',
    },
    color: {
      picker: 'js-penColor',
      //display: 'js-colorDisplay',
    },
    opacity: {
      el:        'js-opacity',
      container: 'js-opacityContainer',
      slider:    'js-opacitySlider',
      //display:   'js-opacityDisplay',
    },
    clear: {
      line:   'js-lineClear',
      stamp:  'js-stampClear',
      all:    'js-allClear',
    }
  },
  canvas: {
    container: 'js-canvasContainer',
    canvas:    'js-canvas',
  },
  legend: {
    mapStatus: {
      container: 'js-mapStatus',
      mapName:   'js-mapStatus--map',
      floorName: 'js-mapStatus--floor',
    },
    operators: 'js-legendOperator',
    operatorContainer: {
      ATK: 'js-legend__operator--ATK',
      DEF: 'js-legend__operator--DEF'
    },
    gears: 'js-gears',
  },
  scaleRatio: 'js-scaleRatio',
  deleteStamp: 'js-stampDelete',
  operatorSetting: {
    operatorContainer: {
      ATK: 'js-operatorSettingATK',
      DEF: 'js-operatorSettingDEF'
    },
  },
  operatorSelection: {
    selected: {
      ATK: 'js-operatorSelection__selectedATK',
      DEF: 'js-operatorSelection__selectedDEF'
    },
    return: {
      ATK: 'js-operatorSelectionReturnATK',
      DEF: 'js-operatorSelectionReturnDEF',
    }
  },
  floorSetting: {
    basement2nd: 'js-floorSetting__floorList--basement2nd',
    basement:    'js-floorSetting__floorList--basement',
    floor1st:    'js-floorSetting__floorList--floor1st',
    floor2nd:    'js-floorSetting__floorList--floor2nd',
    floor3rd:    'js-floorSetting__floorList--floor3rd',
    roof:        'js-floorSetting__floorList--roof',
  },
  dialog: {
    text: {
      ja: 'js-confirm__message--ja',
      en: 'js-confirm__message--en',
    },
  
  }
}

export const MODAL_IDS = {
  menu:            'js-menu',
  setting:         'js-menu__setting',
  howToUse:        'js-howToUse',
  whatsSite:       'js-whatsSite',
  operatorSetting: 'js-operatorSetting',
  operatorSelection: {
    ATK: 'js-operatorSelectionATK',
    DEF: 'js-operatorSelectionDEF'
  },
  stampCollection: 'js-stampCollection',
  mapSetting:      'js-mapSetting',
  floorSetting:    'js-floorSetting',
  confirm:         'js-confirm',
}

export const BUTTON_IDS = {
  whatsSiteFromMenu: 'js-menu__whatsSiteBoard--open',
  howToUse: {
    back: 'js-howToUse--back',
    forward: 'js-howToUse--forward',
  },
  tool: {
    move:   'js-moveButton',
    pen:    'js-penSetting--open',
    eraser: 'js-eraserSetting--open'
  },
  toolSetting: {
    pen:    'js-penSetting',
    eraser: 'js-eraserSetting',
  },
  legend: 'js-legendButton',
  zoom: {
    up:   'js-zoomUp',
    down: 'js-zoomDown'
  },
  history: {
    undo: 'js-undo',
    redo: 'js-redo',
  },
  gear:   'js-gearButton',
  confirm: {
    cancel: 'js-confirm__button--cancel',
    ok: 'js-confirm__button--ok',
  },
}

/****className*****/
export const SELECTOR_CLASSNAMES = {
  howToUse: {
    contents:     '.p-howToUse__contents',
    content:      '.p-howToUse__content',
    mapStatus:    '.p-howToUse__rect--legendMap',
    legendPlayers:'.p-howToUse__rect--legendOperator'      
  },
  operatorButton: '.js-canvas__btn--operator',
  playerColor:    '.js-playerColor',
  playerName:     '.playerName',
  stamp:          '.js-stamp',
  map:            '.js-mapSetting__map',
  floor:          '.js-floorSetting__floorList--floor',
}

export const ACTIVE_CLASSNAMES = {
  operatorFilled: 'c-operator__icon--filled',
  menu:     'l-body__menu--active',       //memo: modal
  howToUse: {
    modal: 'p-howToUse--active',         //memo: modal
    page:  'pageContent--active',        //memo: howToUse
    indicator: 'pageIndicator--active',  //memo: howToUse
    button: 'nav--active',
  },
  tool:     'p-board__tools--active',     //memo: modal
  bold: {                                 //memo: pen/eraser Setting
    pen:    'js-penBoldSelected',
    eraser: 'js-eraserBoldSelected'
  },
  opacity:     'js-opacityOpened',           //memo: draw
  legend:      'p-board__legend--active',
  mapStatus:   'p-canvas__mapStatus--active',
  operators:   'p-canvas__legend--active',
  operator:    'p-canvas__operator--active', //memo: legend
  item:        'items--active',              //memo: legend
  gear:        'p-canvas__gears--active',    //memo: legend
  deleteStamp: 'p-canvas__stampDelete--active',
  gadget:      'c-modal__selectedGadget',    //memo: operatorSetting
};

/*****data*****/
export const SELECTOR_DATA = {
  draw: {
    bold: '[data-draw="bold"]',
  },
  legend: {
    playerContainer: {
      ATK1: '[data-legend="ATK1"]',
      ATK2: '[data-legend="ATK2"]',
      ATK3: '[data-legend="ATK3"]',
      ATK4: '[data-legend="ATK4"]',
      ATK5: '[data-legend="ATK5"]',
      DEF1: '[data-legend="DEF1"]',
      DEF2: '[data-legend="DEF2"]',
      DEF3: '[data-legend="DEF3"]',
      DEF4: '[data-legend="DEF4"]',
      DEF5: '[data-legend="DEF5"]',
    },
    playerName: '[data-legend="player-name"]',
    icon:            '[data-legend="icon"]',
    ability:         '[data-legend="ability"]',
    gadgetContainer: '[data-legend="gadget-container"]',
    gadget:          '[data-legend="gadget"]',
    item:            '[data-legend="item"]',
  },
  canvas: {
    tempStamp: '[data-stamp="stamp--temp"]'
  },
  operatorSetting: {
    playerName:      '[data-operator-setting="player-name"]',
    icon:            '[data-operator-setting="icon"]',
    ability:         '[data-operator-setting="ability"]',
    gadgetContainer: '[data-operator-setting="gadget-container"]',
    gadget:          '[data-operator-setting="gadget"]',
  },
  operatorSelection: {
    icon: '[data-operator-selection="icon"]',
  }
}

export const HOW_TO_USE_EXPLANATION = {
  page1: [
    {explanation: '.p-howToUse__left--menu',    target: '#js-menu--open', 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__left--move',    target: '#js-moveButton', 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__left--draw',    target: '#js-penSetting--open', 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__left--erase',   target: '#js-eraserSetting--open', 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__left--legend',  target: '#js-legendButton', 
      column:'right', row: 'center'}
  ],
  page2: [
    {explanation: '.p-howToUse__right--operators',  target: '#js-operatorSetting--open', 
      column:'left', row: 'center'},
    {explanation: '.p-howToUse__right--stamps',     target: '#js-stampCollection--open', 
      column:'left', row: 'center'},
    {explanation: '.p-howToUse__right--maps',       target: '#js-mapSetting--open', 
      column:'left', row: 'center'},
    {explanation: '.p-howToUse__right--floors',     target: '#js-floorSetting--open', 
      column:'left', row: 'center'}
  ],
  page3: [
    {explanation: '.p-howToUse__canvas--history',         target: '.p-canvas__history', 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__canvas--zoom',            target: '.p-canvas__btn--zooms', 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__canvas--operatorButton',  target: '#js-legend__operator--ATK1', 
      column:'right', row: 'bottom'}
  ],
  page4: [
    {explanation: '.p-howToUse__canvas--draw',          target: '[data-legend="player-color"]', 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__canvas--name',          target: '[data-legend="player-name"]',
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__canvas--stamp',         target: '[data-legend="gadget-container"]', 
      column:'right', row: 'center'},
    {explanation: '.p-howToUse__canvas--stampOperator', target: '.js-canvas__btn--operator', 
      column:'right', row: 'center'}
  ]
}