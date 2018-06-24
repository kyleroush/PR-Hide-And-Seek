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
  var allComments = document.querySelectorAll('.file.js-comment-container.has-inline-notes:not(.outdated-comment)');
  allComments.forEach(function(comementDiv) {
    comementDiv.classList.add("outdated-comment");
    comementDiv.classList.add("open");
    comementDiv.classList.add("Details--on");
    comementDiv.classList.add("Details");
    comementDiv.classList.add("js-transitionable");
    comementDiv.classList.add("js-details-container");
    var header = comementDiv.querySelector('.file-header')
    header.innerHTML = getHideButtons() + header.innerHTML
  });
}

function getHideButtons() {
  var show = '<button type="button" class="btn-link text-gray float-right f6 outdated-comment-label show-outdated-button js-details-target" aria-expanded="false"><svg class="octicon octicon-unfold position-relative mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.5 7.5L14 10c0 .55-.45 1-1 1H9v-1h3.5l-2-2h-7l-2 2H5v1H1c-.55 0-1-.45-1-1l2.5-2.5L0 5c0-.55.45-1 1-1h4v1H1.5l2 2h7l2-2H9V4h4c.55 0 1 .45 1 1l-2.5 2.5zM6 6h2V3h2L7 0 4 3h2v3zm2 3H6v3H4l3 3 3-3H8V9z"></path></svg>Show</button>';
  var hide = '<button type="button" class="btn-link text-gray float-right f6 outdated-comment-label hide-outdated-button js-details-target" aria-expanded="true"><svg class="octicon octicon-fold position-relative mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 9l3 3H8v3H6v-3H4l3-3zm3-6H8V0H6v3H4l3 3 3-3zm4 2c0-.55-.45-1-1-1h-2.5l-1 1h3l-2 2h-7l-2-2h3l-1-1H1c-.55 0-1 .45-1 1l2.5 2.5L0 10c0 .55.45 1 1 1h2.5l1-1h-3l2-2h7l2 2h-3l1 1H13c.55 0 1-.45 1-1l-2.5-2.5L14 5z"></path></svg>Hide</button>';
  return show +hide ;
}
