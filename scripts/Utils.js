
function toolTip(element, tip) {

  element.classList.add("tooltipped");
  element.classList.add("tooltipped-nw");
  element.setAttribute("aria-label", tip);
}
