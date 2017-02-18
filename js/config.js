const config = {
    mapKey: "AIzaSyBGWJSOzXs72lece0D4vyKrFfYPUuOnnEs",
    flickrQuery: function(keyword){
        let flickrKey = "3dedccec23d1400ca6888444a10b5fea";
        let flickrUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="
                        + flickrKey +"&format=json&nojsoncallback=1&text=" + keyword + "&extras=url_o&per_page=25";
        return flickrUrl;
    },
    wikiQuery: function(keyword){
        let wikiUrl = "https://en.wikipedia.org/w/api.php?format=json&formatversion=2&action=query&redirects=1&prop=extracts&exintro=&explaintext=&titles="
        return wikiUrl + keyword;
    }
}