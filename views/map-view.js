function marking() {
    var geocoder = new google.maps.Geocoder();
    for (var i = 0; i < location.length; i++) {
        var address =
            location[i]._streetNumber + ", " +
            location[i]._street + ", " +
            location[i]._unit + ", " +
            locaiton[i]._city + ", " +
            location[i]._state + ", " +
            location[i]._zipcode;

        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                marker = new google.maps.Marker({
                    map: document.getElementById("map"),
                    position: results[0].geometry.location
                });
            } else {
                alert("Geocode not found");
            }
        })
    }
    alert("done");
}