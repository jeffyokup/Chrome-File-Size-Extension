
var DEBUG = true;
PRINT_MSG("HOWDY FROM THE BACK PARTNER");

function getFileSizes(links) {
  var sizeArr = [];
  for (var i = 0; i < links.length; i++) {
    var search_result = links[i];
    PRINT_MSG(search_result);

    var xhr = new XMLHttpRequest();
    try {
      xhr.open("HEAD", search_result, false); // false specifies sync
      /*xhr.onload = function(e){
        console.log(e);
        if (xhr.status === 200) {
          //PRINT_MSG(xhr.responseText);
          console.log(JSON.parse(e.total));
        } else {
          console.error(e);
        }
      }*/
      xhr.send();
    } catch (error) {
      PRINT_MSG("Skipping: " + search_result);
      PRINT_MSG("Error type: " + error);
      continue;
    }

    if (xhr.readyState == 4) {
      var resp = xhr;
      // JSON.parse does not evaluate the attacker's scripts.
      var contentLength = JSON.parse(resp.getResponseHeader("Content-Length"));
      sizeArr.push({
        search_result_link: search_result,
        fileSize: contentLength
      });
      PRINT_MSG(contentLength);
      //PRINT_MSG("HEAD response for ", search_result, " ", resp);
    }else{
      PRINT_MSG("XHR ready state:" + xhr.readyState);
    }
  }

  return sizeArr;
}

chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    PRINT_MSG("Background.js recieved message:");
    PRINT_MSG(msg);
    //getFileSizes(msg.linkData);
    var sizeArr = getFileSizes(msg.linkData);
    sendResponse(sizeArr);
  });

function PRINT_MSG(msg){
  if(DEBUG === true){
    console.log(msg);
  }
}
