
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
  var actions = $('.file-header.js-file-header').querySelector('.file-actions')
  for (var action in actions) {
    action.appendChild(createButton())
  }
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
function hideCompletedFiles(fileList) {

}

// check the files for if there is an update
function filterCompletedFiles(fileMap) {

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
// load the load all the data
// hide the files
// add the button to all the files 

}
