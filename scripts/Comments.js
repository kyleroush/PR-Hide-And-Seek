/**
 *
 */
function addExpandAllComments() {
  var sideBar = document.querySelector('#partial-discussion-sidebar');
  if(sideBar != null && sideBar.querySelector('.HideAndSeekSpan.Comment-Expander') == null) {
    var commentButtonDiv = document.createElement('div');
    var expandAllButton = document.createElement('button');
    commentButtonDiv.className = 'discussion-sidebar-item HideAndSeekSpan Comment-Expander';

    expandAllButton.innerText = "Expand All";
    expandAllButton.className = "btn btn-sm"
    expandAllButton.onclick = function() {
      document.querySelectorAll('.js-comment-container.outdated-comment:not(.open)').forEach(function(comementDiv) {
        comementDiv.querySelector('.show-outdated-button').click();
      });
    };
    var hideAllButton = document.createElement('button');
    hideAllButton.innerText = "Hide All";
    hideAllButton.className = "btn btn-sm"
    hideAllButton.onclick = function() {
      document.querySelectorAll('.js-comment-container.outdated-comment.open').forEach(function(comementDiv) {
        comementDiv.querySelector('.show-outdated-button').click();

      });
    };
    commentButtonDiv.appendChild(expandAllButton);
    commentButtonDiv.appendChild(hideAllButton);
    sideBar.appendChild(commentButtonDiv);
  }
}


function makeAllCommentsHideable() {
  var isUpgradedToSummary = true


  var allComments = document.querySelectorAll('.file.js-comment-container.has-inline-notes:not(.outdated-comment)');
  allComments.forEach(function(oldComementDiv) {
    var comementDiv = document.createElement('details')
    for(var i=0; i<oldComementDiv.attributes.length; i++) {
      var myAttr = oldComementDiv.attributes[i].nodeName;
      var myAttrVal = oldComementDiv.attributes[i].nodeValue;
      comementDiv.setAttribute(myAttr, myAttrVal);
    }

    comementDiv.innerHTML = oldComementDiv.innerHTML
    oldComementDiv.replaceWith(comementDiv);
    comementDiv.open = true;
    comementDiv.classList.add("outdated-comment");
    comementDiv.classList.add("open");
    comementDiv.classList.add("Details--on");
    comementDiv.classList.add("Details");
    comementDiv.classList.add("js-transitionable");
    comementDiv.classList.add("js-details-container");
    comementDiv.classList.add("details-reset");
    comementDiv.classList.add("js-load-contents");

    var oldHeader = comementDiv.querySelector('.file-header')
    var header = document.createElement('summary')
    for(var i=0; i<oldHeader.attributes.length; i++) {
      var myAttr = oldHeader.attributes[i].nodeName;
      var myAttrVal = oldHeader.attributes[i].nodeValue;
      header.setAttribute(myAttr, myAttrVal);
    }
    header.innerHTML = oldHeader.innerHTML
    oldHeader.replaceWith(header);

    header.innerHTML = getHideButtons() + header.innerHTML
  });
}

function getHideButtons() {
  var show = '<span class="btn-link text-gray float-right f6 outdated-comment-label show-outdated-button"><svg class="octicon octicon-unfold position-relative mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.5 7.5L14 10c0 .55-.45 1-1 1H9v-1h3.5l-2-2h-7l-2 2H5v1H1c-.55 0-1-.45-1-1l2.5-2.5L0 5c0-.55.45-1 1-1h4v1H1.5l2 2h7l2-2H9V4h4c.55 0 1 .45 1 1l-2.5 2.5zM6 6h2V3h2L7 0 4 3h2v3zm2 3H6v3H4l3 3 3-3H8V9z"></path></svg>Show</span>';
  var hide = '<span class="btn-link text-gray float-right f6 outdated-comment-label hide-outdated-button"><svg class="octicon octicon-fold position-relative mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 9l3 3H8v3H6v-3H4l3-3zm3-6H8V0H6v3H4l3 3 3-3zm4 2c0-.55-.45-1-1-1h-2.5l-1 1h3l-2 2h-7l-2-2h3l-1-1H1c-.55 0-1 .45-1 1l2.5 2.5L0 10c0 .55.45 1 1 1h2.5l1-1h-3l2-2h7l2 2h-3l1 1H13c.55 0 1-.45 1-1l-2.5-2.5L14 5z"></path></svg>Hide</span>';
  return show + hide ;
}

function getStatuses() {
  return ["give status", "todo", "resolved", "question"];
}

function addStatusSelect() {
  var statuses = readCommentStatus()

  document.querySelectorAll('.file.js-comment-container.has-inline-notes').forEach(function(file) {
    var select = document.createElement('select');
    select.classList.add('hide-and-seek');
    select.classList.add('comment-status-select');
    getStatuses().forEach(function (status) {
      var option = document.createElement('option');
      option.value = status
      option.innerText = status
      select.appendChild(option)
    });

    var status = ""
    var commentWithStatus = ""
    var lastComment = ""
    file.querySelectorAll('.review-comment').forEach(function(comment) {
      if(statuses[comment.id]) {
        commentWithStatus = comment.id
        status = statuses[commentWithStatus]
      }
      lastComment = comment.id

    });
    if (status) {
      selectItemByValue(select, status)
      if (status == "todo") {
        toExpandFileComment(file, true)
      } else if (status == "resolved") {
        if (lastComment == commentWithStatus) {

          toExpandFileComment(file, false)
        } else {
          
          toExpandFileComment(file, true)

          var option = document.createElement('option');
          option.value = "unresolved"
          option.innerText = "unresolved"
          select.appendChild(option)
          selectItemByValue(select, "unresolved")
        }
      }
    }
    if (file.querySelector('.file-header').querySelector('.comment-status-select') == null) {
      file.querySelector('.file-header').appendChild(select)
    }
  });
  document.querySelectorAll('.comment-status-select').forEach(function (select) {
    select.onchange = onStatusChange;
  });
}

function toExpandFileComment(file, toExpand) {
  file.open = toExpand;
}

function selectItemByValue(elmnt, value){

  for(var i=0; i < elmnt.options.length; i++)
  {
    if(elmnt.options[i].value === value) {
      elmnt.selectedIndex = i;
      break;
    }
  }
}

function onStatusChange() {
  var status = this.options[this.selectedIndex].value;
  var id = "";
  this.parentElement.parentElement.querySelectorAll('.review-comment').forEach(function(comment) {
    id = comment.id;
  });
  var statuses = readCommentStatus();
  statuses[id] = status;
  writeCommentStatus(statuses);
}
