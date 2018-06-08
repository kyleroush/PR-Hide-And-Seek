function createToPublish() {
  var span = document.createElement('span');
  span.classList.add('HideAndSeekSpan')
  span.classList.add('to-publish')
  var label = document.createElement('label');
  var checkBox = document.createElement('input');
  checkBox.type = "checkBox";
  checkBox.checked = true;
  label.innerText = "Publish Review";
  span.appendChild(label);
  label.appendChild(checkBox);
  return span;
}

function publishReview() {
  var reviewMenu = document.querySelector('.pull-request-review-menu')
  if(reviewMenu != null) {
    var button = reviewMenu.querySelector('button');
    var parent = button.parentElement

    if(parent.querySelector(".HideAndSeekSpan.to-publish") == null) {
      parent.prepend(createToPublish())
      button.onclick = function() {
        var toPublish = document.querySelector(".HideAndSeekSpan.to-publish")
        if(toPublish != null && toPublish.querySelector('input').checked) {
          var author = document.querySelector('.header-nav-current-user').querySelector('strong').innerText
          var files = loadData()[getPullRequestId()]['files'];
          //check button and then check if they want to completes
          var meta = { author: author, files: files };
          var rawMeta = metaData(localStorageKey, meta)
          document.querySelector('#pull_request_review_body').value = document.querySelector('#pull_request_review_body').value + "\n" + rawMeta;
        }
      }
    }
  }
}

function metaData(key, json) {
  return "<!-- " + key + " = " + JSON.stringify(json) + " -->";
}

function getMetaData(key, meta) {
  var regex = /<!-- seeker = (.*) -->/;
  var data = meta.match(regex)[1];
  return JSON.parse(data);
}

function reportEveryone() {
  var sideBar = document.querySelector('#partial-discussion-sidebar');
  if(sideBar != null && sideBar.querySelector('.HideAndSeekSpan.report-everyone') == null) {
    //this is the entire side bar div
    var reportdiv = document.createElement('div');
    reportdiv.className = 'discussion-sidebar-item HideAndSeekSpan report-everyone';
    sideBar.appendChild(reportdiv);
    // this is the header
    var headerdiv = document.createElement('div');
    headerdiv.innerText = "Everyones Completion percentage"
    headerdiv.className = 'discussion-sidebar-heading text-bold';
    reportdiv.appendChild(headerdiv);
    var allMeta = new Map();
    document.querySelectorAll('.comment-form-textarea').forEach(function(comment) {
      var regex = /<!-- seeker = (.*) -->/;
      if (comment.value.match(regex) != null) {
        var newMeta = getMetaData("key", comment.value)

        allMeta.set(newMeta.author, newMeta.files)
        allMeta[newMeta.author] = newMeta.files
      }
    });
    var everyonesReportDiv = document.createElement('div');

    var totalCount = document.querySelector('#files_tab_counter').innerText;


    allMeta.forEach(function(files, name) {
      var oneReportDiv = document.createElement('div');
      var personNamediv = document.createElement('div');
      personNamediv.innerText = name
      oneReportDiv.appendChild(personNamediv)
      var personReportdiv = document.createElement('div');
      var completedCount = Object.keys(files).length;

      var entireBar = document.createElement('div');
      entireBar.style.width = "100%"
      entireBar.style.backgroundColor = "#ddd"
      entireBar.style.height = "15px"
      var completeBar = document.createElement('div');
      completeBar.style.height = "15px"
      completeBar.style.backgroundColor = "#4CAF50"
      oneReportDiv.appendChild(personReportdiv)
      entireBar.appendChild(completeBar);
      var width = completedCount/totalCount;

      completeBar.style.width = width*100 + "%";
      personReportdiv.appendChild(entireBar);
      everyonesReportDiv.appendChild(oneReportDiv)
    });
    reportdiv.appendChild(everyonesReportDiv);


  }
}

