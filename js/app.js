'use scrict'

let List = function(){

    var self = this;

    this.visible = ko.observable(true);
    this.locations = ko.observableArray(makeLocsObserve(locationList));
    this.selectedLocation = ko.observable(new Location({
        name: "",
        description: "",
        coord: []
    }));


    this.selectLocation = function(){
        self.selectedLocation().name(this.name());
        console.log(self.selectedLocation().name())
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
            coord: ko.observable(loc.coord)
        }
        newList.push(newLoc);
    }, this);
    return newList;
}

ko.applyBindings(new List());