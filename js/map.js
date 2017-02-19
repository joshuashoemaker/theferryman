let map = {};
let markers = [];

function initMap() {

    var initPost = {lat: locationList[0].coord[0], lng: locationList[0].coord[1]};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: initPost,
        styles: mapStyles,
        disableDefaultUI: true,
                
        selectMapLocation: function(locationName){
            markers.forEach(function(marker) {
                if(marker.title === locationName){
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
                if(marker.title != locationName){
                    marker.setAnimation(google.maps.Animation.NONE);
                }
            }, this);
        }
    });
        
    createMarkers(locationList);
}
    
function createMarkers(locations){

    //clear all markers
    setMapOnAll(null);
    markers = [];
    
    locations.forEach(function(loc) {
        let marker = new google.maps.Marker({
            position: {lat: loc.coord[0], lng: loc.coord[1]},
            title: loc.name,
            map: map
        });

        marker.addListener('click', function() {
            map.setZoom(15);
            map.panTo(marker.getPosition());
            VM.infoWindow.selectLocation(marker.title);
        });

        markers.push(marker);
    }, this);
}

function setMapOnAll(map) {
    markers.forEach(function(mark) {
          mark.setMap(map);
    }, this);
}

function googleError(){
    document.getElementById("map").innerHTML = "<h1>Google Maps failed to load properly. Please check back soon!</h1>";
}