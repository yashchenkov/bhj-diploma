/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    let str = '?';
    try {
        if('data' in options) {
            if(options.method === 'GET') {
                for(key in options.data) {
                    str += key + '=' + options.data[key] + '&';
                }
                str = str.substring(0, str.length - 1);
                xhr.open('GET', options.url + str);
                xhr.send();
            } else {
                let formData = new FormData();
                for(key in options.data) {
                    formData.append(key, options.data[key]);
                }
                xhr.open(options.method, options.url);
                xhr.send(formData);
            }
        } else {
            if(options.method === 'GET') {
                xhr.open('GET', options.url);
                xhr.send();
            } else {
                const formData = new FormData()
                xhr.open(options.method, options.url);
                xhr.send(formData);
            }
        } 
    } catch(err) {
        console.log(err);
    }
    xhr.addEventListener('load', () => {
         options.callback(xhr.error, xhr.response);
    })
};
