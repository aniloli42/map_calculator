// Variables For map
let map;
let marker;
let directionsService;
let directionsDisplay;
let getClickPosition;
const initialMapParameters = {
  zoom: 15,
  disableDefaultUI: true,
  center: { lat: 40.7474824, lng: 14.6324808 },
};
const mapDisplaySelector = document.getElementById("map");
const markerDefaultParameters = {
  cords: { lat: 40.74741139701506, lng: 14.63262364268303 },
};

// Variable for the Display and Calculations
const placeInputBox = document.getElementById("placeAddress");
const placeInputErrorMessage = document.getElementById("placeMessage");
const placeEnteredSearchBtn = document.getElementById("placeBtn");
let getDistance;
let getTime;
const distanceInputBox = document.getElementById("distance");
const timeInputBox = document.getElementById("time");
const calculateMapBtn = document.getElementById("calcMapBtn");
const resetMapBtn = document.getElementById("resetMapBtn");
const displayResultDiv = document.getElementById("displayResult");
const yesTollRadio = document.getElementById("yesTollRadio");
const noTollRadio = document.getElementById("noTollRadio");
const calculatorMainForm = document.getElementById("calcMain");
let tollRadio;

// initial map function
function intialSetMap() {
  return new Promise((resolve, reject) => {
    map = new google.maps.Map(mapDisplaySelector, initialMapParameters);
    if (map != null || map != undefined) {
      resolve();
    } else {
      reject();
    }
  });
}

intialSetMap()
  .then(markerFunction())
  .catch((error) => {
    console.log("Error is map");
  });

function markerFunction() {
  marker = new google.maps.Marker();
}

// set the default marker into the serivce center
marker.setPosition(markerDefaultParameters.cords);
marker.setMap(map);

// Listen the click in the google map
google.maps.event.addListener(map, "click", (event) => {
  placeInputBox.value = "";
  getClickPosition = event.latLng;
  displayRoute(getClickPosition);
});

// Autocomplete Parameters
const autoCompleteParams = {
  types: ["establishment"],
  fields: ["formatted_address", "geometry", "name"],
  price_level: 0,
};

// Initialize the autocomplete
const autoCompleteSearch = new google.maps.places.Autocomplete(
  placeInputBox,
  autoCompleteParams
);

// Bind the autocomplete into the map
autoCompleteSearch.bindTo("bounds", map);

// Add the restriction search to Italy
autoCompleteSearch.setComponentRestrictions({ country: ["IT"] });

// route using place address
placeEnteredSearchBtn.addEventListener("click", () => {
  if ((placeInputBox.value != "") & (placeInputBox.value != undefined)) {
    directionsDisplay.setDirections({ routes: [] });
    displayRoute(placeInputBox.value);
  } else {
    placeInputErrorMessage.innerHTML = "Inserisci l'indirizzo";
    placeMessage.style.display = "block";
    setTimeout(() => {
      placeInputBox.value = "";
      placeInputErrorMessage.innerHTML = "";
      placeMessage.style.display = "none";
    }, 3000);
  }
});

// Initialize the Direction Service Object
directionsService = new google.maps.DirectionsService();

//Initialize the DirectionsRenderrer object
directionsDisplay = new google.maps.DirectionsRenderer();

// bind the directions Renderer
directionsDisplay.setMap(map);

// function routing the distance to the client location
function displayRoute(clientLocationPoint) {
  // generate the route Parameters
  let routeParams = {
    origin: markerDefaultParameters.cords,
    destination: clientLocationPoint,
    travelMode: "DRIVING",
    unitSystem: google.maps.UnitSystem.METRIC,
  };

  //   route the map using directionsService
  directionsService.route(routeParams, (result, status) => {
    //   if the result is found
    if (status == google.maps.DirectionsStatus.OK) {
      // remove the default marker for the show the origin single marked
      marker.setMap(null);

      //get the value form the map of route
      getDistance = result.routes[0].legs[0].distance.value;
      getTime = result.routes[0].legs[0].duration.value;
      getDistance = getDistance / 1000;
      getTime = getTime / 60;
      getDistance = Math.round(getDistance);
      getTime = Math.round(getTime);

      //  set the value into the input box
      distanceInputBox.value = getDistance + " km";
      timeInputBox.value = getTime + " minuti";

      // display the route
      directionsDisplay.setDirections(result);
    }
    // if the result is invalid or not geocoded
    if (status == google.maps.DirectionsStatus.NOT_FOUND) {
      marker.setPosition(markerDefaultParameters.cords);
      marker.setMap(map);
      map.setCenter(initialMapParameters.center);
      placeInputErrorMessage.innerHTML = "posto non trovato";
      placeMessage.style.display = "block";
      setTimeout(() => {
        placeInputBox.value = "";
        placeInputErrorMessage.innerHTML = "";
        placeMessage.style.display = "none";
      }, 3000);
    }

    // if the result is not available
    if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
      marker.setPosition(markerDefaultParameters.cords);
      marker.setMap(map);
      map.setCenter(initialMapParameters.center);
      placeInputErrorMessage.innerHTML =
        "Percorso non valido o Percorso non disponibile";
      placeMessage.style.display = "block";
      setTimeout(() => {
        placeInputBox.value = "";
        placeInputErrorMessage.innerHTML = "";
        placeMessage.style.display = "none";
      }, 3000);
    }
  });
}

