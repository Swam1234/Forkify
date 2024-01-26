import icons from '../../img/icons.svg';
import View from "./view.js";

class PaginationView extends View {
 _parentEl = document.querySelector('.pagination');

 addHandlerRender(handler) {
  this._parentEl.addEventListener('click', function (event) {
   const page = +event.target.closest('.btn--inline')?.dataset.goToPage;
   if (!page) return;
   handler(page);
  })
 }

 _generateMarkup() {
  const { curPage, totalPage } = this._data;
  // Only One Page
  if (totalPage === 1) return "";

  if (totalPage > 1 && curPage === 1) {
   return `
   <button data-go-to-page = "${curPage + 1}" class="btn--inline pagination__btn--next">
    <span>Page ${curPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
   </button>
   `
  }

  if (totalPage > curPage && curPage > 1) {
   return `
   <button data-go-to-page = "${curPage - 1}" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${curPage - 1}</span>
   </button>

   <button data-go-to-page = "${curPage + 1}" class="btn--inline pagination__btn--next">
     <span>Page ${curPage + 1}</span>
     <svg class="search__icon">
       <use href="${icons}#icon-arrow-right"></use>
     </svg>
   </button>
   `;
  }

  if (totalPage === curPage) {
   return `
   <button data-go-to-page = "${curPage - 1}" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${curPage - 1}</span>
   </button>
   `;
  }

  return '';

 }
}

export default new PaginationView();