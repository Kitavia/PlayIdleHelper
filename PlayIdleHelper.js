'use strict';
(async () => {
  const version = chrome.runtime.getManifest().version;
  const flagOutdated = await isOutdated();

  const panelElements = document.getElementsByClassName('col-md-4 padUp');
  const energy = parseInt(document.getElementsByClassName('nav-item')[4].innerText);

  var url = location.href;
  var urlFileName = url.substring(url.lastIndexOf('/') + 1);

  const minimumEnergy = 10; // the script will not leave the user with less than this amount of energy

  function Initialize() {
    let displayVersion = version;
    if (flagOutdated) displayVersion = '(Outdated)';

    const navBar = document.getElementsByClassName('navbar-nav ml-auto')[0];
    const navItems = document.getElementsByClassName('nav-item');

    //TODO: Replace with HTML
    const toClone = navItems[2];
    const newElem = toClone.cloneNode(true);

    const aTag = newElem.getElementsByClassName('nav-link js-scroll-trigger navBadge')[0];
    aTag.innerHTML = '<i class="fa fa-heart pulse clanColor"></i> PlayIdleHelper' + ' ' + displayVersion;
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

    if (urlFileName.startsWith('shops.php?id=2')) {
      CalculateFoodEfficiency();
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
    const workButton = document.getElementsByClassName('btn btn-secondary padUp begColor pulse')[0];

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

  function CalculateFoodEfficiency() {
    const foodElements = document.getElementsByTagName('tr');
    for (const element of foodElements) {
      const heals = parseInt(element.getElementsByClassName('idleColor')[0].innerText);
      const cost = parseInt(element.getElementsByClassName('moneyColor')[0].innerText.replace('$', ''));

      const costElement = element.getElementsByClassName('moneyColor')[0];

      const efficiency = (cost / heals).toFixed(2);

      costElement.innerHTML = costElement.innerHTML + '<br>$/HP = ' + efficiency;
    }
  }

  async function isOutdated() {
    const manifest = await fetch('https://raw.githubusercontent.com/Kitavia/PlayIdleHelper/main/manifest.json');
    const json = await manifest.json();

    if (version >= json.version) return false;
    else return true;
  }

  Initialize();
  Run();
})();
