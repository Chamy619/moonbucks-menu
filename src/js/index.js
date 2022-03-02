import { $ } from './utils/dom.js';
import store from './store/index.js';

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = 'espresso';

  this.init = () => {
    if (store.getLocalStorage('menu')) {
      this.menu = store.getLocalStorage('menu');
      render();
    }

    initEventListeners();
  };

  const render = () => {
    const menuItemTemplate = (
      menuItem,
      id,
    ) => `<li data-menu-id="${id}" class="menu-list-item d-flex items-center py-2">
        <span class="${menuItem.soldOut ? 'sold-out' : ''} w-100 pl-2 menu-name">${menuItem.name}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
          품절
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>`;

    const menuList = this.menu[this.currentCategory].map((item, index) => menuItemTemplate(item, index));
    $('#menu-list').innerHTML = menuList.join('');

    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    const MenuName = $('#menu-name').value;

    if (!MenuName) {
      alert('값을 입력해주세요.');
      return;
    }

    this.menu[this.currentCategory].push({ name: MenuName });
    store.setLocalStorage('menu', this.menu);

    render();
    $('#menu-name').value = '';
  };

  const updateMenuName = (event) => {
    const menuId = event.target.closest('.menu-list-item').dataset.menuId;
    const $menuName = event.target.closest('.menu-list-item').querySelector('.menu-name');
    const updatedMenuName = prompt('메뉴명을 수정하세요.', $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage('menu', this.menu);
    render();
  };

  const removeMenuName = (event) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const menuId = event.target.closest('.menu-list-item').dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage('menu', this.menu);
      render();
    }
  };

  const soldOutMenu = (event) => {
    const menuId = event.target.closest('.menu-list-item').dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage('menu', this.menu);
    render();
  };

  const initEventListeners = () => {
    $('#menu-form').addEventListener('submit', (event) => {
      event.preventDefault();
    });

    $('#menu-name').addEventListener('keypress', (event) => {
      if (event.key !== 'Enter') {
        return;
      }
      addMenuName();
    });

    $('#menu-submit-button').addEventListener('click', addMenuName);

    $('#menu-list').addEventListener('click', (event) => {
      if (event.target.classList.contains('menu-edit-button')) {
        updateMenuName(event);
        return;
      }

      if (event.target.classList.contains('menu-remove-button')) {
        removeMenuName(event);
        return;
      }

      if (event.target.classList.contains('menu-sold-out-button')) {
        soldOutMenu(event);
        return;
      }
    });

    $('nav').addEventListener('click', (event) => {
      const $cafeCategoryName = event.target.closest('.cafe-category-name');
      if ($cafeCategoryName) {
        const categoryName = $cafeCategoryName.dataset.categoryName;
        this.currentCategory = categoryName;
        $('#category-title').innerText = `${$cafeCategoryName.innerText} 메뉴 관리`;

        render();
      }
    });
  };
}

const app = new App();
app.init();
