/*****id*****/

/**
 * 要素のIDデータプール
 * @type {Object}
 */
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
    },
    opacity: {
      el:        'js-opacity',
      container: 'js-opacityContainer',
      slider:    'js-opacitySlider',
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
  },
}


/**
 * モーダルIDのデータプール
 * @type {Object}
 */
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
  file:            'js-file',
  confirm:         'js-confirm',
}


/**
 * ボタンIDのデータプール
 * @type {Object}
 */
export const BUTTON_IDS = {
  whatsSiteFromMenu: 'js-menu__whatsSiteBoard--open',
  howToUse: {
    back:    'js-howToUse--back',
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
    ok:     'js-confirm__button--ok',
  },
  setting: {
    open: 'js-setting--open',
    save: 'js-setting--save',
  },
  file: {
    program: 'js-file__button--program',
    image:   'js-file__button--image',
    import:  'js-file__button--import',
  }
}

export const FORM_ID = {
  mapImage:  'js-setting__map-image',
  zoomScale: {
    min: 'js-setting__zoom-scale--min',
    max: 'js-setting__zoom-scale--max',
  },
  stampSize: 'js-setting__stamp-size',
}

/****className*****/

/**
 * querySelector用のクラス名データプール
 * @type {Object}
 */
export const SELECTOR_CLASSNAMES = {
  howToUse: {
    contents:     '.p-howToUse__contents',
    content:      '.p-howToUse__content',
    mapStatus:    '.p-howToUse__rect--legendMap',
    legendPlayers:'.p-howToUse__rect--legendOperator'      
  },
  operatorButton: '.js-canvas__btn--operator',
  playerColor:    '.js-playerColor',
  playerName:     '.js-player-name',
  itemClose:      '.js-item--close',
  stamp:          '.js-stamp',
  map:            '.js-mapSetting__map',
  floor:          '.js-floorSetting__floorList--floor',
}


/**
 * 要素等のアクティブ化用クラス名データプール
 * @type {Object}
 */
export const ACTIVE_CLASSNAMES = {
  operatorFilled: 'is-selected',
  menu:     'is-active',                //memo: modal
  howToUse: {
    modal: 'is-active',                 //memo: modal
    page:  'is-page--active',           //memo: howToUse
    indicator: 'is-indicator--active',  //memo: howToUse
    button: 'is-active',
  },
  tool:     'is-active',                //memo: modal
  bold: {                               //memo: pen/eraser Setting
    pen:    'is-pen-bold--selected',
    eraser: 'is-eraser-bold--selected'
  },
  opacity:     'is-active',             //memo: draw
  legend:      'is-active',
  mapStatus:   'is-active',
  operators:   'is-active',
  operator:    'is-active',             //memo: legend
  item:        'is-active',             //memo: legend
  close:       'is-active',
  gear:        'is-active',             //memo: legend
  deleteStamp: 'is-active',
  gadget:      'is-selected',           //memo: operatorSetting
  file:        'is-active',             //memo: fileManager
};

/*****data*****/

/**
 * querySelector用のデータ属性データプール
 * @type {Object}
 */
export const SELECTOR_DATA = {
  setting: {
    minInt: '[data-scale-setting="min-int"]',
    minDec: '[data-scale-setting="min-dec"]',
    maxInt: '[data-scale-setting="max-int"]',
    maxDec: '[data-scale-setting="max-dec"]',
  },
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
    playerName:      '[data-legend="player-name"]',
    icon:            '[data-legend="icon"]',
    ability:         '[data-legend="ability"]',
    gadgetContainer: '[data-legend="gadget-container"]',
    gadget:          '[data-legend="gadget"]',
    item:            '[data-legend="item"]',
    close:           '[data-legend="close"]',
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


/**
 * howToUse用のデータプール
 * @type {Object}
 */
export const HOW_TO_USE_EXPLANATION = {
  page1: [
    {explanation: '.js-how-to-use__menu',    target: '#js-menu--open', 
      column:'right', row: 'center'},
    {explanation: '.js-how-to-use__move',    target: '#js-moveButton', 
      column:'right', row: 'center'},
    {explanation: '.js-how-to-use__draw',    target: '#js-penSetting--open', 
      column:'right', row: 'center'},
    {explanation: '.js-how-to-use__erase',   target: '#js-eraserSetting--open', 
      column:'right', row: 'center'},
    {explanation: '.js-how-to-use__legend',  target: '#js-legendButton', 
      column:'right', row: 'center'}
  ],
  page2: [
    {explanation: '.js-how-to-use__operators',  target: '#js-operatorSetting--open', 
      column:'left', row: 'center'},
    {explanation: '.js-how-to-use__stamps',     target: '#js-stampCollection--open', 
      column:'left', row: 'center'},
    {explanation: '.js-how-to-use__maps',       target: '#js-mapSetting--open', 
      column:'left', row: 'center'},
    {explanation: '.js-how-to-use__floors',     target: '#js-floorSetting--open', 
      column:'left', row: 'center'}
  ],
  page3: [
    {explanation: '.js-how-to-use__history',          target: '.p-canvas__history', 
      column:'right', row: 'center'},
    {explanation: '.js-how-to-use__zoom',             target: '.p-canvas__btn--zooms', 
      column:'right', row: 'center'},
    {explanation: '.js-how-to-use__operator-button',  target: '#js-legend__operator--ATK1', 
      column:'right', row: 'bottom'}
  ],
  page4: [
    {explanation: '.js-how-to-use__player-color',     target: '[data-legend="player-color"]', 
      column:'right', row: 'center'},
    {explanation: '.js-how-to-use__player-name',      target: '[data-legend="player-name"]',
      column:'right', row: 'center'},
    {explanation: '.js-how-to-use__operator-gadgets', target: '[data-legend="gadget-container"]', 
      column:'right', row: 'center'},
    {explanation: '.js-how-to-use__operator-stamp',   target: '.js-canvas__btn--operator', 
      column:'right', row: 'center'}
  ]
}