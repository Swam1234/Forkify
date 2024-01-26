import previewView from "./previewView.js";
import View from "./view.js";


class ResultView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = "No recipe is found for your search! Try another one."
  _message;

  _generateMarkup() {
    return previewView.render(this._data, true);
  }
}

export default new ResultView();