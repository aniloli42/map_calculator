// Variables For map
let map;
let marker;
let directionsService;
let directionsDisplay;
let getClickPosition;
const initialMapParameters = {
  zoom: 15,
  center: { lat: 40.7474824, lng: 14.6324808 },
};
const mapDisplaySelector = document.getElementById("map");
const markerDefaultParameters = {
  cords: { lat: 40.74741139701506, lng: 14.63262364268303 },
};

// Variable for the Display and Calculations
const placeInputBox = document.getElementById("placeAddress");
const placeEnteredSearchBtn = document.getElementById("placeBtn");
let getDistanceInMeter;
let geTime;

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
    console.log("that");
  });

function markerFunction() {
  marker = new google.maps.Marker();
}

// set the default marker into the serivce center
marker.setPosition(markerDefaultParameters.cords);
marker.setMap(map);

// Listen the click in the google map
google.maps.event.addListener(map, "click", (event) => {
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

// route the
placeEnteredSearchBtn.addEventListener("click", () => {
  if ((placeInputBox.value != null) & (placeInputBox.value != undefined)) {
    displayRoute(placeInputBox.value);
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
    if (status == google.maps.DirectionsStatus.OK) {
      // remove the default marker for the show the origin single marked
      marker.setMap(null);
      // display the route
      directionsDisplay.setDirections(result);
    }
  });
}
