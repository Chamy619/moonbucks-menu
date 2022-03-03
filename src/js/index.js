import { $ } from './utils/dom.js';
import MenuApi from './api/index.js';

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = 'espresso';

  this.init = async () => {
    render();
    initEventListeners();
  };

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    const menuItemTemplate = (menuItem) => `<li data-menu-id="${
      menuItem.id
    }" class="menu-list-item d-flex items-center py-2">
        <span class="${menuItem.isSoldOut ? 'sold-out' : ''} w-100 pl-2 menu-name">${menuItem.name}</span>
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

    const menuList = this.menu[this.currentCategory].map((item) => menuItemTemplate(item));
    $('#menu-list').innerHTML = menuList.join('');

    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };

  const addMenuName = async () => {
    const menuName = $('#menu-name').value;

    if (!menuName) {
      alert('값을 입력해주세요.');
      return;
    }

    const duplicatedItem = this.menu[this.currentCategory].find((menuItem) => menuItem.name === menuName);
    if (duplicatedItem) {
      alert('이미 등록된 메뉴입니다. 다시 입력해주세요.');
      $('#menu-name').value = '';
      return;
    }

    await MenuApi.createMenu(this.currentCategory, menuName);
    render();
    $('#menu-name').value = '';
  };

  const updateMenuName = async (event) => {
    const menuId = event.target.closest('.menu-list-item').dataset.menuId;
    const $menuName = event.target.closest('.menu-list-item').querySelector('.menu-name');
    const updatedMenuName = prompt('메뉴명을 수정하세요.', $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, menuId, updatedMenuName);
    render();
  };

  const removeMenuName = async (event) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const menuId = event.target.closest('.menu-list-item').dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  };

  const soldOutMenu = async (event) => {
    const menuId = event.target.closest('.menu-list-item').dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  };

  const selectCategory = (event) => {
    const $cafeCategoryName = event.target.closest('.cafe-category-name');
    if ($cafeCategoryName) {
      const categoryName = $cafeCategoryName.dataset.categoryName;
      this.currentCategory = categoryName;
      $('#category-title').innerText = `${$cafeCategoryName.innerText} 메뉴 관리`;
      render();
    }
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

    $('nav').addEventListener('click', selectCategory);
  };
}

const app = new App();
app.init();
