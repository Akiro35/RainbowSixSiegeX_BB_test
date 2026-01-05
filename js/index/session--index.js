function saveMapToSession(selectedMap) {
  const mapName = selectedMap.getAttribute('alt');
  const mapURL = selectedMap.getAttribute('src');

  window.sessionStorage.setItem('selectedMapName', mapName);
  window.sessionStorage.setItem('selectedMapURL', mapURL);
};

const maps = document.querySelectorAll('button.c-map');

maps.forEach(map => {
  map.addEventListener('click', (event) => {
    const selectedMap = event.currentTarget.children[1].children[0];

    saveMapToSession(selectedMap);

    window.location.href = 'page-operators.html';
  });
});
