import {backendLookup} from "../lookup";


export function apiProfileDetail(username, callback) {
    backendLookup("GET", `/profile/${username}/`, callback,)
}


export function apiProfileImage(data, callback) {
   // const files = {'files':data.get('files')};
    backendLookup("POST", `/profiles/upload/he/`, callback, data)
}


export function apiProfileAvatarEdit(data, callback) {
    backendLookup("POST", `/profiles/upload/avatar/`, callback, data)
}

export function apiProfileBackgroundEdit(data, callback) {
    backendLookup("POST", `/profiles/upload/background/`, callback, data)
}


export function apiProfileFollowing(username,callback) {
   // const files = {'files':data.get('files')};
    backendLookup("GET", `/profiles/${username}/following/all`, callback)
}

export function apiProfileFollower(username,callback) {
   // const files = {'files':data.get('files')};
    backendLookup("GET", `/profiles/${username}/follower/all`, callback)
}


export function apiProfileFollowToggle(username, action, callback) {
    const data = {action: `${action && action}`.toLowerCase()};
    console.log("action: ", data);
    backendLookup("POST", `/profile/${username}/follow`, callback, data)
}