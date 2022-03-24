/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

const createRequest = (options = {}) => {
    //console.log(options);
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    let str = '';
    let formData = new FormData();
    try {
        if(options.method === 'GET' && 'data' in options) {
            str = '?';
            for(key in options.data) {
                str += key + '=' + options.data[key] + '&';
            }
            str = str.substring(0, str.length - 1);
        } else if(options.method !== 'GET' && 'data' in  options) {
            for(key in options.data) {
                formData.append(key, options.data[key]);
            }
        }
    } catch(err) {
        console.log(err);
    }
    xhr.open(options.method, options.url + str);
    xhr.send(options.method === 'GET' ? null : formData);
    xhr.addEventListener('load', () => {
         options.callback(xhr.error, xhr.response);
    })
};

