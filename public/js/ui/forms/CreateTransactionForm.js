/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {

    const list = this.element.querySelector('.accounts-select');

    if(User.current()) {
      Account.list({
        email: User.current().email,
        password: User.current().password
      }, (err, response) => {
        if(response.success) {
          response.data.forEach(elem => {
            list.insertAdjacentHTML('beforeend', `
              <option value="${elem.id}">${elem.name}</option>`)
          })
        }
      })
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    console.log(data);
    Transaction.create(data, () => {
      if(this.element.id === 'new-income-form') {
        App.getModal('newIncome').close();
      } else if(this.element.id === 'new-expense-form') {
        App.getModal('newExpense').close();
      }
      this.element.reset();
      App.update();
    })
  }
}