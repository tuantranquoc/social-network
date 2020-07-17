import {backendLookup} from "../lookup";


export function apiTrendList(callback) {
    backendLookup("GET","/tweets/hash_tag/top",callback)
}


export function apiRecommendUserGlobal(callback) {
    backendLookup("GET","/recommend_user/global/",callback)
}
export function apiRecommendUserFeed(callback) {
    backendLookup("GET","/recommend_user/feed/",callback)
}

export function apiRecommendUserProfile(username,callback) {
    // ``
    console.log("username-e",username)
    backendLookup("GET",`/recommend_user/user/${username}`,callback)
}



export function apiProfileFollowToggle(username, action, callback) {
    const data = {action: `${action && action}`.toLowerCase()};
    console.log("action: ", data);
    backendLookup("POST", `/profile/${username}/follow`, callback, data)
}