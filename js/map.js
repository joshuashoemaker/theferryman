let map = {};
let markers = [];

function initMap() {

    var initPost = {lat: locationList[0].coord[0], lng: locationList[0].coord[1]};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: initPost,
        styles: mapStyles,
        disableDefaultUI: true
    });
    
//Lets Get Crakin'
    //VM is first created at the bottom of 'app.js' but is left undefined.
    VM = new ViewModel();
    //After Google API loads we will establish the data bindings
    ko.applyBindings(VM);
}


function filterMarkers(locations){    
    locations.forEach(function(loc) {
        if(loc.visible()){
            loc.marker.setVisible(true);
        }
        else{
            loc.marker.setVisible(false);
        }
    }, this);
}


function setMapOnAll(map) {
    markers.forEach(function(marker) {
          marker.setMap(map);
    }, this);
}


function googleError(){
    document.getElementById("map").innerHTML = "<h1>Google Maps failed to load properly. Please check back soon!</h1>";
}