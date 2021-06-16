let servicePrice = 0;
let addTax = 0;
let priceMessage = "";
let inputValues = [];
let displayPrice = document.getElementById("displayResult");

class getValues {
  constructor(distance, time, toll) {
    this.distance = distance;
    this.time = time;
    this.toll = toll;
  }

  calculatePrice() {
    if ((this.time <= 25) & (this.distance <= 20)) {
      servicePrice = 0;
      addTax = 0;
    } else if ((this.time <= 35) & (this.distance <= 20)) {
      if (this.toll == "no") {
        servicePrice = 5;
        addTax = 0;
      } else {
        servicePrice = 5;
        addTax = 3;
      }
    } else if ((this.time <= 30) & (this.distance <= 30)) {
      servicePrice = 10;
      addTax = 0;
    } else if ((this.time <= 37) & (this.distance <= 40)) {
      if (this.toll == "no") {
        servicePrice = 15;
        addTax = 0;
      } else {
        servicePrice = 15;
        addTax = 5;
      }
    } else if ((this.time <= 44) & (this.distance <= 43)) {
      servicePrice = 20;
      addTax = 0;
    } else {
      priceMessage = "Service Out of Range";
    }

    if (priceMessage == "") {
      displayResult.innerHTML = `Prezzo Totale: &euro; ${
        servicePrice + addTax
      }`;
      displayResult.style.backgroundColor = "#4bb543";
      displayResult.style.display = "block";
    } else {
      displayResult.style.backgroundColor = "red";
      displayResult.innerHTML = `${priceMessage}`;
      displayResult.style.display = "block";
    }
  }
}

function initMap() {
  let options = {
    zoom: 15,
    center: { lat: 40.7474824, lng: 14.6324808 },
  };

  let map = new google.maps.Map(document.getElementById("map"), options);

  let Markers = [
    {
      cords: { lat: 40.7474824, lng: 14.6324808 },
      iconImage: ``,
      content: `<h1>Repaired Immediately Nocera Inferiore</h1>`,
    },
  ];

  addMarker(Markers[0]);

  function addMarker(props) {
    let maker = new google.maps.Marker({
      position: props.coords,
      map: map,
    });
  }
}

const calcMainForm = document.getElementById("calcMain");
calcMainForm.addEventListener("submit", (e) => {
  e.preventDefault();
  inputValues = [];
  servicePrice = 0;
  addTax = 0;
  priceMessage = "";

  const formData = new FormData(e.target);

  for (const form of formData) {
    inputValues.push(form[1]);
  }

  const calcObj = new getValues(inputValues[0], inputValues[1], inputValues[2]);
  calcObj.calculatePrice();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  displayResult.style.display = "none";
});