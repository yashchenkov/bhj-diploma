/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(element === undefined) {
      throw new Error('Не передана страница счета')
    }
    this.element = element;
    this.registerEvents();

  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const btnAcc = document.querySelectorAll('.remove-account');
    const btnTrans = document.querySelectorAll('.trasaction__remove');


    document.addEventListener('click', e => {
      console.log(e.target.closest('.transaction__remove'));
      if(e.target.closest('.remove-account')) {
        this.removeAccount();
      } else if(e.target.closest('.transaction__remove')) {
        this.removeTransaction(e.target.closest('.transaction__remove').dataset.id)
      }
    });
    /*btnTrans.forEach(elem => {
      elem.addEventListener('click', this.removeTransaction(elem.dataset.id))
    });
    btnAcc.forEach(elem => {
      elem.addEventListener('click', this.removeAccount());
    });*/
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if(this.lastOptions) {
      const result = window.confirm('Вы действительно хотите удалить счет?');
      if(result) {
        Account.remove({id: this.lastOptions.account_id}, (err, response) => {
          if(response.success) {
            App.update();
          }
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    const result = window.confirm('Вы действительно хотите удалить эту транзакцию?');
    if(result) {
      Transaction.remove({id: id}, (err, response) => {
        if(response.success) {
          App.update();
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(options) {
      this.lastOptions = options;
      Account.get(options.account_id, (err, response) => {
        if(response.success) {
          this.renderTitle(response.data.name);
        }
      });
      //вот тут непонятно, как нужный объект передать, так как нигде не хранится пароль
      Transaction.list(options, (err, response) => {
        if(response) {
          this.renderTransactions(response.data);
        }
      })
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счета')
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const title = this.element.querySelector('.content-title');
    title.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const data = new Date(Date.parse(date));
    const months = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря'
    ]


    const year = data.getFullYear();
    const month = months[data.getMonth()];
    const dayOfMonth = data.getDate();
    const hours = data.getHours();
    const minutes = data.getMinutes();

    return dayOfMonth + ' ' 
            + month + ' '
            + year + ' '
            + 'г. ' + 
            'в ' + hours
            + ':' + minutes;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    let trClass = item.type.toLowerCase() === 'expense' ? 'transaction_expense' : 'transaction_income';

    const data = `<div class="transaction ${trClass} row">
          <div class="col-md-7 transaction__details">
            <div class="transaction__icon">
                <span class="fa fa-money fa-2x"></span>
            </div>
            <div class="transaction__info">
                <h4 class="transaction__title">${item.name}</h4>
                <!-- дата -->
                <div class="transaction__date">${this.formatDate(item.created_at)}</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="transaction__summ">
            <!--  сумма -->
                ${item.sum} <span class="currency">₽</span>
            </div>
          </div>
          <div class="col-md-2 transaction__controls">
              <!-- в data-id нужно поместить id -->
              <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                  <i class="fa fa-trash"></i>  
              </button>
          </div>
       </div>`;

       return data;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = this.element.querySelector('.content');
    content.innerHTML = '';

    data.forEach(elem => {
      content.insertAdjacentHTML('beforeend', this.getTransactionHTML(elem));
    })
  }
}