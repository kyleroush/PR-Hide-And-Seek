/**
 * The id for the storage
 */
var localStorageKey = "seeker";
var filesStorageKey = "files";
var commentStatusKey = "comementStatus";

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
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  }
  if (data[getPullRequestId()][filesStorageKey] == undefined) {
    data[getPullRequestId()][filesStorageKey] = {};
  }
  if (data[getPullRequestId()][commentStatusKey] == undefined) {
    data[getPullRequestId()][commentStatusKey] = {};
  }
  return data;
}

function readFiles() {
  return loadData()[getPullRequestId()][filesStorageKey];
}

function writeFiles(files) {
  var data = loadData();
  data[getPullRequestId()][filesStorageKey] = files;
  localStorage.setItem(localStorageKey, JSON.stringify(data));
}

function readCommentStatus() {
  return loadData()[getPullRequestId()][commentStatusKey];
}

function writeCommentStatus(files) {
  var data = loadData();
  data[getPullRequestId()][commentStatusKey] = files;
  localStorage.setItem(localStorageKey, JSON.stringify(data));
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
