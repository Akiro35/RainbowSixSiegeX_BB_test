/*map*/
const setSessionMap = () => {
  const mapName = window.sessionStorage.getItem('selectedMapName');
  const mapURL = window.sessionStorage.getItem('selectedMapURL');
  const displayMapElement = document.getElementById('js-operators__selectedMap');
  const displayMapImg = displayMapElement.children[1].children[0];
  const displayMapName = displayMapElement.children[2].children[0];

  displayMapImg.setAttribute('src', mapURL);
  displayMapImg.setAttribute('alt', mapName);
  displayMapName.textContent = mapName;

}

const resetSessionMap = () => {
  window.sessionStorage.removeItem('selectedMapName');
  window.sessionStorage.removeItem('selectedMapURL');
}

setSessionMap();

const selectedMap = document.querySelector('button.c-map--selected');

selectedMap.addEventListener('click', () => {
  resetSessionMap()

  window.location.href = 'index.html';
})

/*operators*/

const saveSessionOperators = () => {
  const ATK = selectedBadgesATK;
  const DEF = selectedBadgesDEF;

  for(let i = 0; i < ATK.length; i++) {
    const iconImage = ATK[i].iconImage;
    const name = ATK[i].name;

    window.sessionStorage.setItem(`ATK${i + 1}--iconImage`, iconImage);
    window.sessionStorage.setItem(`ATK${i + 1}--name`, name);
  }

  for(let i = 0; i < DEF.length; i++) {
    const iconImage = DEF[i].iconImage;
    const name = DEF[i].name;

    window.sessionStorage.setItem(`DEF${i + 1}--iconImage`, iconImage);
    window.sessionStorage.setItem(`DEF${i + 1}--name`, name);
  }
}

const resetSessionOperators = () => {
  for(let i = 0; i <= 4; i++) {
    window.sessionStorage.removeItem(`ATK${i + 1}--iconImage`);
    window.sessionStorage.removeItem(`ATK${i + 1}--name`);
    window.sessionStorage.removeItem(`DEF${i + 1}--iconImage`);
    window.sessionStorage.removeItem(`DEF${i + 1}--name`);
  }
}

const startButton = document.querySelector('button#js-startBriefing');

window.addEventListener('load', () => {
  resetSessionOperators();
})

startButton.addEventListener('click', () => {
  saveSessionOperators();

  window.location.href = 'page-board.html';
})




