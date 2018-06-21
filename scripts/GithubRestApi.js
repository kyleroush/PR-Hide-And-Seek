function callAjax(url, callback) {
    var xmlhttp;
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback(xmlhttp.responseText);
            return xmlhttp.responseText;
        } else if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
          console.log("there was an error");
          return "{}";
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function getPrsFiles(root, org, repo, pr, callback) {
  var path =  "repos/"+org+"/"+repo+"/pulls/"+pr+"/files";
  var url = new URL(path, "https://api."+root)
  return callAjax(url.href, callback)
  //https://api.github.com/repos/kyleroush/PR-Hide-And-Seek/pulls/30/files
}

function getPrsConvo(root, org, repo, pr, callback) {
  var path =  "repos/"+org+"/"+repo+"/pulls/"+pr+"/reviews";
  var url = new URL(path, "https://api."+root)
  //https://api.github.com/repos/kyleroush/PR-Hide-And-Seek/pulls/39/reviews
  return callAjax(url.href, callback)
}
