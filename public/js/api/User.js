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
    localStorage.setItem('user', JSON.stringify(user));
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
    return JSON.parse(localStorage.getItem('user'));
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
   /*этот метод по заданию использует 
   this.setCurrent и был написан мной,
   тут не надо передавать пароль согласно заданию*/

  static fetch(callback) {
    createRequest({
      url: this.URL + '/current',
      method: 'GET',
      callback: (err, response) => {
        console.log(response);
        if (response.success) {
          this.setCurrent({
            id: response.user.id,
            name: response.user.name
          });
        } else {
          this.unsetCurrent();
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
   /*также этот метод был написан не мной, 
   а уже был готовый, и он передает значение 
   с паролем
   в доказательство моим словам есть строчка 78,
   где указан тип ответа, а у меня тип указан в функции
   createRequest*/
  static login(data, callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.user) {
          //response.user.password = null;
          console.log(response);
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
   * 
   этот метод был написан мной, тут по заданию также не надо передавать пароль в хранилище*/
  static register(data, callback) {
    createRequest({
      url: this.URL + '/register',
      data: data,
      method: 'POST',
      callback: (err, response) => {
        console.log(err, response);
        if (response.success) {
          let user = {
            id: response.user.id,
            name: response.user.name
          }
          this.setCurrent(user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    createRequest({
      url: this.URL + '/logout',
      method: 'POST',
      callback: (err, response) => {
        console.log(response);
        if (response.success) {
          this.unsetCurrent();
        }
        callback(err, response);
      }
    });
  }
}
