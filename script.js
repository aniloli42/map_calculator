let servicePrice = 0;
let addTax = 0;
let priceMessage = "";
let inputValues = [];
let displayPrice = document.getElementById("displayResult");
let mapMarked = false;
const removeMark = document.getElementById("removeMark");
let getDistance;
let getTime;
let secondMarkCords;
var directionService;
var directionsDisplay;
let placeEntered = false;
const distanceBox = document.getElementById("distance");
const timeBox = document.getElementById("time");
var placeAddress = document.getElementById("placeAddress");
let placeMessage = document.getElementById("placeMessage");
var options = {
  zoom: 15,
  center: { lat: 40.7474824, lng: 14.6324808 },
};

let defaultMarkers = {
  cords: { lat: 40.74741139701506, lng: 14.63262364268303 },
};

function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), options);

  //   Listen for click on map
  google.maps.event.addListener(map, "click", function (event) {
    if (mapMarked == false) {
      mapMarked = true;
      addMarker({
        cords: event.latLng,
      });
    }
  });

  // place mark

  var addOption = {
    types: ["(cities)"],
  };

  var autocomplete1 = new google.maps.places.Autocomplete(
    placeAddress,
    addOption
  );
  autocomplete1.bindTo("bounds", map);

  var placeBtn = document.getElementById("placeBtn");
  placeBtn.addEventListener("click", () => {
    if ((placeAddress.value != "") & (placeAddress.value != undefined)) {
      placeEntered = true;
      placeEnter = placeAddress.value;
      calcRoute(placeEnter);
    }
  });

  addMarker(defaultMarkers);

  function addMarker(props) {
    let marker = new google.maps.Marker({
      position: props.cords,
    });
    marker.setMap(map);
    if (mapMarked) {
      secondMarkCords = {
        cords: {
          lat: props.cords.lat(),
          lng: props.cords.lng(),
        },
      };
      calcRoute(secondMarkCords.cords);
    }
    removeMarked(marker);
  }

  // create a Directions service object to use the route method
  directionService = new google.maps.DirectionsService();

  // create a DirectionsRenderrer object which will using to display the route
  directionsDisplay = new google.maps.DirectionsRenderer();

  // bind the directionsRenderrer to the map
  directionsDisplay.setMap(map);

  // function of calculate the route
  function calcRoute(secondValue) {
    // create request
    var request = {
      origin: defaultMarkers.cords,
      destination: secondValue,
      travelMode: "DRIVING", // DRIVING can change to BICYCLE, WALKING
      unitSystem: google.maps.UnitSystem.METRIC,
    };

    // pass the request to the route method
    directionService.route(request, (result, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        // get distance and time
        getDistanceInMeter = result.routes[0].legs[0].distance.value;
        getTimeInseconds = result.routes[0].legs[0].duration.value;

        getDistance = getDistanceInMeter / 1000;
        getTime = getTimeInseconds / 60;
        getDistance = Math.round(getDistance.toFixed(2));
        getTime = Math.round(getTime.toFixed(2));

        distanceBox.value = getDistance;
        timeBox.value = getTime;

        directionsDisplay.setDirections(result);
      } else {
        map.setCenter(options.center);
        placeMessage.innerHTML = "Invalid Route or Route not Available";
        placeMessage.style.display = "block";
        setTimeout(() => {
          placeMessage.innerHTML = "";
          placeMessage.style.display = "none";
          placeAddress.value = "";
        }, 3000);
      }
    });
  }

  //   remove mark
  function removeMarked(marker) {
    removeMark.addEventListener("click", () => {
      directionsDisplay.setDirections({ routes: [] });
      marker.setMap(null);
      secondMarkCords = "";
      distanceBox.value = "";
      timeBox.value = "";
      mapMarked = false;
      map.setCenter(options.center);
      map.setZoom(15);
      addMarker(defaultMarkers);
      displayResult.style.display = "none";
      distanceBox.value = "";
      timeBox.value = "";
      placeAddress.value = "";
    });
  }
}

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
      setTimeout(() => {
        displayResult.style.display = "none";
      }, 3000);
    }
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
  if ((inputValues[0] != "") & (inputValues[1] != "")) {
    const calcObj = new getValues(
      inputValues[0],
      inputValues[1],
      inputValues[2]
    );
    calcObj.calculatePrice();

    setTimeout(() => {}, 15000);
  } else {
    displayResult.innerHTML = `Select in the map`;
    displayResult.style.display = "block";
    displayResult.style.backgroundColor = "red";
    setTimeout(() => {
      displayResult.innerHTML = "";
      displayResult.style.display = "none";
    }, 3000);
  }
});
