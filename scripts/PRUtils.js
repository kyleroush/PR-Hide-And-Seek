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

function getPRnumber() {
  return location.pathname.split('/')[4];
}
function getPRorg() {
  return location.pathname.split('/')[1];
}
function getPRrepo() {
  return location.pathname.split('/')[2];
}
function getPRhost() {
  return location.host;
}
