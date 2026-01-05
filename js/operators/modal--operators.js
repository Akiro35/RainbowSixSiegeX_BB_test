const operatorIconsATK = document.querySelectorAll('.js-operatorATK');
const operatorIconsDEF = document.querySelectorAll('.js-operatorDEF');

const operatorIcons = {
  ATK: document.querySelectorAll('.js-operatorATK'),
  DEF: document.querySelectorAll('.js-operatorDEF')
};

const selectedBadges = {
  ATK:[],
  DEF:[]
};

/*********common*********/

function initSquadIcons(key) {
  const squadIcons = [];
  const headcount = 5;
  
  for(let i = 1; i <= headcount; i++) {
    const icon = document.getElementById(`js-icon${key}${i}`);
    squadIcons.push(icon);
  }

  return squadIcons;
};

function getEmptyNumber(key)  {
  for(let i = 0; i <= selectedBadges[key].length; i++) {
    const hasNumber = i in selectedBadges[key];

    if(!hasNumber) {
      return i;
    }
  }

  return -1;
};

function pushOperator(key, e) {
  const badgeNumber = getEmptyNumber(key) + 1;
  const badgeHTML = `
    <div class="selected" id="js-countATK--${badgeNumber}">
      <p>${badgeNumber}</p>
    </div>
  `;
  const clickedIcon = e.target;
  const selectedOperatorElement = clickedIcon.parentNode;
  const operatorName = clickedIcon.getAttribute('alt').slice(9);
  const selectedOperatorData = {
    name: operatorName,
    container: selectedOperatorElement
  }

  selectedOperatorElement.insertAdjacentHTML('afterbegin', badgeHTML);
  selectedBadges[key].push(selectedOperatorData);
};

function removeOperator(key, selectedBadgeElement) {
  const badgeNumberToRemove = selectedBadgeElement.getAttribute('id').slice(13);
  const arrayNumberToRemove = badgeNumberToRemove - 1;

  selectedBadgeElement.remove();
  delete selectedBadges[key][arrayNumberToRemove];
  selectedBadges[key] = selectedBadges[key].filter(operator => true);

  selectedBadges[key].forEach((selectedBadge, index) => {
    const badgeElement = selectedBadge.container.firstElementChild;
    const badgeChar = badgeElement.firstElementChild;
    const badgeNumber = index + 1;
    const newId = `js-count${key}--${badgeNumber}`;
    
    badgeElement.setAttribute('id', newId);
    badgeChar.textContent = badgeNumber;
  });
};

function writeSquads(key) {
  const squadIcons = initSquadIcons(key);

  for(let i = 0; i < selectedBadges[key].length; i++) {
    const operatorName = selectedBadges[key][i].name;
    const operatorContainerOfSquad = squadIcons[i].parentNode;
    const newImg = operatorPool[key][operatorName].icon;
    const newAlt = `operator_${operatorName}`;

    squadIcons[i].setAttribute('src', newImg);
    squadIcons[i].setAttribute('alt', newAlt);
    operatorContainerOfSquad.classList.add('c-operator__icon--filled');
  }

  for(let i = selectedBadges[key].length; i < squadIcons.length; i++) {
    const operatorContainerOfSquad = squadIcons[i].parentNode;
    const hasClass = operatorContainerOfSquad.classList.contains('c-operator__icon--filled');
    const blankImg = 'image/icon_operator/figure.png';
    const blankAlt = 'operator_blank';

    squadIcons[i].setAttribute('src', blankImg);
    squadIcons[i].setAttribute('alt', blankAlt);

    if(hasClass) {
      operatorContainerOfSquad.classList.remove('c-operator__icon--filled');
    }
  }
};


/*********ATK*********/
function toggleOperatorsATK() {
  const modal = document.querySelector('dialog.js-operatorsATK');
  const openButton = document.getElementById('open--operatorsATK');
  const closeButton = document.getElementById('close--operatorsATK');

  openButton.addEventListener('click', () => {
    modal.showModal();
  });
  
  closeButton.addEventListener('click', () => {
    modal.close();
  });
};


/*********DEF*********/
function toggleOperatorsDEF() {
  const modal = document.querySelector('dialog.js-operatorsDEF');
  const openButton = document.getElementById('open--operatorsDEF');
  const closeButton = document.getElementById('close--operatorsDEF');

  openButton.addEventListener('click', () => {
    modal.showModal();
  });
  closeButton.addEventListener('click', () => {
    modal.close();
  });
};



toggleOperatorsATK();
toggleOperatorsDEF();

Object.keys(operatorIcons).forEach(key => {
  operatorIcons[key].forEach(operatorIcon => {
    operatorIcon.addEventListener('click', (e)=> {
      const clickedIcon = e.target;
      const selectedBadgeElement = clickedIcon.previousElementSibling ? clickedIcon.previousElementSibling : 'new';
      const count = selectedBadges[key].length;

      if (selectedBadgeElement === "new" && count < 5) {
        pushOperator(key, e);
      } else if (selectedBadgeElement !== 'new') {
        removeOperator(key, selectedBadgeElement);
      }

      writeSquads(key);
    });
  });
});