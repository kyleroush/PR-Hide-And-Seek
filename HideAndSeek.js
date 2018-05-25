
//------------------Utils

/**
 * The id for the storage
 */
var localStorageKey = "seeker";

//return the number for the pull request
/**
 * Get an id for this pull request
 *
 * Information needed for unique id:
 *    which github instance is this on (host)
 *    The the org/author
 *    The Repo name
 *    The pull request number
 */
function getPullRequestId() {
  return window.location.hostname + window.location.pathname;
}

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

//----------------------Unused utils
// to be used when testing or when a setting page is created

/**
 * Clear all files for all pull request from the storage
 */
function clearAll() {
  localStorage.removeItem(localStorageKey);
}

/**
 * Clear all completed files for this pull request from the storage
 */
 //TODO: uncheck any checked files.
function clearPr() {
  var map = loadData();
  map[getPullRequestId()] = undefined;
  localStorage.setItem(localStorageKey, JSON.stringify(map));

}

//---------------------Complete button

//add the check boxes to each files files-acations class to make the file is completed or not
/**
 * Add an an action to complete a file on each file.
 */
 //TODO: Add the sha to the check box.
function addCompleteAction(files) {

  var headers = document.querySelectorAll('.file-header.js-file-header');
  headers.forEach(function(headers) {
    var action = headers.querySelector('.file-actions');
    var filePath = headers.attributes["data-path"].value
    var sha = sha
    action.appendChild(createCheckBox(filePath, sha, files[filePath] != undefined));
  });
}

/**
 * Create an instance of the checkbox to complete a file.
 */
function createCheckBox(filePath, sha, checked) {
  var span = document.createElement('span');
  var label = document.createElement('label');
  var checkBox = document.createElement('input');
  checkBox.addEventListener( 'click', function() {
      if(this.checked) {
        // console.log(this)
        this.parentElement.parentElement.parentElement.querySelector('.btn-octicon.p-1.pr-2.js-details-target').click();
        completeFile(checkBox.dataset.filePath, checkBox.dataset.sha);
      } else {
        unCompleteFile(checkBox.dataset.filePath);
      }
  });
  checkBox.dataset.filePath = filePath;
  checkBox.dataset.sha = sha;
  checkBox.querySelector('HideAndSeek');
  checkBox.type = "checkBox";
  // checkBox.checked = checked;
  label.innerText = "Completed";
  span.appendChild(label);
  label.appendChild(checkBox);
  return span;
}

/**
 * Add the compelted file to the collection of comleted files stored
 * store in the format of
 * {
 * "#9(PR#)": {
 *   "files": {
 *     "README.md" : sha...(commit)
 *     }
 *   }
 * }
*/
function completeFile(fileName, sha) {
  var map = loadData();
  map[getPullRequestId()]['files'][fileName] = sha;
  localStorage.setItem(localStorageKey, JSON.stringify(map));
}


/**
 * Remove the compelted file to the collection of comleted files stored
 * store in the format of
 * {
 * "#9(PR#)": {
 *   "files": {
 *     "README.md" : sha...(commit)
 *     }
 *   }
 * }
*/
function unCompleteFile(fileName) {
  var map = loadData();
  map[getPullRequestId()]['files'][fileName] = undefined;
  localStorage.setItem(localStorageKey, JSON.stringify(map));
}


//---------------------------------- Hide Files

/**
 * Hide the files.
 * fileHeaderList: The list of Html elements representing the files headers
 * Implentation: Click on the collasp button for each Html file header element passed in.
 */
function hideCompletedFiles(fileMap) {
  var fileHeaderList = filterCompletedFiles(fileMap);

  for (var fileHeader in fileHeaderList) {
    fileHeaderList[fileHeader].querySelector('.file-actions').querySelector('.btn-octicon.p-1.pr-2.js-details-target').click();
  }
}

// filter the files that have been stored
/**
 * Filter the list of Html file headers elements
 * fileMap: The map of files names and commits
 * example
 * {
 *    "README.md" : sha...(commit),
 *    ...
 * }
 */
// TODO: check to see if this file has been updated
function filterCompletedFiles(fileMap) {
  var fileHeaderList = document.querySelectorAll('.file-header.js-file-header');
  var filteredFileHeaderList = [];

  fileHeaderList.forEach(function(fileHeader) {
    var filePath = fileHeader.attributes["data-path"];
    if (fileMap[filePath.value] != undefined) {
      filteredFileHeaderList.push(fileHeader);

    }
  });
  return filteredFileHeaderList;
}


//----------------------- Start up

initialize();

// The function called on set up the plugin
function initialize() {
  var files = loadData()[getPullRequestId()]["files"];
  addCompleteAction(files);
  hideCompletedFiles(files);
}
