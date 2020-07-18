function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function backendLookup(method, endpoint, callback, data) {
    let jsonData;
    if (data) {
        jsonData = JSON.stringify(data);
    }
    // getting html elements
    const xhr = new XMLHttpRequest();
    // `http://localhost:8000/api${endpoint}`
    const url = `https://k02q.herokuapp.com/api${endpoint}`;
    xhr.open(method, url);
    const csrftoken = getCookie('csrftoken');
    xhr.setRequestHeader("Content-Type", "application/json");
    if (csrftoken) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }


    xhr.responseType = "json";
    xhr.onload = function () {
        if (xhr.status === 403) {
            if (xhr.response.detail !== undefined) {
                const detail = xhr.response.detail;
                if (detail === "Authentication credentials are not provided") {
                    if (window.location.href.indexOf("login") === -1) {
                        window.location.href = "/login?showLoginRequired=true";
                    }
                }
            }
        }
        callback(xhr.response, xhr.status);
    };
    xhr.onerror = function (e) {
        console.log(e);
        callback({"message": "the request was an error!"}, 400)
    };
    xhr.send(jsonData);
}

export function viewLookup(method, endpoint, callback, data) {
    let jsonData;
    if (data) {
        jsonData = JSON.stringify(data);
    }
    // getting html elements
    const xhr = new XMLHttpRequest();
    // `http://localhost:8000/api${endpoint}`
    const url = `https://k02q.herokuapp.com/${endpoint}`;
    xhr.open(method, url);
    const csrftoken = getCookie('csrftoken');
    xhr.setRequestHeader("Content-Type", "application/json");
    if (csrftoken) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }


    xhr.responseType = "json";
    xhr.onload = function () {
        if (xhr.status === 403) {
            const detail = xhr.response.detail;
            if (detail === "Authentication credentials are not provided") {
                if (window.location.href.indexOf("login") === -1) {
                    window.location.href = "/login?showLoginRequired=true";
                }
            }
        }
        callback(xhr.response, xhr.status);
    };
    xhr.onerror = function (e) {
        console.log(e);
        callback({"message": "the request was an error!"}, 400)
    };
    xhr.send(jsonData);
}