function reportingBar() {
  var tabnav = document.querySelector('.tabnav-extra');
  if(tabnav != null && tabnav.querySelector('.HideAndSeekSpan.your-report') == null && tabnav.querySelector('.diffstat') != null) {
    var reportSpan = document.createElement('span');
    reportSpan.className = 'HideAndSeekSpan your-report';
    // reportSpan.display = "block";

    var entireBar = document.createElement('span');
    entireBar.style.display = "inline-block";
    entireBar.style.width = "100px"
    entireBar.style.backgroundColor = "#ddd"
    entireBar.style.height = "15px"
    entireBar.classList.add("tooltipped")
    entireBar.classList.add("tooltipped-nw")

    var completeBar = document.createElement('span');
    completeBar.style.height = "15px"
    completeBar.style.backgroundColor = "#4CAF50"
    completeBar.style.display = "inline-block";

    // var headerSpan = document.createElement('span');
    // headerSpan.className = 'discussion-sidebar-heading text-bold';
    reportSpan.appendChild(entireBar);
    // reportSpan.appendChild(headerSpan);
    entireBar.appendChild(completeBar);
    tabnav.prepend(reportSpan)

    var files = loadData()[getPullRequestId()]["files"];
    // var fileHeaders = document.querySelectorAll('.file-header');
    var completedCount = Object.keys(files).length;
    var totalCount = document.querySelector('#files_tab_counter').innerText;
    var width = completedCount/totalCount;
    completeBar.style.width = width * 100 + "%";
    completeBar.classList.add("tooltipped")
    completeBar.classList.add("tooltipped-nw")
    completeBar.setAttribute("aria-label", "You have completed " + Math.floor(width * 100) + "% locally")
    // completeBar.innerText = Math.floor(width * 100) + "%";
    // completeBar.innerText = "You Completeion " + Math.floor(width * 100) + "%";
  }
}

function hasBeenUpdate(fileMap, fileHeader) {
  var sha = getSha(fileHeader)
  var filePath = fileHeader.attributes["data-path"];
  return fileMap[filePath.value] == sha;
}

function addExpandAllComments() {
  var sideBar = document.querySelector('#partial-discussion-sidebar');
  if(sideBar != null && sideBar.querySelector('.HideAndSeekSpan.Comment-Expander') == null) {
    var commentButtonDiv = document.createElement('div');
    var expandAllButton = document.createElement('button');
    commentButtonDiv.className = 'discussion-sidebar-item HideAndSeekSpan Comment-Expander';

    expandAllButton.innerText = "Expand All";
    expandAllButton.className = "btn btn-sm"
    expandAllButton.onclick = function() {
      document.querySelectorAll('.js-comment-container.outdated-comment:not(.open)').forEach(function(comementDiv){
        comementDiv.querySelector('.show-outdated-button').click();
      });
    };
    var hideAllButton = document.createElement('button');
    hideAllButton.innerText = "Hide All";
    hideAllButton.className = "btn btn-sm"
    hideAllButton.onclick = function() {
      document.querySelectorAll('.js-comment-container.outdated-comment.open').forEach(function(comementDiv){
        comementDiv.querySelector('.show-outdated-button').click();

      });
    };
    commentButtonDiv.appendChild(expandAllButton);
    commentButtonDiv.appendChild(hideAllButton);
    sideBar.appendChild(commentButtonDiv);
  }
}


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
  return window.location.hostname + window.location.pathname.replace("/files", "");
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
  var checked = files[filePath] != undefined && hasBeenUpdate(files, header)
  action.appendChild(createCheckBox(filePath, sha, checked, files[filePath] != undefined && !hasBeenUpdate(files, header)));
}


/**
 * Create an instance of the checkbox to complete a file.
 */
function createCheckBox(filePath, sha, checked, updated) {
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
  if (updated) {
    var emoji = document.createElement('span');
    emoji.classList.add("tooltipped")
    emoji.classList.add("tooltipped-nw")
    emoji.setAttribute("alias", "thinking")
    emoji.setAttribute("aria-label", "The has been updated since you last viewed it")
    emoji.innerHTML = "&#x1f914;";
    label.appendChild(emoji);
  }
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
function getSha(header) {
  var path = header.querySelector('.file-actions').querySelector('.btn.btn-sm.tooltipped.tooltipped-nw').attributes.href;
  var regex = /blob\/[\w\-]+\//;
  return path.value.match(regex)[0].split('/')[1];
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
  fileHeaderList.forEach(function(fileHeader) {
    if (hasBeenUpdate(fileMap, fileHeader)) {
      collapse(fileHeader.querySelector('.file-actions'), true)
    }
  })
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
  publishReview();
  reportingBar();
  addExpandAllComments()
  reportEveryone()
  if (document.querySelector('#files') != null) {
    var filesCompleted = loadData()[getPullRequestId()]["files"];
    var fileHeaders = document.querySelectorAll('.file-header')
    addCompleteAction(filesCompleted, fileHeaders);
    hideCompletedFiles(filesCompleted, fileHeaders);
  }
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
      var files = document.querySelector('#files');
      if (files != null) {
        observer.observe(files, config);
      }
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
