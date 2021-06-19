// Variables For map
let map;
let marker;
let directionsService;
let directionsDisplay;
let initialMapParameters = {
  zoom: 15,
  center: { lat: 40.7474824, lng: 14.6324808 },
};
let mapDisplaySelector = document.getElementById("map");
let markerDefaultParameters = {
  cords: { lat: 40.74741139701506, lng: 14.63262364268303 },
};

function initMap() {
     try{
  map = new google.maps.Map(mapDisplaySelector, initialMapParameters);
     }catch(error){
          console.log(error);
     }
}

initMap().then(() => {}).;
