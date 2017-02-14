//parseFlickrImageSrc(getFlickrPhotos(config.flickrQuery(locationList[1].flickrKey)))

//Test to check prpper flickrQuery is returned
(function(){
    console.log("Expected result is https://api.flickr.com/services/rest/"
        +       "?method=flickr.photos.search&api_key=3dedccec23d1400ca68"
        +       "88444a10b5fea&format=json&nojsoncallback=1&tags=Bargello"
        +       "&extras=url_o&per_page=10"
        +       "\n Result Given: \n"
        +       config.flickrQuery(locationList[1].flickrKey));
})();

//Test to see if we can return the array of photos
(function(){
    let photos = []
    let promise = flickrPhotosPromise("https://api.flickr.com/services/rest/"
        +       "?method=flickr.photos.search&api_key=3dedccec23d1400ca68"
        +       "88444a10b5fea&format=json&nojsoncallback=1&tags=Bargello"
        +       "&extras=url_o&per_page=10");
        promise.done(function(result){
            let photosArr = result.photos.photo;
            photosArr.forEach(function(p) {
                photos.push(p.url_o);
            }, this);
            //console.log("Should receive object response from Flickr")
            //console.log(photos);
        });
})();

(function(){
    let query = config.flickrQuery(locationList[1].flickrKey);
    let promise = flickrPhotosPromise(query);

    let photos = [];
    
    promise.done(function(data){
        photos = getFlickrPhotos(data);
        console.log("Should recieve an array of URLs")
        console.log(photos);
    });
})();