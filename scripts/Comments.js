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
