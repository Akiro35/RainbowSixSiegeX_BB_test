const selectedMap = document.querySelector('button.c-map--selected');
const startButton = document.querySelector('button#js-startBriefing');

/*map*/
function setSessionMap() {
  const mapName = window.sessionStorage.getItem('selectedMapName');
  const mapURL = window.sessionStorage.getItem('selectedMapURL');
  const displayMapElement = document.getElementById('js-operators__selectedMap');
  const displayMapImg = displayMapElement.children[1].children[0];
  const displayMapName = displayMapElement.children[2].children[0];

  displayMapImg.setAttribute('src', mapURL);
  displayMapImg.setAttribute('alt', mapName);
  displayMapName.textContent = mapName;
};

function resetSessionMap() {
  window.sessionStorage.removeItem('selectedMapName');
  window.sessionStorage.removeItem('selectedMapURL');
};

/*operators*/
function saveSessionOperators() {
  Object.keys(selectedBadges).forEach(key => {
    const array = selectedBadges[key].map((value) => value.name);
    const convertedArray = JSON.stringify(array);
    window.sessionStorage.setItem(`selectedOperator${key}s`, convertedArray);
  });
};

function resetSessionOperators() {
  Object.keys(selectedBadges).forEach(key => {
    window.sessionStorage.removeItem(`selectedOperator${key}s`);
  });
};

setSessionMap();

selectedMap.addEventListener('click', () => {
  resetSessionMap()

  window.location.href = 'index.html';
});


window.addEventListener('load', () => {
  resetSessionOperators();
});

startButton.addEventListener('click', () => {
  saveSessionOperators();

  window.location.href = 'page-board.html';
});