// when the calculate button
let countDownTimer;
let priceMessage = "";
let servicePrice;
let addTax;
calculateMapBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    (getDistance != undefined) & (getDistance != "") ||
    (getTime != undefined) & (getTime != "")
  ) {
    if (getTime > 44 || getDistance > 43) {
      priceMessage = `Servizio fuori copertura`;
      displayResult.style.backgroundColor = "red";
      displayResult.innerHTML = `${priceMessage}`;
      displayResult.style.display = "block";
      setTimeout(() => {
        displayResult.style.display = "none";
        calculatorMainForm.reset();
        resetMapBtn.value = `Reset`;
        setTime = "";
        setDIstance = "";
        directionsDisplay.setDirections({ routes: [] });
        marker.setPosition(markerDefaultParameters.cords);
        marker.setMap(map);
        map.setZoom(15);
        map.setCenter(initialMapParameters.center);
      }, 3000);
    } else {
      servicePrice = 0;
      addTax = 0;
      noTollRadio.checked ? (tollRadio = "no") : (tollRadio = "yes");
      priceMessage = "";
      calculateTotal();
      countDownTimer = setInterval(runCountDownTimer, 1000);
    }
  } else {
    displayResult.style.backgroundColor = "red";
    displayResult.innerHTML = `seleziona nella mappa o inserisci l'indirizzo`;
    displayResult.style.display = "block";
    setTimeout(() => {
      displayResult.style.display = "none";
    }, 3000);
  }
});

// calculate the total price
function calculateTotal() {
  if ((getTime <= 25) & (getDistance <= 20)) {
    servicePrice = 0;
    addTax = 0;
  } else if ((getTime <= 35) & (getDistance <= 20)) {
    if (tollRadio == "no") {
      servicePrice = 5;
      addTax = 0;
    } else {
      servicePrice = 5;
      addTax = 3;
    }
  } else if ((getTime <= 30) & (getDistance <= 30)) {
    servicePrice = 10;
    addTax = 0;
  } else if ((getTime <= 37) & (getDistance <= 40)) {
    if (tollRadio == "no") {
      servicePrice = 15;
      addTax = 0;
    } else {
      servicePrice = 15;
      addTax = 5;
    }
  } else if ((getTime <= 44) & (getDistance <= 43)) {
    servicePrice = 20;
    addTax = 0;
  }
  if (priceMessage == "") {
    displayResult.innerHTML = `Prezzo Totale: &euro; ${servicePrice + addTax}`;
    displayResult.style.backgroundColor = "#4bb543";
    displayResult.style.display = "block";
  }
}

// countdown display
let count = 15;

function runCountDownTimer() {
  if (count > 1) {
    count = count - 1;
    resetMapBtn.value = `Reset (${count})`;
  } else {
    clearInterval(countDownTimer);
    count = 15;
    calculatorMainForm.reset();
    resetMapBtn.value = `Reset`;
    setTime = "";
    setDIstance = "";
    displayResult.style.display = "none";
    directionsDisplay.setDirections({ routes: [] });
    marker.setPosition(markerDefaultParameters.cords);
    marker.setMap(map);
    map.setZoom(15);
    map.setCenter(initialMapParameters.center);
  }
}

// when the reset Button Clicked
resetMapBtn.addEventListener("click", () => {
  clearInterval(countDownTimer);
  calculatorMainForm.reset();
  count = 15;
  setTime = "";
  setDIstance = "";
  displayResult.style.display = "none";
  resetMapBtn.value = `Reset`;
  placeInputBox.value = "";
  directionsDisplay.setDirections({ routes: [] });
  marker.setPosition(markerDefaultParameters.cords);
  marker.setMap(map);
  map.setZoom(15);
  map.setCenter(initialMapParameters.center);
});
