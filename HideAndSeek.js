
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

function readFiles() {

}

function writeFiles() {

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
function clearPr() {
  var map = loadData();
  map[getPullRequestId()] = undefined;
  localStorage.setItem(localStorageKey, JSON.stringify(map));
  document.querySelectorAll('.HideAndSeek').forEach(function(checkBox) {
    checkBox.checked = false;
  });
}

//---------------------Complete button

//add the check boxes to each files files-acations class to make the file is completed or not
/**
 * Add an an action to complete a file on each file.
 */
function addCompleteAction(files, headers) {
  headers.forEach(function(header) {
    addComppleteActionToHeader(header, files)
  });
}

function addComppleteActionToHeader(header, files) {
  var action = header.querySelector('.file-actions');
  if (action.querySelectorAll('.HideAndSeekSpan').length != 0) {
    //This file header already has a complete button
    return ;
  }
  var filePath = header.attributes["data-path"].value
  var sha = getSha(header);
  action.appendChild(createCheckBox(filePath, sha, files[filePath] != undefined));
}


/**
 * Create an instance of the checkbox to complete a file.
 */
function createCheckBox(filePath, sha, checked) {
  var span = document.createElement('span');
  span.classList.add('HideAndSeekSpan')
  var label = document.createElement('label');
  var checkBox = document.createElement('input');
  checkBox.addEventListener( 'click', function() {
    collapse(this.parentElement.parentElement.parentElement, this.checked)
      if(this.checked) {
        completeFile(checkBox.dataset.filePath, checkBox.dataset.sha);
      } else {
        unCompleteFile(checkBox.dataset.filePath);
      }
  });
  checkBox.dataset.filePath = filePath;
  checkBox.dataset.sha = sha;
  checkBox.querySelector('HideAndSeek');
  checkBox.type = "checkBox";
  checkBox.checked = checked;
  label.innerText = "Completed";
  span.appendChild(label);
  label.appendChild(checkBox);
  return span;
}

function collapse(header, toHide) {
  button = header.querySelector('.btn-octicon.p-1.pr-2.js-details-target');
  if (toHide == (button.attributes['aria-expanded'].value === 'true')) {
    button.click();
  }
}

/**
 * Get the sha for a file
 */
// TODO: need to implement this method
function getSha(header) {
  return "1";
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
 * Implentation: Click on the collapse button for each Html file header element passed in.
 */
function hideCompletedFiles(fileMap, headers) {
  var fileHeaderList = filterCompletedFiles(fileMap, headers);

  for (var fileHeader in fileHeaderList) {
    collapse(fileHeaderList[fileHeader].querySelector('.file-actions'), true)
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
function filterCompletedFiles(fileMap, headers) {
  var filteredFileHeaderList = [];

  headers.forEach(function(fileHeader) {
    var filePath = fileHeader.attributes["data-path"];
    if (fileMap[filePath.value] != undefined) {
      filteredFileHeaderList.push(fileHeader);

    }
  });
  return filteredFileHeaderList;
}


//----------------------- Start up
// The function called on set up the plugin
function initialize() {
  var files = loadData()[getPullRequestId()]["files"];
  addCompleteAction(files);
  hideCompletedFiles(files);
  var observer = new MutationObserver(function (mutations) {

    mutations.forEach(function (mutation) {
      var fileActionDiv = mutation.target.querySelector(".file-actions");
      if (fileActionDiv != null) {
        initialize()

      }
    });
  });
  var config = {
    childList: true,
    characterData: true,
    subtree: true
  };

  // pass in the target node, as well as the observer options
  observer.observe(document.querySelector('#files'), config);

}



(function() {
  "use strict";

  // This following code is taken from
  // https://github.com/thieman/github-selfies/blob/master/chrome/selfie.js
  var allowedPaths = [
    /github.com\/[\w\-]+\/[\w\-]+\/pull\/\d+/
  ];

  // Inject the code from fn into the page, in an IIFE.
  function inject(fn) {
    var script = document.createElement('script');
    var parent = document.documentElement;
    script.textContent = '('+ fn +')();';
    parent.appendChild(script);
    parent.removeChild(script);
  }

  // Post a message whenever history.pushState is called. GitHub uses
  // pushState to implement page transitions without full page loads.
  // This needs to be injected because content scripts run in a sandbox.
  inject(function() {
    var pushState = history.pushState;
    history.pushState = function on_pushState() {
      window.postMessage('extension:pageUpdated', '*');
      return pushState.apply(this, arguments);
    };
    var replaceState = history.replaceState;
    history.replaceState = function on_replaceState() {
      window.postMessage('extension:pageUpdated', '*');
      return replaceState.apply(this, arguments);
    };
  });

  // Do something when the extension is loaded into the page,
  // and whenever we push/pop new pages.
  window.addEventListener("message", function(event) {
    if (event.data === 'extension:pageUpdated') {
      load();
    }
  });

  window.addEventListener("popstate", load);
  load();

  // End of code from https://github.com/thieman/github-selfies/blob/master/chrome/selfie.js

  function load() {
    chrome.runtime.sendMessage({action: 'load'}, function(response) {
      initialize();

      var observer = new MutationObserver(function (mutations) {

        mutations.forEach(function (mutation) {
          var fileActionDiv = mutation.target.querySelector(".file-actions");
          if (fileActionDiv != null) {
            initialize();

          }
        });
      });
      var config = {
        childList: true,
        characterData: true,
        subtree: true
      };

      // pass in the target node, as well as the observer options
      observer.observe(document.querySelector('#files'), config);
    });
  }

  function any(array, predicate) {
    for (var i = 0; i < array.length; i++) {
      if (predicate(array[i])) {
        return true;
      }
    }
    return false;
  }
})();
