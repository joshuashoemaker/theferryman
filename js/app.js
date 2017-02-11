let List = function(){

    var self = this;

    this.visible = ko.observable(false);
    this.locations = ko.observableArray(makeLocsObserve(locationList));

    this.selectedLocation = ko.observable(new Location({
        name: "Select Location to Info",
        description: "Open the menu to the left and select a location to read more information about it.",
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

let list = ko.applyBindings(new List());