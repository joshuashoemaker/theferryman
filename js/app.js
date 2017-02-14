let ViewModel = function(){

    var self = this;

    this.visible = ko.observable(false);
    this.locations = ko.observableArray(makeLocsObserve(locationList));

    this.selectedLocation = ko.observable(new Location({
        name: "Select Location to Info",
        description: "Open the menu to the left and select a location to read"+
                    " more information about it. This app is still in development"+
                    " and not all locations have been added.",
        coord: []
    }));

    this.selectLocation = function(){
        self.selectedLocation().name(this.name());
        self.selectedLocation().description(this.description());
        map.panTo({lat: this.coord()[0], lng:this.coord()[1]});
        map.selectMapLocation(this.name());
    }

    this.toggleMenu = function(){
        self.visible(!self.visible());
    }

    this.selectedInfoVisible = ko.observable(false);
    
    this.toggleInfo = function(){
        console.log("toggle");
        self.selectedInfoVisible(!self.selectedInfoVisible());
    }

}

let Location = function(data){

    this.name = ko.observable(data.name);
    this.description = ko.observable(data.description);
    this.coord = ko.observable(data.coord);

}

//takes in the array of locations and stores the observable
//data in a new object and pushes that object into a new array
//then returns that array
function makeLocsObserve(list){
    let newList = [];
    list.forEach(function(loc) {
        newLoc = {
            name: ko.observable(loc.name),
            description: ko.observable(loc.description),
            coord: ko.observableArray(loc.coord)
        }
        newList.push(newLoc);
    }, this);
    return newList;
}

//This function takes in a url endpoint to the flickr api
//the query url is generated in the config file. On the config
//object is a function 'flickrQuery(keyword)'. This function 
//returns a promise that will called later to get the images later 
function flickrPhotosPromise(flickrQuery){
    return $.ajax({
        url: flickrQuery,
        dataType: "json"
    });
}


//This funciton takes in a promise created from 'flickrPhotosPromise()'
//takes the image urls and pushes them into a new array
//then returns the array created
function getFlickrPhotos(data){
        let photos = data.photos.photo;
        photos.forEach(function(p){
            if(p.url_o != undefined){
                photos.push(p.url_o);
            }
        });
        return photos;
}


let list = ko.applyBindings(new ViewModel());