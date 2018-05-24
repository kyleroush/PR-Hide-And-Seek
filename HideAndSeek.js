
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

//hide the files
function hideCompletedFiles(fileHeaderList) {
  fileHeaderList.querySelector('.file-actions').querySelector('.btn-octicon.p-1.pr-2.js-details-target').click()

}

// filter the files that have been stored
// TODO: check to see if this file has been updated
function filterCompletedFiles(fileMap) {
  var fileHeaderList = $('.file-header.js-file-header')
  var filteredFileHeaderList = []
  for (var fileHeader in fileList) {
    var filePath = fileHeader.attributes["data-path"]
    if (fileMap[filePath] != undefined) {
      filteredFileHeaderList.push(fileHeader)
    }
  }
  return filteredFileHeaderList;
}

/* Clear all completed files for all pull request from the display/storage */
function clearAll() {

}

/* Clear all completed files for this pull request from the display/storage */
function clearPr() {

}

//return the number for the pull request
function getPullRequest() {
  
}

initialize();

// The function called on set up the plugin
function initialize() {
// load the load all the data
// hide the files
// add the button to all the files 

}



