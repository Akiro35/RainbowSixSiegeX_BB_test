const saveSessionMap = (selectedMap) => {
  const mapName = selectedMap.getAttribute('alt');
  const mapURL = selectedMap.getAttribute('src');

  window.sessionStorage.setItem('selectedMapName', mapName);
  window.sessionStorage.setItem('selectedMapURL', mapURL);

  //console.log(mapName);
  //console.log(mapURL);
}

const maps = document.querySelectorAll('button.c-map');

maps.forEach(map => {
  map.addEventListener('click', (event) => {
    const selectedMap = event.currentTarget.children[1].children[0];

    //console.log(selectedMap);

    saveSessionMap(selectedMap);

    window.location.href = 'page-operators.html';
  })
})
