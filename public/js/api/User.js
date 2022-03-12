/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */

 

  static URL = '/user';

  static setCurrent(user) {
    localStorage.setItem('user', user);
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    return localStorage.getItem('user');
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    const obj = {
      url: this.URl + '/current',
      method: 'GET',
      callback: (err, response) => {
        if (response && response.user) {
          let user = {
            id: response.user.id,
            name: response.user.name
          }
          this.setCurrent(user);
        }
        callback(err, response);
      }
    }
    createRequest(obj);
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    const obj = {
      url: this.URl + '/register',
      data: data,
      method: 'POST',
      callback: (err, response) => {
        if (response.success) {
          let user = {
            id: response.user.id,
            name: response.user.name
          }
          this.setCurrent(user);
        }
        callback(err, response);
      }
    }
    createRequest(obj);
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    const obj = {
      url: this.URl + '/logout',
      method: 'POST',
      callback: (err, response) => {
        if (response.success) {
          let user = {
            id: response.user.id,
            name: response.user.name
          }
          this.unsetCurrent(user);
        }
        callback(err, response);
      }
    }
    createRequest(obj);
  }
}
