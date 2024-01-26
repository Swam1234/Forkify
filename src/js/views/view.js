import icons from '../../img/icons.svg';

class View {
  _data;

  render(data, returnMarkUpOnly = false) {
    this._data = data;
    if (returnMarkUpOnly) return this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', this._generateMarkup());
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const virtualDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(virtualDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentEl.querySelectorAll("*"));
    // console.log(curElements, newElements);
    newElements.forEach((newEle, i) => {
      if (!newEle.isEqualNode(curElements[i]) && newEle.firstChild.nodeValue.trim() !== "") {
        curElements[i].textContent = newEle.textContent;
      }
      if (!newEle.isEqualNode(curElements[i])) {
        const attributes = Array.from(newEle.attributes);
        attributes.forEach(attr => {
          curElements[i].setAttribute(`${attr.name}`, `${attr.value}`);
        })
      }
    })
  }

  renderSpinner() {
    const markup = `<div class="spinner">
 <svg>
   <use href="${icons}#icon-loader"></use>
 </svg>
</div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
   <div class="error">
     <div>
       <svg>
         <use href="${icons}#icon-alert-triangle"></use>
       </svg>
     </div>
     <p>${message}</p>
   </div>
   `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
   <div class="message">
     <div>
       <svg>
         <use href="${icons}#icon-smile"></use>
       </svg>
     </div>
     <p>${message}</p>
   </div>
   `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

}

export default View;