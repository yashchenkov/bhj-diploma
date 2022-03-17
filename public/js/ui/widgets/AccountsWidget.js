/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if(element === undefined) {
      throw new Error('Не передан виджет');
    }
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const crAcc = document.querySelector('.create-account');
    const sm = document.querySelector('.accounts-panel');
    const accs = Array.from(sm.querySelectorAll('.account'));

    console.log(accs);
    crAcc.addEventListener('click', () => {
      App.getModal('createAccount').open();
    });
    console.log(sm.children)

    accs.forEach(elem => {
      console.log(elem.classList.contains('account'))
      if(elem.classList.contains('account')) {
        elem.addEventListener('click', e => {
          console.log('регистер')
          AccountsWidget.onSelectAccount(elem);
        })
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const accs = document.querySelector('.sidebar-menu').querySelectorAll('.account');

    if(User.current()) {
      Account.list({
        email: User.current().email,
        password: User.current().password
      }, (err, response) => {
        this.clear();
        response.data.forEach(elem => {
          this.renderItem(this.getAccountHTML(elem));
        })
      })
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accs = document.querySelector('.sidebar-menu').querySelectorAll('.account');

    accs.forEach(elem => {
      elem.style.display = '';
    })
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    console.log(element);
    const accs = document.querySelector('.sidebar-menu').querySelectorAll('.account');

    accs.forEach(elem => {
      elem.classList.remove('active');
    })
    element.classList.add('active');

    App.showPage('transaction', {account_id: element.dataset.id})
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const str = 
    `<li class="account" data-id=${item.user_id}>
        <a href="#">
          <span>${item.name}</span>
          <span>${item.sum}</span>
        </a>
      </li>`;
      return str;

  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    this.element.insertAdjacentHTML('beforeend', data);
  }
}
