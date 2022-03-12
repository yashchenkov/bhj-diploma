/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    

    if(options.method === 'GET') {
        xhr.open('GET', options.data);
        xhr.responseType = 'json';
        xhr.send();
    } else {
        const formData = new formData();
        formData.append('data', options.data);

        xhr.open(options.method, options.url);
        xhr.responseType = 'json';
        xhr.send(formData);
    }

    xhr.addEventListener('load', () => {
         options.callback(xhr.error, xhr.response);
    })
};
