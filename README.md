# The Ferry Man
## A Guide to Dante's Florence

Built in Knockout.js this SPA provides information on locations important in Florence, Italy in the time of Dante. This app
pulls data from Wikipedia's API and pulls photos from Flickr's API. The code is well commented so it is easy to navigate. 
The data-bindings fire off in map.js after Google API call was successful.

##Locations Data
We will start here, in "js/locations.js" with "let locationsList" to understand how this app is working. 
What kind of data do the "Locations" hold? Each location has a name, longitude and latitude array,
an address string, keywords array, and search terms for Wikipedia and Flickr respectively.

###keywords
The strings in this array are inspected when the user searches in the input field when typing '#" in front of the desired keyword.
The filter function is found in app.js under 'FilterSearch'. 

###wikiKey
This is the title that is needed for the WIki API url query. The wikiKey is sent to the "config.wikiQuery()" function located in
"js/config.js" and concatenated with the URL with API key and keyword.

###flickrKey
This the the search string used for Flickr's API. The flickrKey is send to the "config.flickrQuery()" function located in "js/config.js"
and concatenated with the url and API key and keyword.

###coords
These are the values used by google maps api for marker placement. The first value in the array, [0], is longitude. The second value, 
[1], is latitude.

###address
This value is not currently used in the application; however, some location objects hove it assigned.

##ViewModel
The ViewModel located at the top of app.js, and referenced to as 'VM', has four properties: 'locations', 'infoWindow', 
'menuList', 'filterSearch'.

###locations
An this array is created by taking in the locationsList and sending it through 'createLocations' to perform all of the AJAX requests 
and assigned the received data from the Wikipedia and Flickr APIs.

###menuList
This is the menu that slides in from the left that shows the list of all locations or the currently filtered ones. Only has 
a 'visible' attribute and a 'toggle' visibility method.

###infoWindow
This is the div section that slides in from the bottom. Here information is displayed about the currently selected location. 
Flickr photos and Wiki information is shown here. A method to cycle through the photos exist here.

###filterSearch
Here we have a binding to the text input field that is visible in the Menu List view. As the user types, the locations are filtered.
If the user put a '#' at the beginning the input will filter based on keywords found on the location object. If the user is not 
searching by keyword then the locations will filter by name. The selections available on the list will update accordingly and 
so will the Map markers.

##Map
Most of the code here is very standard to the documentation available on Google Maps API. An error handling method was attached to 
be called in the event the JavaScript SDK could not be loaded from Google's servers. This method is called from the HTML of the async
script tag.

Also in this file we handle the removal and showing of filtered locations.

#Install
Just run on a local server and visit localhost:'WhatEverPortYouHostOn'. I use the Express Server extention in VS Code to run mine.
You can also just visit https://github.com/JoshuaShoemaker/theferryman to see it running now. No need to change the path in local host, 
the app runs from the index.html.