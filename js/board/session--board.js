/*********map*********/
const mapNameFromSession = window.sessionStorage.getItem('selectedMapName');
let mapName = mapNameFromSession;
let selectedMap;

/*********floor*********/
const floors = ['basement2nd', 'basement', 'floor1st', 'floor2nd', 'floor3rd', 'roof']
const floorsNameForDisplay = 
    ['2nd basement', 'Basement', '1st floor', '2nd floor', '3rd floor', 'Roof'];
let selectedFloor;

/*********operator*********/
const selectedOperators = {
  ATK: [],
  DEF: []
}


/*********map*********/
function loadSelectedMapObjFromMapPool(mapName) {
  const map = {
    blueprint: {}
  };

  map.mapName               = mapName;
  map.img                   = mapPool[mapName].img;
  map.blueprint.basement2nd = mapPool[mapName].basement2nd  ? mapPool[mapName].basement2nd  : '';
  map.blueprint.basement    = mapPool[mapName].basement     ? mapPool[mapName].basement     : '';
  map.blueprint.floor1st    = mapPool[mapName].floor1st     ? mapPool[mapName].floor1st     : '';
  map.blueprint.floor2nd    = mapPool[mapName].floor2nd     ? mapPool[mapName].floor2nd     : '';
  map.blueprint.floor3rd    = mapPool[mapName].floor3rd     ? mapPool[mapName].floor3rd     : '';
  map.blueprint.roof        = mapPool[mapName].roof         ? mapPool[mapName].roof         : ''; 

  const newMap = JSON.parse(JSON.stringify(map));
  selectedMap = newMap;

  const mapStatusText = document.getElementById('js-mapStatus--map');
  mapStatusText.textContent = mapName;
};

/*********floor*********/
function loadSelectedFloorFromSession() {
  const floor = window.sessionStorage.getItem('selectedFloor');
  const isFloor = selectedMap.blueprint[floor] !== '';

  if (floor !== null && isFloor) {
    selectedFloor = floor;
  } else {
    selectedFloor = 'floor1st';
  }

  floors.forEach(floor => {
    const floorContainer = document.getElementById(`js-floorSetting__floorList--${floor}`);
    isCheck = selectedMap.blueprint[`${floor}`] === '';
    
    if (isCheck) {
      floorContainer.style.display = 'none';
    } else {
      floorContainer.style.display = 'block';
    }
  });

  const mapStatusText = document.getElementById('js-mapStatus--floor');
  const floorNumber = floors.findIndex((floor) => floor === selectedFloor);

  mapStatusText.textContent = floorsNameForDisplay[floorNumber];
};


/*********map*********/
loadSelectedMapObjFromMapPool(mapName);

/*********floor*********/
loadSelectedFloorFromSession();

/*********operator*********/
Object.keys(selectedOperators).forEach(key => {
  const convertedArray = window.sessionStorage.getItem(`selectedOperator${key}s`);
  const operatorsFromSession = JSON.parse(convertedArray);

  for(let i = 0; i < operatorsFromSession.length; i++) {
    const operatorName = operatorsFromSession[i];
    const operatorItems = operatorPool[key][operatorName];
    operatorItems.operatorName = operatorName;

    const newOperator = JSON.parse(JSON.stringify(operatorItems));
    selectedOperators[key].push(newOperator);
  }
});