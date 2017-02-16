let ViewModel = function(){
    var self = this;

    this.locations = ko.observableArray(createObservableLocs(locationList));
    this.infoWindow = new infoWindow();
    this.menuList = new MenuList();
    
}


let infoWindow = function(){
    let self = this;

    this.selectedLocation = ko.observable({
        name: ko.observable("Select Location to Info"),
        description: ko.observable("Open the menu to the left and select a location to read"+
                    " more information about it. This app is still in development"+
                    " and not all locations have been added."),
        coord: ko.observableArray,
        photos: ko.observableArray,
        currentPhoto: ko.observable(),
        currentPhotoIndex: 0
    });

    this.selectLocation = function(){
        self.selectedLocation().name(this.name());
        self.selectedLocation().description(this.description());
        self.selectedLocation().currentPhoto(this.photos[0]);
        self.selectedLocation().photos = this.photos;
        self.selectedLocation().currentPhotoIndex = 0;

        map.panTo({lat: this.coord()[0], lng:this.coord()[1]});
        map.selectMapLocation(this.name());
    }

    this.changePhoto = function(direction){
        let index = self.selectedLocation().currentPhotoIndex;
        let photosLen = self.selectedLocation().photos.length;

        if(direction === "left"){
            if(index <= 0){
                newIndex = photosLen - 1;
            }
            else if(index >= photosLen){
                newIndex = 0;
            }
            else{
                newIndex = index - 1;
            }
        }
        else if(direction === "right"){
            if(index < 0){
                newIndex = 0;
            }
            else if(index >= (photosLen - 1)){
                newIndex = 0;
            }
            else{
                newIndex = index + 1;
            }
        }
        else{
            newIndex = 0;
        }

        self.selectedLocation().currentPhotoIndex = newIndex;
        self.selectedLocation().currentPhoto(self.selectedLocation().photos[newIndex])
    }

    this.selectedInfoVisible = ko.observable(false);

    this.toggleInfo = function(){
        self.selectedInfoVisible(!self.selectedInfoVisible());
        console.log('toggle');
    }
}


let MenuList = function(){
    let self = this;

    this.visible = ko.observable(false);

    //This toggle the locations menu that pulls in from the left
    this.toggleMenu = function(){
        self.visible(!self.visible());
    }
}


let Location = function(data){
    let self = this;

    this.name = ko.observable(data.name);
    this.description = ko.observable(data.description);
    this.coord = ko.observable(data.coord);
    this.photos = [];

    //If the location has a flickr keyword for search this will run
    //and on completion of the ajax request it will assign the src for
    //images to the photos array. The presence of a keyword is in place
    //primarily for the reason of the creation of a fake location at page load
    if (data.flickrKey){
        (function(){
            let query = config.flickrQuery(data.flickrKey);
            let promise = flickrPhotosPromise(query);
            
            promise.done(function(response){
                self.photos = getFlickrPhotos(response);
            });
        })();
    }
}


//takes in the array of locations and stores the observable
//data in a new object and pushes that object into a new array
//then returns that array
function createObservableLocs(list){
    let newList = [];
    list.forEach(function(loc) {
        let newLoc = new Location(loc);
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
        let newPhotos = []
        photos.forEach(function(p){
            if(p.url_o != undefined){
                newPhotos.push(p.url_o);
            }
        });
        return newPhotos;
}


let list = ko.applyBindings(new ViewModel());