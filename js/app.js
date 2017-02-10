'use scrict'

let List = function(){

    var self = this;

    this.visible = ko.observable(true);
    this.locations = ko.observableArray(makeLocsObserve(locationList));
    this.selectedLocation = ko.observable(new Location({
        name: self.locations()[0].name(),
        description: self.locations()[0].description(),
        coord: self.locations()[0].coord()
    }));

    console.log(map)


    this.selectLocation = function(){
        self.selectedLocation().name(this.name());
         map.panTo({lat: this.coord()[0], lng:this.coord()[1]});
    }

    this.toggleMenu = function(){
        self.visible(!self.visible());
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
    let newList = []
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