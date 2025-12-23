const toggleWhatsSite = () => {
  const modal = document.querySelector('dialog.js-whatsSite');
  const openButton = document.getElementById('open--whatsSite');
  const closeButton = document.getElementById('close--whatsSite');

  openButton.addEventListener('click', () => {
    modal.showModal();
  })
  closeButton.addEventListener('click', () => {
    modal.close();
  })
}

const toggleOperatorsATK = () => {
  const modal = document.querySelector('dialog.js-operatorsATK');
  const openButton = document.getElementById('open--operatorsATK');
  const closeButton = document.getElementById('close--operatorsATK');

  openButton.addEventListener('click', () => {
    modal.showModal();
  })
  closeButton.addEventListener('click', () => {
    modal.close();
  })
}

const toggleOperatorsDEF = () => {
  const modal = document.querySelector('dialog.js-operatorsDEF');
  const openButton = document.getElementById('open--operatorsDEF');
  const closeButton = document.getElementById('close--operatorsDEF');

  openButton.addEventListener('click', () => {
    modal.showModal();
  })
  closeButton.addEventListener('click', () => {
    modal.close();
  })
}

toggleWhatsSite();
toggleOperatorsATK();
toggleOperatorsDEF();

/*********ATK*********/
const operatorsATK = document.querySelectorAll('.js-operatorATK');
let selectedBadgesATK = [];

class OperatorATK{
  constructor(badgeElements, iconImage, name){
    this.badgeElements = badgeElements;
    this.iconImage = iconImage;
    this.name = name;
  }
}

const getEmptyNumberATK = () => {
  for(let i = 0; i <= selectedBadgesATK.length; i++) {
    if( !(i in selectedBadgesATK)) {
      return i;
    }
  }
  return -1;
}

const addBadgeATK = (selectedOperator) => {
  
  const badgeNumber = getEmptyNumberATK() + 1;
  const badgeHTML = `<div class="selected" id="js-countATK--${badgeNumber}"><p>${badgeNumber}</p></div>`;

  selectedOperator.insertAdjacentHTML('afterbegin', badgeHTML);
}

const addArrayATK = () => {
  const badgeNumber = getEmptyNumberATK() + 1;
  const badgeElements = document.getElementById(`js-countATK--${badgeNumber}`);
  const iconElements = badgeElements.nextElementSibling.getAttribute('src');
  const name = badgeElements.nextElementSibling.getAttribute('alt');
  const addOperator = new OperatorATK(badgeElements, iconElements, name);

  selectedBadgesATK.push(addOperator);
}

const removeBadgeATK = (removeArrayNumber, removeBadgeElements) => {
  let removeBadgeNumber = removeArrayNumber + 1;

  removeBadgeElements.remove();
  delete selectedBadgesATK[removeArrayNumber];

  if(selectedBadgesATK[removeArrayNumber + 1] === undefined) {
    selectedBadgesATK = selectedBadgesATK.filter( () => true);
  } else {
    for(let i = removeBadgeNumber; i < 5; i++) {

      const preBadgeHTML = `<div class="selected" id="js-countATK--${i}"><p>${i}</p></div>`;
      const badgeElements = document.getElementById(`js-countATK--${i + 1}`)

      const rewriteArray = () => {
        const badgeElements = document.getElementById(`js-countATK--${i}`);
        const iconImage = badgeElements.nextElementSibling.getAttribute('src');
        const name = badgeElements.nextElementSibling.getAttribute('alt');
        const rewriteOperator = new OperatorATK(badgeElements, iconImage, name);
        
        return rewriteOperator;
      }

      if(badgeElements === null) {
        break;
      } else {
        badgeElements.outerHTML = preBadgeHTML;
      
        selectedBadgesATK.splice(i - 1, 1, rewriteArray());
        selectedBadgesATK.splice(i, 1);
      }
    }
  }
}

const initializeSquadsIconsATK = () => {
  const squadsIcons = {};
  const count = 5;

  for (let i = 1; i <= count; i++) {
    squadsIcons[`operator${i}`] = document.querySelector(`#js-iconATK${i}`);
  }

  //console.log(squadsIcons);
  return squadsIcons;
}


