var map;
var usa = {lat: 37.09024, lng: -95.7129};
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: usa,
        zoom: 2
    });
}


var markers = [];
var getMarkerUniqueId = function(lat, lng) {
    return lat + '_' + lng;
}
//Adds marker to map and push to the array
function addMarker(location) {
    var markerId = getMarkerUniqueId(location.lat, location.lng);
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        animation: google.maps.Animation.DROP,
        id: markerId
    });
    markers[markerId] = marker;
}

//** sets the map on all markers in the array
function setMapOnAll(map) {
    for (marker in markers) {
        markers[marker].setMap(map);
    }                
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}
// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

var removeMarker = function(marker, markerId) {
    marker.setMap(null); // set markers setMap to null to remove it from map
    delete markers[markerId]; // delete marker instance from markers object
}; 


