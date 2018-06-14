/**
 * The id for the storage
 */
var localStorageKey = "seeker";

/**
 * Retreive the data for the plugin
 * should return a map in the structure
 * {
 *   "#9(PR#)": {
 *     "files": {
 *       "README.md" : sha...(commit)
 *     }
 *   }
 * }
*/
function loadData() {
  var data = JSON.parse(localStorage.getItem(localStorageKey));
  if(data == undefined) {
    data = {};
  }
  if (data[getPullRequestId()] == undefined) {
    data[getPullRequestId()] = {};
    data[getPullRequestId()]['files'] = {};
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  }
  return data;
}

function readFiles() {

}

function writeFiles() {

}

/**
 * Clear all files for all pull request from the storage
 */
function clearAll() {
  localStorage.removeItem(localStorageKey);
}

/**
 * Clear all completed files for this pull request from the storage
 */
function clearPr() {
  var map = loadData();
  map[getPullRequestId()] = undefined;
  localStorage.setItem(localStorageKey, JSON.stringify(map));
  document.querySelectorAll('.HideAndSeek').forEach(function(checkBox) {
    checkBox.checked = false;
  });
}


function metaData(key, json) {
  return "<!-- " + key + " = " + JSON.stringify(json) + " -->";
}

function getMetaData(key, meta) {
  var regex = /<!-- seeker = (.*) -->/;
  var data = meta.match(regex)[1];
  return JSON.parse(data);
}