const writeSquadsATK = () => {
  //console.log(selectedBadges);
  
  const squadsIcons = initializeSquadsIconsATK();

  switch (selectedBadgesATK.length) {
    case 1:
      //console.log('1');
      const iconParent1 = squadsIcons[`operator1`].parentNode;

      squadsIcons[`operator1`].setAttribute('src', selectedBadgesATK[0].iconImage);
      squadsIcons[`operator1`].setAttribute('alt', selectedBadgesATK[0].name);
      iconParent1.classList.add('c-operator__icon--filled');

      break;
    case 2 :
      //console.log('2');
      const iconParent2 = squadsIcons[`operator2`].parentNode;

      squadsIcons[`operator2`].setAttribute('src', selectedBadgesATK[1].iconImage);
      squadsIcons[`operator2`].setAttribute('alt', selectedBadgesATK[1].name);
      iconParent2.classList.add('c-operator__icon--filled');
      break;
    case 3 :
      //console.log('3');
      const iconParent3 = squadsIcons[`operator3`].parentNode;

      squadsIcons[`operator3`].setAttribute('src', selectedBadgesATK[2].iconImage);
      squadsIcons[`operator3`].setAttribute('alt', selectedBadgesATK[2].name);
      iconParent3.classList.add('c-operator__icon--filled');
      break;
    case 4 :
      //console.log('4');
      const iconParent4 = squadsIcons[`operator4`].parentNode;

      squadsIcons[`operator4`].setAttribute('src', selectedBadgesATK[3].iconImage);
      squadsIcons[`operator4`].setAttribute('alt', selectedBadgesATK[3].name);
      iconParent4.classList.add('c-operator__icon--filled');
      break;
    case 5 :
      //console.log('5');
      const iconParent5 = squadsIcons[`operator5`].parentNode;

      squadsIcons[`operator5`].setAttribute('src', selectedBadgesATK[4].iconImage);
      squadsIcons[`operator5`].setAttribute('alt', selectedBadgesATK[4].name);
      iconParent5.classList.add('c-operator__icon--filled');
      break;
  }
}

const rewriteSruadsATK = () => {
  const  squadsIcons = initializeSquadsIconsATK();

  for(let i = 0; i < selectedBadgesATK.length; i++) {
    squadsIcons[`operator${i + 1}`].setAttribute('src', selectedBadgesATK[i].iconImage);
    squadsIcons[`operator${i + 1}`].setAttribute('alt', selectedBadgesATK[i].name);
  }

  const blankIcon = 'image/icon_operator/figure.png';
  const blankName = 'operator_blank';

  for(let i = selectedBadgesATK.length; i <= 5; i++) {
    const iconParent = squadsIcons[`operator${i + 1}`].parentNode;

    squadsIcons[`operator${i + 1}`].setAttribute('src', blankIcon);
    squadsIcons[`operator${i + 1}`].setAttribute('alt', blankName);
    iconParent.classList.remove('c-operator__icon--filled');

    if(i === 4) {
      break;
    }
  }
}

operatorsATK.forEach(selectedOperator => {
  
  selectedOperator.addEventListener('click', (event) => {
    const clickedOperator = event.target;
    const getSelected = clickedOperator.previousElementSibling;
    const searchBadges = selectedBadgesATK.findIndex((Operator) => Operator.badgeElements === getSelected);
    
    if(searchBadges !== -1) {
      console.log('削除枝');
      removeBadgeATK(searchBadges, getSelected);
      rewriteSruadsATK();


    } else if(searchBadges === -1 && getEmptyNumberATK() < 5) {
      console.log("追加枝");
      addBadgeATK(selectedOperator);
      addArrayATK();
      writeSquadsATK();
      
    }

    //console.log(selectedBadgesATK);

  })
})


/*********DEF*********/
const operatorsDEF = document.querySelectorAll('.js-operatorDEF');
let selectedBadgesDEF = [];

class OperatorDEF{
  constructor(badgeElements, iconImage, name){
    this.badgeElements = badgeElements;
    this.iconImage = iconImage;
    this.name = name;
  }
}

const getEmptyNumberDEF = () => {
  for(let i = 0; i <= selectedBadgesDEF.length; i++) {
    if( !(i in selectedBadgesDEF)) {
      return i;
    }
  }
  return -1;
}

const addBadgeDEF = (selectedOperator) => {
  
  const badgeNumber = getEmptyNumberDEF() + 1;
  const badgeHTML = `<div class="selected" id="js-countDEF--${badgeNumber}"><p>${badgeNumber}</p></div>`;

  selectedOperator.insertAdjacentHTML('afterbegin', badgeHTML);
}

const addArrayDEF = () => {
  const badgeNumber = getEmptyNumberDEF() + 1;
  const badgeElements = document.getElementById(`js-countDEF--${badgeNumber}`);
  const iconElements = badgeElements.nextElementSibling.getAttribute('src');
  const name = badgeElements.nextElementSibling.getAttribute('alt');
  const addOperator = new OperatorDEF(badgeElements, iconElements, name);

  selectedBadgesDEF.push(addOperator);
}

