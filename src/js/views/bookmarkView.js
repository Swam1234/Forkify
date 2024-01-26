import previewView from "./previewView";
import View from "./view";

class BookmarkView extends View {
 _parentEl = document.querySelector(".bookmarks__list");
 _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
 _message;

 addHandlerRender(handler) {
  window.addEventListener('load', handler);
 }

 _generateMarkup() {
  return previewView.render(this._data, true);
 }

}

export default new BookmarkView();