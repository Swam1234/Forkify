import View from "./view.js";

class PreviewView extends View {
 _generateMarkup() {
  return this._data.map(this._generateResultPreview).join('');
 }

 _generateResultPreview(result) {
  return `
 <li class="preview">
 <a class="preview__link ${location.hash.slice(1) === result.id ? 'preview__link--active' : ''}" href="#${result.id}">
   <figure class="preview__fig">
     <img src="${result.image}" alt="${result.title}" />
   </figure>
   <div class="preview__data">
     <h4 class="preview__title">${result.title}</h4>
     <p class="preview__publisher">${result.publisher}</p>
   </div>
 </a>
</li>
  `
 }
}

export default new PreviewView();