let ViewModel = function(){

    this.locations = ko.observableArray(createLocations(locationList));
    this.infoWindow = new InfoWindow();
    this.filterSearch = new FilterSearch();
    this.menuList = new MenuList();
    
}


//Window displaying the information on location selected.
let InfoWindow = function(){
    let self = this;

    //the initial setup of a fake location that give instructions to the user
    //on how to navigate the app.
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

    //When a Location from MenuList is selected this function is called.
    //This changes the informaiton displayed to show relevant informaiton.
    //The name of the location is passed into this function to find data 
    //for the location.
    this.selectLocation = function(name){
        let foundLoc = {};
        
        //iterate through locations to find the one selected
        VM.locations().forEach(function(loc) {
            if(loc.name === name){
                foundLoc = loc;
            }
        }, this);

        //Only if a location was found in the array do we reassign.
        if(foundLoc != {}){
            self.selectedLocation().name(foundLoc.name);
            self.selectedLocation().description(foundLoc.description);
            self.selectedLocation().currentPhoto(foundLoc.photos[0]);
            self.selectedLocation().photos = foundLoc.photos;
            self.selectedLocation().currentPhotoIndex = 0;
        }

        //this moves the center of the map window to the current Location
        map.panTo({lat: foundLoc.coord[0], lng:foundLoc.coord[1]});
        //This changes the animatoins of the selected and non selected locations
        map.selectMapLocation(foundLoc.name);
    }

    //Fired when the user selects one of the direction arrows above the location
    //photo. cycles through the array of photo SRCs that the Location has
    this.changePhoto = function(direction){
        let index = self.selectedLocation().currentPhotoIndex;
        let photosLen = self.selectedLocation().photos.length;

        if(direction === "left"){
            //if we go too far left start at the end of the array
            if(index <= 0){
                newIndex = photosLen - 1;
            }
            //incase there is a problem with going over the array length
            //default it to zero
            else if(index >= photosLen){
                newIndex = 0;
            }
            //the default of the action is to move down the array
            else{
                newIndex = index - 1;
            }
        }
        else if(direction === "right"){
            //incase there is a problem with going under zero default it to zero
            if(index < 0){
                newIndex = 0;
            }
            //if we go over the array length restart back at zero
            else if(index >= (photosLen - 1)){
                newIndex = 0;
            }
            //default action is to move up the array
            else{
                newIndex = index + 1;
            }
        }
        //who knows what might happen so set it to zero
        else{
            newIndex = 0;
        }

        //set the newIndex and Photo SRC
        self.selectedLocation().currentPhotoIndex = newIndex;
        self.selectedLocation().currentPhoto(self.selectedLocation().photos[newIndex])
    }

    this.selectedInfoVisible = ko.observable(false);

    //this toggle the info window when the user clicks on the double verticle arrows
    this.toggleInfo = function(){
        self.selectedInfoVisible(!self.selectedInfoVisible());
    }
}

//Menu of Locations. Pulls in from the right
let MenuList = function(){
    let self = this;

    this.visible = ko.observable(false);

    //This toggle the locations menu that pulls in from the left
    this.toggleMenu = function(){
        self.visible(!self.visible());
    }
}


let FilterSearch = function(){
    let self = this;

    this.input = ko.observable("");
    
    this.searchQueryEntered = function(value, event){
        self.filter(self.input());
        return true;
    }

    this.filter = function(value){
        //Create a pattern from the value passed in to test() while searching
        let patt = RegExp(value);

        let foundLocations = [];

        //If we are filtering by keyword. 
        if(value.charAt(0) === '#'){
            let splitKey = value.split('#')
            let keyword = splitKey[1].toLowerCase();

            locationList.forEach(function(loc) {
                if(loc.keywords.includes(keyword)){
                    foundLocations.push(loc);
                }
            }, this);
        }
        //Search by name if no using keyword search
        else if(value.charAt(0) != '#'){
            locationList.forEach(function(loc) {
                if(patt.test(loc.name.toLowerCase())){
                    foundLocations.push(loc);
                }
            }, this);
        }
        //default foundLocations[] to entire locationsList[] if all cases fail
        else{
            foundLocations = locationsList;
        }
        
        //assign the new locations
        VM.locations(createLocations(foundLocations));

        //Filter location markers. Function found in map.js
        createMarkers(VM.locations());
    }
}


let Location = function(data){
    let self = this;

    this.name = data.name;
    this.description = "Data Loading from Wikipedia";
    this.coord = data.coord;
    this.photos = [];

    //If the location has a flickr keyword for search this will run
    //and on completion of the ajax request it will assign the src for
    //images to the photos array.
    if (data.flickrKey){
        let query = config.flickrQuery(data.flickrKey);
        let promise = flickrPhotosPromise(query);
        
        promise.done(function(response){
            self.photos = getFlickrPhotos(response);
            //if the Flickr API call was successful but there were not photos
            //returned then populate the photos array with the standard error photo
            if(self.photos.length == 0){
                self.photos = ["img/dante.jpeg"]
            }
        });

        //If Flickr API call was a failure then populate the photos array
        //with the standard error photo. 
        promise.fail(function(response){
            self.photos = ["img/dante.jpeg"]
        });
    }


    //If the location has a Wiki keyword for search this will run
    //and on completion of the ajax request it will assign the extract 
    //article object to the 'wiki' object located on the location.
    if(data.wikiKey){
        let query = config.wikiQuery(data.wikiKey);
        let promise = wikiArticlePromise(query);

        //If info is received from Wikipedia then the Location's description
        //will be changed to the extracted information. If not then it will
        //fallback to the hardcoded info.
        promise.done(function(response){
            let wiki = response.query.pages[0];
            self.description = wiki.extract;
        });

        //On failure of Wiki API call make location description this error message
        promise.fail(function(response){
            self.description("Unable to load data from Wikipedia. Please try us again later.")
        });
    }
}


//takes in the array of locations and stores the observable
//data in a new object and pushes that object into a new array
//then returns that array
function createLocations(list){
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

//This function returns an AJAX promise to be called to get the Wiki
//article extract later for each location.
function wikiArticlePromise(wikiQuery){
    return $.ajax({
        url: wikiQuery,
        dataType: "jsonp"
    });
}

//Lets Get Crakin'
let VM = new ViewModel();
ko.applyBindings(VM);
