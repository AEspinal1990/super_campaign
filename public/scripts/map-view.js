var map;
var socket;
// setInterval(function () {
// }, 10000);
// var geocodes;
async function initialize() {
    // var docGeoCodes = document.getElementsByClassName('geocodes');
    // var codes = new Array();
    // for (var i=0;i<docGeoCodes.length;i++){
    //     codes.push(docGeoCodes[i].innerHTML);
    // }
    // alert(codes.join(', '));

    var mapProp = {
        center: new google.maps.LatLng(40.7128, -74.0060),
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), mapProp);

    //google.maps.event.trigger(map, 'resize');
    var room = "view"
    socket = io.connect();
    socket.on('connect', function () {
        socket.emit('room', room);
    })
    socket.on('view-campaign-geocodes', function (geocode) {
        console.log(geocode);
        loadMarkers(geocode);
    });

}

function loadMarkers(geocodes) {
    console.log("geocodes: "+geocodes);
    for (let i in geocodes) {
        var coord = new google.maps.LatLng(geocodes[i].lat, geocodes[i].lng);
        var marker = new google.maps.Marker({
            map: map,
            position: coord
        });
        // marker.setMap(map);
    }
    var infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(text);
        infowindow.open(map, marker);
    });
    // window.location.reload(true);
    
}

google.maps.event.addDomListener(window, 'load', initialize);

// window.onload(initialize());
