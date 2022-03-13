/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    let str = '?';
    
    if('data' in options) {
        if(options.method === 'GET') {
            for(key in options.data) {
                str += key + '=' + options.data[key] + '&';
            }
            str = str.substring(0, str.length - 1);
            try {
                xhr.open('GET', options.url + str);
                xhr.send();
            } catch(err) {
                console.log(err);
            }
        } else {
            const formData = new FormData();
            for(key in options.data) {
                formData.append(key, options.data[key]);
            }
            try {
                xhr.open(options.method, options.url);
                xhr.send(formData);
            } catch(err) {
                console.log(err);
            }
        }
    } else {
        if(options.method === 'GET') {
            try {
                xhr.open('GET', options.url);
                xhr.send();
            } catch(err) {
                console.log(err);
            }
        } else {
            const formData = new FormData()
            try {
                xhr.open(options.method, options.url);
                xhr.send(formData);
            } catch(err) {
                console.log(err);
            }
        }
        
    } 
    xhr.addEventListener('load', () => {
         options.callback(xhr.error, xhr.response);
    })
};
