function runTests(){

    //Test to check prpper flickrQuery is returned
    (function(){
        console.log("Expected result is /n https://api.flickr.com/services/rest/"
            +       "?method=flickr.photos.search&api_key=3dedccec23d1400ca68"
            +       "88444a10b5fea&format=json&nojsoncallback=1&tags=Bargello"
            +       "&extras=url_o&per_page=10"
            +       "\n Result Given: \n"
            +       config.flickrQuery(locationList[1].flickrKey));
    })();

    //Test to see if we can return the array of photos
    (function(){
        let promise = flickrPhotosPromise("https://api.flickr.com/services/rest/"
            +       "?method=flickr.photos.search&api_key=3dedccec23d1400ca68"
            +       "88444a10b5fea&format=json&nojsoncallback=1&text=Bargello"
            +       "&extras=url_o&per_page=10");
            promise.done(function(result){
                let photos = result.photos.photo;
                console.log("Should receive an array of photo objects from Flickr");
                console.log(photos);
            });
    })();

    //Tests to see if we return an array of URLS of pictures
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

    //Tests to see if we return an object from Wikipedia with extracted information
    (function(){
    let query = "https://en.wikipedia.org/w/api.php?format=json&formatversion=2&action=query&prop=extracts&exintro=&explaintext=&titles=Bargello";
    $.ajax({
        url: query,
        dataType: 'jsonp',
        success: function(response){
            console.log("Should recieve an object with extracted Wiki info")
            console.log(response.query.pages[0]);
        }
    });
})()
    
}