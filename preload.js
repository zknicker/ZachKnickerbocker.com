// Takes an array of image URLs as a parameter, and then preloads them.
// Times out after 5 seconds, and returns a promise with the loaded images.
function preloadImages(imageUrls){
    if (typeof imageUrls != "object") {
            imageUrls = [imageUrls];
    }

    var loadedImages = [], loadedImagesCount = 0;
    var def = $.Deferred();
    var timeout = window.setTimeout(imageLoadingTimedOut, 5000);

    function imageLoaded(){
        loadedImagesCount++;

        if (loadedImagesCount == loadedImages.length){
            window.clearTimeout(timeout);
            def.resolve(loadedImages);
        }
    }

    function imageLoadingTimedOut() {
        def.reject(loadedImages);
    }

    for (var i = 0; i < imageUrls.length; i++) {
        loadedImages[i] = new Image();
        loadedImages[i].src = imageUrls[i];
        loadedImages[i].onload = imageLoaded;
        loadedImages[i].onerror = imageLoaded;
    }

    return def.promise();
}
