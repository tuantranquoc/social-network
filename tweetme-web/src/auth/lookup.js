import {backendLookup,viewLookup} from "../lookup";


export function apiRegister(username, password, callback) {
    const data = {"username": username, "password": password};
    // `/chatroom/chat/${username}`
    backendLookup("POST","/register/" , callback, data)
}

export function apiLogin(username, password, callback) {
    console.log("username-p",username,password);
    const data = {"username": username, "password": password};
    // `/chatroom/chat/${username}`
    backendLookup("POST","/login/" , callback, data)
}

export function apiLogout(callback) {
    // `/chatroom/chat/${username}`
    backendLookup("GET","/logout/" , callback)
}


export function apiEditProfile(first_name,last_name,location,email,bio, callback) {
    const data = {"first_name": first_name, "last_name": last_name,"location":location,"email":email,"bio":bio};
    // `/chatroom/chat/${username}`
    backendLookup("POST","/profile/edit/" , callback, data)
}