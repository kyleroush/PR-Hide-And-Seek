function whenReviewLoads(data) {
  var allMeta = new Map();
  JSON.parse(data).forEach(function(review) {
    var regex = /<!-- seeker = (.*) -->/;
    if (review.body.match(regex) != null) {
      var newMeta = getMetaData("key", review.body);

      allMeta.set(newMeta.author, newMeta.files);
      allMeta[newMeta.author] = newMeta.files;
    }
  });

  var reportEveryOne = document.querySelector('.HideAndSeekSpan.report-everyone');
  if (reportEveryOne != null) {
    reportEveryOne.dataset.reviews = JSON.stringify(allMeta);
  }
  renderGraphs();
}

function whenFilesLoad(files) {
  var allFiles = new Map();
  JSON.parse(files).forEach(function(file) {
    var shaArray = file.raw_url.split('/')
    var sha = shaArray[shaArray.length-2]
    allFiles.set(file.filename, sha)
    allFiles[file.filename] = sha

  });

  var reportEveryOne = document.querySelector('.HideAndSeekSpan.report-everyone');
  if (reportEveryOne != null) {
    reportEveryOne.dataset.files = JSON.stringify(allFiles)
  }
  renderGraphs()
}

function renderGraphs() {
  var reportEveryOne = document.querySelector('.HideAndSeekSpan.report-everyone');

  if (reportEveryOne != null && reportEveryOne.dataset.files != null && reportEveryOne.dataset.reviews != null) {
    var files = JSON.parse(reportEveryOne.dataset.files);
    var reviews = JSON.parse(reportEveryOne.dataset.reviews);
    var everyonesReportDiv = document.createElement('div');

    var totalCount = document.querySelector('#files_tab_counter').innerText;
    Object.keys(reviews).forEach(function(name) {
      var reviewerFiles = reviews[name];

      var oneReportDiv = document.createElement('div');
      var personNamediv = document.createElement('div');
      personNamediv.innerText = name
      oneReportDiv.appendChild(personNamediv)
      var personReportdiv = document.createElement('div');
      var completedCount = Object.keys(reviewerFiles).length;
      var outdatedCount = 0;

      var entireBar = document.createElement('div');
      entireBar.style.width = "100%"
      entireBar.style.backgroundColor = "#ddd"
      entireBar.style.height = "15px"
      var completeBar = document.createElement('span');
      completeBar.style.height = "15px"
      completeBar.style.backgroundColor = "#4CAF50"
      var outdatedBar = document.createElement('span');
      outdatedBar.style.height = "15px"
      outdatedBar.style.backgroundColor = "#FF4500"
      oneReportDiv.appendChild(personReportdiv)
      entireBar.appendChild(completeBar);
      entireBar.appendChild(outdatedBar);

      completeBar.classList.add("tooltipped")
      completeBar.classList.add("tooltipped-nw")

      outdatedBar.classList.add("tooltipped")
      outdatedBar.classList.add("tooltipped-nw")

      Object.keys(reviewerFiles).forEach(function(file) {
        var sha = files[file];
        var reviewSha = reviewerFiles[file];
        if (sha != reviewSha) {
          completedCount--;
          outdatedCount++;
        }
      });

      var completeWidth = Math.floor(completedCount / totalCount * 100);
      var outdatedWidth = Math.floor(outdatedCount / totalCount * 100);
      completeBar.style.display = "inline-block";
      outdatedBar.style.display = "inline-block";

      completeBar.style.width = completeWidth + "%";
      outdatedBar.style.width = outdatedWidth + "%";
      completeBar.setAttribute("aria-label", name + " completed " + completeWidth + "%");
      outdatedBar.setAttribute("aria-label", name + " has completed " + outdatedWidth + "% but file has been updated");

      personReportdiv.appendChild(entireBar);
      everyonesReportDiv.appendChild(oneReportDiv)
    });
    reportEveryOne.appendChild(everyonesReportDiv);

  }
}

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
          document.querySelector('#pull_request_review_body').value = document.querySelector('#pull_request_review_body').value + "\n\n\n\n\n\n\n" + rawMeta;
        }
      }
    }
  }
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
    if (document.querySelector('.js-comment-edit-button') != null) {

      document.querySelectorAll('.comment-form-textarea').forEach(function(comment) {
        var regex = /<!-- seeker = (.*) -->/;
        if (comment.value.match(regex) != null) {
          var newMeta = getMetaData("key", comment.value)

          allMeta.set(newMeta.author, newMeta.files)
          allMeta[newMeta.author] = newMeta.files
        }
      });

      var reportEveryOne = document.querySelector('.HideAndSeekSpan.report-everyone');
      if (reportEveryOne != null) {
        reportdiv.dataset.reviews = JSON.stringify(allMeta)
      }

      getPrsFiles(getPRhost(), getPRorg(), getPRrepo(), getPRnumber(), whenFilesLoad)

    } else {
      getPrsFiles(getPRhost(), getPRorg(), getPRrepo(), getPRnumber(), whenFilesLoad)
      getPrsConvo(getPRhost(), getPRorg(), getPRrepo(), getPRnumber(), whenReviewLoads)
    }
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
    entireBar.classList.add("tooltipped");
    entireBar.classList.add("tooltipped-nw");

    var completeBar = document.createElement('span');
    completeBar.style.height = "15px";
    completeBar.style.backgroundColor = "#4CAF50";
    completeBar.style.display = "inline-block";

    // var headerSpan = document.createElement('span');
    // headerSpan.className = 'discussion-sidebar-heading text-bold';
    reportSpan.appendChild(entireBar);
    // reportSpan.appendChild(headerSpan);
    entireBar.appendChild(completeBar);
    tabnav.prepend(reportSpan);

    var files = loadData()[getPullRequestId()]["files"];
    // var fileHeaders = document.querySelectorAll('.file-header');
    var completedCount = Object.keys(files).length;
    var totalCount = document.querySelector('#files_tab_counter').innerText;
    var width = completedCount/totalCount;
    completeBar.style.width = width * 100 + "%";
    completeBar.classList.add("tooltipped");
    completeBar.classList.add("tooltipped-nw");
    completeBar.setAttribute("aria-label", "You have completed " + Math.floor(width * 100) + "% locally");
  }
}

