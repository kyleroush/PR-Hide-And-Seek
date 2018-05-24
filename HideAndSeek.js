
/* display previously-saved stored notes on startup
should return a map in the structure
{
"#9(PR#)": {
  "files": {
    "README.md" : sha...(commit)
  }
}
*/
function loadAllData() {

}

//add the check boxes to each files files-acations class to make the file is completed or not
function addCompleteAction() {

  var headers = document.querySelectorAll('.file-header.js-file-header')
  headers.forEach(function(headers) {
    var action = headers.querySelector('.file-actions')
    action.appendChild(createCheckBox())
  });
}

//Create a checkBox
function createCheckBox() {
  var span = document.createElement('span')
  var label = document.createElement('label')
  var checkBox = document.createElement('input')
  checkBox.querySelector('HideAndSeek')
  checkBox.type = "checkBox"
  label.innerText = "Completed"
  span.appendChild(label)
  label.appendChild(checkBox)
  return span;
}

//This needs to save the data to the local storage
//should write in this structure
/*
{
"#9(PR#)": {
  "files": {
    "README.md" : sha...(commit)
  }
}
*/
function completeFile(fileName, sha) {

}

//remove a file from the local storage
function unCompleteFile(fileName) {

}

/**
 * Hide the files.
 * fileHeaderList: The list of Html elements representing the files headers
 * Implentation: Click on the collasp button for each Html file header element passed in.
 */
function hideCompletedFiles(fileMap) {
  var fileHeaderList = filterCompletedFiles(fileMap)
  // document.body.style.border = "5px solid yellow";

  for (var fileHeader in fileHeaderList) {
    fileHeaderList[fileHeader].querySelector('.file-actions').querySelector('.btn-octicon.p-1.pr-2.js-details-target').click()
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
  var fileHeaderList = document.querySelectorAll('.file-header.js-file-header')
  var filteredFileHeaderList = []

  fileHeaderList.forEach(function(fileHeader) {
    var filePath = fileHeader.attributes["data-path"]
    if (fileMap[filePath.value] != undefined) {
      filteredFileHeaderList.push(fileHeader)
      // document.body.style.border = "5px solid orange";

    }
  });
  return filteredFileHeaderList;
}

/* Clear all completed files for all pull request from the display/storage */
function clearAll() {

}

/* Clear all completed files for this pull request from the display/storage */
function clearPr() {

}

//return the number for the pull request
function getPullRequestNumber() {
  $(".gh-header-number").innerText
}

initialize();

// The function called on set up the plugin
function initialize() {

  addCompleteAction()

  var tempMap = {"README.md":"sha"}
  hideCompletedFiles(tempMap)
  // load the load all the data
  // hide the files
  // add the button to all the files
}