const removeBadgeDEF = (removeArrayNumber, removeBadgeElements) => {
  let removeBadgeNumber = removeArrayNumber + 1;

  removeBadgeElements.remove();
  delete selectedBadgesDEF[removeArrayNumber];

  if(selectedBadgesDEF[removeArrayNumber + 1] === undefined) {
    selectedBadgesDEF = selectedBadgesDEF.filter( () => true);
  } else {
    for(let i = removeBadgeNumber; i < 5; i++) {

      const preBadgeHTML = `<div class="selected" id="js-countDEF--${i}"><p>${i}</p></div>`;
      const badgeElements = document.getElementById(`js-countDEF--${i + 1}`)

      const rewriteArray = () => {
        const badgeElements = document.getElementById(`js-countDEF--${i}`);
        const iconImage = badgeElements.nextElementSibling.getAttribute('src');
        const name = badgeElements.nextElementSibling.getAttribute('alt');
        const rewriteOperator = new OperatorDEF(badgeElements, iconImage, name);
        
        return rewriteOperator;
      }

      if(badgeElements === null) {
        break;
      } else {
        badgeElements.outerHTML = preBadgeHTML;
      
        selectedBadgesDEF.splice(i - 1, 1, rewriteArray());
        selectedBadgesDEF.splice(i, 1);
      }
    }
  }
}

const initializeSquadsIconsDEF = () => {
  const squadsIcons = {};
  const count = 5;

  for (let i = 1; i <= count; i++) {
    squadsIcons[`operator${i}`] = document.querySelector(`#js-iconDEF${i}`);
  }

  //console.log(squadsIcons);
  return squadsIcons;
}


const writeSquadsDEF = () => {
  //console.log(selectedBadges);
  
  const squadsIcons = initializeSquadsIconsDEF();

  switch (selectedBadgesDEF.length) {
    case 1:
      //console.log('1');
      const iconParent1 = squadsIcons[`operator1`].parentNode;

      squadsIcons[`operator1`].setAttribute('src', selectedBadgesDEF[0].iconImage);
      squadsIcons[`operator1`].setAttribute('alt', selectedBadgesDEF[0].name);
      iconParent1.classList.add('c-operator__icon--filled');
      break;
    case 2 :
      //console.log('2');
      const iconParent2 = squadsIcons[`operator2`].parentNode;

      squadsIcons[`operator2`].setAttribute('src', selectedBadgesDEF[1].iconImage);
      squadsIcons[`operator2`].setAttribute('alt', selectedBadgesDEF[1].name);
      iconParent2.classList.add('c-operator__icon--filled');
      break;
    case 3 :
      //console.log('3');
      const iconParent3 = squadsIcons[`operator3`].parentNode;

      squadsIcons[`operator3`].setAttribute('src', selectedBadgesDEF[2].iconImage);
      squadsIcons[`operator3`].setAttribute('alt', selectedBadgesDEF[2].name);
      iconParent3.classList.add('c-operator__icon--filled');
      break;
    case 4 :
      //console.log('4');
      const iconParent4 = squadsIcons[`operator4`].parentNode;

      squadsIcons[`operator4`].setAttribute('src', selectedBadgesDEF[3].iconImage);
      squadsIcons[`operator4`].setAttribute('alt', selectedBadgesDEF[3].name);
      iconParent4.classList.add('c-operator__icon--filled');
      break;
    case 5 :
      //console.log('5');
      const iconParent5 = squadsIcons[`operator5`].parentNode;

      squadsIcons[`operator5`].setAttribute('src', selectedBadgesDEF[4].iconImage);
      squadsIcons[`operator5`].setAttribute('alt', selectedBadgesDEF[4].name);
      iconParent5.classList.add('c-operator__icon--filled');
      break;
  }
}

const rewriteSruadsDEF = () => {
  const  squadsIcons = initializeSquadsIconsDEF();

  for(let i = 0; i < selectedBadgesDEF.length; i++) {
    squadsIcons[`operator${i + 1}`].setAttribute('src', selectedBadgesDEF[i].iconImage);
    squadsIcons[`operator${i + 1}`].setAttribute('alt', selectedBadgesDEF[i].name);
  }

  const blankIcon = 'image/icon_operator/figure.png';
  const blankName = 'operator_blank';

  for(let i = selectedBadgesDEF.length; i <= 5; i++) {
    const iconParent = squadsIcons[`operator${i + 1}`].parentNode;

    squadsIcons[`operator${i + 1}`].setAttribute('src', blankIcon);
    squadsIcons[`operator${i + 1}`].setAttribute('alt', blankName);
    iconParent.classList.remove('c-operator__icon--filled');

    if(i === 4) {
      break;
    }
  }
}



operatorsDEF.forEach(selectedOperator => {
  
  selectedOperator.addEventListener('click', (event) => {
    const clickedOperator = event.target;
    const getSelected = clickedOperator.previousElementSibling;
    const searchBadges = selectedBadgesDEF.findIndex((Operator) => Operator.badgeElements === getSelected);
    
    if(searchBadges !== -1) {
      console.log('削除枝');
      removeBadgeDEF(searchBadges, getSelected);
      rewriteSruadsDEF();


    } else if(searchBadges === -1 && getEmptyNumberDEF() < 5) {
      console.log("追加枝");
      addBadgeDEF(selectedOperator);
      addArrayDEF();
      writeSquadsDEF();
      
    }

    //console.log(selectedBadgesDEF);
  })
})
