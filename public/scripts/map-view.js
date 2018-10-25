
var map;
var socket;
// setInterval(function () {
// }, 10000);
// var geocodes;
function initialize() {
    var mapProp = {
        center: new google.maps.LatLng(40.7128, -74.0060),
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), mapProp);
    
    // google.maps.event.trigger(map, 'resize');
    // var room = "view"
    // socket = io.connect('http://localhost:8080');
    // socket.on('connect', function () {
    //     socket.emit('room', room);
    // })
    // socket.on('view-campaign-geocodes', async function (geocode) {
    //     await loadMarkers(geocode);
    // });

}
google.maps.event.addDomListener(window, "resize", function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center); 
   });
// function setupSocket(){
//     var room = "view"
//     socket = io.connect('http://localhost:8080');
//     socket.on('connect', function () {
//         socket.emit('room', room);
//     })
//     socket.on('view-campaign-geocodes', function (geocode) {
//         alert(geocode);
//         // geocode = geocode;
//         return geocode;
//     });
// }

function loadMarkers(geocodes) {
    for (let i in geocodes) {
        var coord = new google.maps.LatLng(geocodes[i].lat, geocodes[i].lng);
        var marker = new google.maps.Marker({
            map: map,
            position: coord
        });
        marker.setMap(map);
    }
    var infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(text); 
      infowindow.open(map,marker);
    });
    // location.reload(true);
}

google.maps.event.addDomListener(window, 'load', initialize);