const getPostData = function (params) {
    // let data = new FormData();
    // for (let key in params) {
    //     if (params.hasOwnProperty(key)) {
    //         if (typeof params[key] == 'object') {
    //             // for(let sub_key in params[key]) {
    //             //     let name = key + '[' + sub_key + ']';
    //             //     data.append(name, params[key][sub_key]);
    //             // }
    //             // let value = new Blob([JSON.stringify(params[key])], {type : 'application/json'});
    //             // data.append(key, value);
    //             // data.append(key, JSON.stringify(params[key]));
    //         } else {
    //             data.append(key, params[key]);
    //         }
    //     }
    // }
    let data = JSON.stringify(params);
    return data;
};

const getGetData = function (url, params) {
    let querystring = '';

    if (params) {
        let data = [];

        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                data.push(key + '=' + params[key]);
            }
        }

        querystring = data.join('&');

        if (url.indexOf('?') > -1) {
            querystring = '&' + querystring;
        } else {
            querystring = '?' + querystring;
        }
    }

    return url + querystring;
};

const handleResponse = (e, callback) => {
    if (callback) {
        if (e && e.target && e.target.responseText) {
            let response, error;
            try {
                response = JSON.parse(e.target.responseText);
            } catch (exc) {
                error = {
                    code: 'parsingError',
                    message: exc.message,
                };
                callback(error);
            }
            if (!error) {
                callback(response);
            }
        } else {
            let response = e.target;
            response.error = {
                code: response.status,
            };
            callback(response);
        }
    }
};

export function request(url, params, method, callback) {
    method = method ? method : 'POST';

    let xhr = new XMLHttpRequest();
    let data;
    switch (method) {
        case 'PUT':
        case 'PATCH':
        case 'POST':
            data = getPostData(params);
            // url += '?ErrorDetails=true';
            break;
        case 'GET':
            url = getGetData(url, params);
            break;
    }
    xhr.open(method, url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Accept', 'application/json');
    switch(method) {
        case 'PUT':
        case 'PATCH':
        case 'POST':
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            break;
    }

    if (params['app_secret']) {
        xhr.setRequestHeader('x-app-secret', params['app_secret']);
    }

    xhr.onload = function (e) {
        handleResponse(e, callback);
    };
    xhr.onerror = function (e) {
        handleResponse(e, callback);
    };

    xhr.send(data);

    // console.log(url);
    // console.log(method);
}

// export function postRedirect(url, data) {
//     let method = "post"; // Set method to post by default if not specified.

//     // The rest of this code assumes you are not using a library.
//     // It can be made less wordy if you use one.
//     let form = document.createElement("form");
//     form.setAttribute("method", method);
//     form.setAttribute("action", url);

//     for(let key in data) {
//         if(data.hasOwnProperty(key)) {
//             let hiddenField = document.createElement("input");
//             hiddenField.setAttribute("type", "hidden");
//             hiddenField.setAttribute("name", key);
//             hiddenField.setAttribute("value", data[key]);

//             form.appendChild(hiddenField);
//         }
//     }

//     document.body.appendChild(form);
//     form.submit();
// }

export function redirect(url, data, redirect) {
    url = getGetData(url, data);

    if (redirect) {
        document.location.assign(url);
    }

    return url;
}
