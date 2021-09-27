'use strict';
const version = '0.1';

const minimumEnergy = 10; // the script will not leave the user with less than this amount of energy

const panelElements = document.getElementsByClassName('col-md-4 padUp');
const energy = parseInt(document.getElementsByClassName('nav-item')[4].innerText);
const workButton = document.getElementsByClassName('btn btn-secondary padUp begColor pulse')[0];

var url = location.href;
var urlFileName = url.substring(url.lastIndexOf('/') + 1);

function Initialize() {
  const navBar = document.getElementsByClassName('navbar-nav ml-auto')[0];
  const navItems = document.getElementsByClassName('nav-item');

  //TODO: Replace with HTML
  const toClone = navItems[2];
  const newElem = toClone.cloneNode(true);

  const aTag = newElem.getElementsByClassName('nav-link js-scroll-trigger navBadge')[0];
  aTag.innerHTML = '<i class="fa fa-heart pulse clanColor"></i> PlayIdleHelper ' + version;
  aTag.href = 'https://github.com/Kitavia/PlayIdleHelper';
  aTag.target = '_blank';

  navBar.insertBefore(newElem, navItems[navItems.length - 2]);
}

function Run() {
  if (urlFileName.startsWith('dashboard.php')) {
    if (energy > minimumEnergy) {
      // TODO: Comply with rules when they exist.
      ClickWorkButton();
    }

    CalculatePropertyProfit();
  }

  //TODO: Filtering options
  if (urlFileName.startsWith('jobs.php')) {
    RemoveUnwatedJobs();
  }

  if (urlFileName.startsWith('properties.php')) {
    CalculateRoi();
  }
}

function CalculateRoi() {
  for (const element of panelElements) {
    const output = element.getElementsByClassName('btn btn-primary mb-2 btn-block padUp btn-md')[0];
    const profit = parseInt(element.getElementsByClassName('moneyColor')[0].innerHTML.split('$')[1].replace(',', ''));
    const cost = parseInt(output.innerHTML.split('$')[1].replace(',', ''));
    const roi = Math.ceil(cost / profit);
    const roiDays = Math.ceil((roi * 12) / 24);

    output.innerHTML = output.innerHTML + '<br>ROI in days = ' + roiDays;
  }
}

function RemoveUnwatedJobs() {
  for (const element of panelElements) {
    const h4 = element.getElementsByTagName('H4');
    if (h4[0].outerText != 'Surgeon') {
      element.style.display = 'none';
    }
  }
}

function ClickWorkButton() {
  workButton.click();
}

function CalculatePropertyProfit() {
  const propertiesPanel = document.getElementsByClassName('col-6 col-md-3 mb-5 text-center')[2];
  const income = parseInt(propertiesPanel.getElementsByClassName('mapColor')[2].innerText.split(' ')[0].replace('$', '').replace(',', ''));
  const cost = parseInt(propertiesPanel.getElementsByClassName('redColor')[0].innerText.split(' ')[0].replace('$', '').replace(',', ''));
  const profit = (income - cost).toLocaleString();

  const panel = propertiesPanel.getElementsByClassName('panel-body text-center')[0];
  panel.insertAdjacentHTML('beforeend', `<br><i class="fa fa-equals moneyColor"></i><text class="mapColor"> $${profit} / 12hrs</text>`);
}

function GetVersion() {
  fetch('manifest.json').then((data) => {
    return data.version;
  });
}

Initialize();
Run();
