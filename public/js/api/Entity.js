/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */

class Entity {
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static URl = '';

  static list(data, callback){
    let obj = {
      url: this.URL,
      data: data,
      method: 'GET',
      callback: callback
    }

    createRequest(obj);
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
    let obj = {
      url: this.URL,
      data: data,
      method: 'PUT',
      callback: callback
    }
    createRequest(obj);
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback ) {
    let obj = {
      url: this.URL,
      data: data,
      method: 'DELETE',
      callback: callback
    }
    createRequest(obj);
  }
}

