var DEBUG = true;

/**
 *  Return KB,MB,GB from Bytes.
 */
function getDataSize(length) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  var index = 0;
  while (length > 1024) {
    length = length / 1024;
    index++;
  }
  if (index >= sizes.length) {
    PRINT_MSG("HUGE A$$ FILE.");
    return length + " BIGA$$ FILE";
  } else {
    var num = parseFloat(length);
    num = num.toFixed();
    return num + " " + sizes[index];
  }
}

function getSizeOfSearchResultByMatch(searchResult, responseArray){
  var url;
  // Get URL of google search result.
  var children = searchResult.childNodes;
  for(var x = 0; x < children.length; x++){
    if(children[x].hasAttribute("href")){
      url = children[x].href;
      break;
    }
  }

  for(var i = 0; i < responseArray.length; i++){
    var responseURL = responseArray[i].search_result_link;
    if(responseURL === url){
      return responseArray[i].fileSize;
    }
  }
  return -1;
}

function getLinkSize(searchResults, link){
    for(var i = 0; i < searchResults.length; i++){
      var elt = searchResults[i];
      if(elt.search_result === link){
        return elt.length;
      }
    }
    return "Link Not found in array.";
}

// Returns the URLs of the google search results.
function getSearchResultLinks(){
  var results = document.getElementsByClassName('r');
  var resultLinks = [];
  for(var i = 0; i < results.length; i++){
      var children = results[i].childNodes;
      for(var x = 0; x < children.length; x++){
        if(children[x].hasAttribute("href")){
          resultLinks.push(children[x].href);
          break;
        }
      }
  }
  return resultLinks;
}

PRINT_MSG("Howdy there partner. Yeeha");
var links = [];
links = getSearchResultLinks();
PRINT_MSG(links);
PRINT_MSG("////////////////");



chrome.runtime.sendMessage({
  linkData: links
}, function(responseArray) {
      // search_result_link && fileSize properties.
      PRINT_MSG("Here is what the backend sent to the front end.");
      PRINT_MSG(responseArray);

      // ~ ~ ~ Let's calculate the sizes of the files. ~ ~ ~

      for (var i = 0; i < responseArray.length; i++) {
        var headerResult = responseArray[i];
        var fileSize = headerResult.fileSize;
        var convertedLength = (fileSize === null || fileSize === undefined) ? "Undetermined" : getDataSize(fileSize);
        headerResult.fileSize = convertedLength;
      }

      PRINT_MSG("Sizes converted:");
      PRINT_MSG(responseArray)

      // ~ ~ ~ Now we need to update the DOM and display the returned file sizes. ~ ~ ~

      var searchResults = document.getElementsByClassName('r');

      // Go through each searchResult.
      for(var i = 0; i < searchResults.length; i++){
        var searchResult = searchResults[i];

        // See if we have a size for it.
        var search_result_file_size = getSizeOfSearchResultByMatch(searchResult, responseArray);
        if(search_result_file_size === -1){
          continue;
        }

        //We have a size for it, update dom. TODO

        var newItem = document.createElement("LI");
        var textnode = document.createTextNode(search_result_file_size);
        newItem.appendChild(textnode);
        searchResult.appendChild(newItem);
      }
});

function PRINT_MSG(msg){
  if(DEBUG === true){
    console.log(msg);
  }
}


// TODO
// 1) Make async Requests
// 2) Make HTML Size Elts more distinct
// 3) Look into HTML only vs not only.
// 4) Cleanup code, maybe use dictonary...