function hasBeenUpdate(fileMap, fileHeader) {
  var sha = getSha(fileHeader);
  var filePath = fileHeader.attributes["data-path"];
  return fileMap[filePath.value] == sha;
}


//------------------Utils



//return the number for the pull request


//---------------------Complete button

//add the check boxes to each files files-acations class to make the file is completed or not
/**
 * Add an an action to complete a file on each file.
 */
function addCompleteAction(files, headers) {
  headers.forEach(function(header) {
    addComppleteActionToHeader(header, files);
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
  var checked = files[filePath] != undefined && hasBeenUpdate(files, header);
  action.appendChild(createCheckBox(filePath, sha, checked, files[filePath] != undefined && !hasBeenUpdate(files, header)));
}


/**
 * Create an instance of the checkbox to complete a file.
 */
function createCheckBox(filePath, sha, checked, updated) {
  var span = document.createElement('span');
  span.classList.add('HideAndSeekSpan');
  var label = document.createElement('label');
  var checkBox = document.createElement('input');
  checkBox.addEventListener( 'click', function() {
    collapse(this.parentElement.parentElement.parentElement, this.checked);
    this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.footer').querySelector('.complete-checkbox').checked = this.checked

      if(this.checked) {
        completeFile(checkBox.dataset.filePath, checkBox.dataset.sha);
      } else {
        unCompleteFile(checkBox.dataset.filePath);
      }
  });
  checkBox.dataset.filePath = filePath;
  checkBox.dataset.sha = sha;
  checkBox.type = "checkBox";
  checkBox.checked = checked;
  checkBox.classList.add('complete-checkbox');
  label.innerText = "Completed";
  if (updated) {
    var emoji = document.createElement('span');
    emoji.classList.add("tooltipped");
    emoji.classList.add("tooltipped-nw");
    emoji.setAttribute("alias", "thinking");
    emoji.setAttribute("aria-label", "The has been updated since you last viewed it");
    emoji.innerHTML = "&#x1f914;";
    label.appendChild(emoji);
  }
  span.appendChild(label);
  label.appendChild(checkBox);
  return span;
}

function collapse(header, toHide) {
  var button = header.querySelector('.btn-octicon.p-1.pr-2.js-details-target');
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

function importFooters(fileHeaders) {
  fileHeaders.forEach(function(fileHeader) {
    addFooter(fileHeader)
  });
}

function onHide() {
  var fileHeader = this.parentElement.parentElement
  var bool = fileHeader.querySelector('.btn-octicon.p-1.pr-2.js-details-target').attributes['aria-expanded'].value === 'true';

  fileHeader.parentElement.querySelectorAll('.btn-octicon.p-1.pr-2.js-details-target').forEach(function (b) {

    b.attributes['aria-expanded'].value  = bool;

  })
};

function addFooter(fileHeader) {
  if (!fileHeader.parentElement.querySelector('.footer')) {
    var fileFooter = fileHeader.cloneNode(true);
    fileFooter.querySelector('.btn-octicon.p-1.pr-2.js-details-target').querySelector('.Details-content--shown').classList.remove('Details-content--shown')

    fileHeader.parentElement.appendChild(fileFooter);

    fileFooter.querySelector('.HideAndSeekSpan').querySelector('input').onclick = function () {
      //call the rootcheckbox
      this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.complete-checkbox').click()
    }
    //loop over all the buttons
    fileHeader.parentElement.querySelectorAll('.btn-octicon.p-1.pr-2.js-details-target').forEach(function (octicon) {
      octicon.onclick = onHide;
    })

    fileFooter.classList.add('Details--on');
    fileFooter.classList.add('Details-content--shown');
    fileFooter.classList.add('footer');
    fileFooter.classList.add('HideAndSeek');
  }
}


//----------------------- Start up
// The function called on set up the plugin
function initialize() {
  // publishReview();
  // reportingBar();
  addExpandAllComments()
  // reportEveryone()
  makeAllCommentsHideable()
  addStatusSelect();
  if (document.querySelector('#files') != null) {
    var filesCompleted = loadData()[getPullRequestId()]["files"];
    var fileHeaders = document.querySelectorAll('.file-header:not(.footer)')
    addCompleteAction(filesCompleted, fileHeaders);
    importFooters(fileHeaders)

    hideCompletedFiles(filesCompleted, fileHeaders);
  }
}
