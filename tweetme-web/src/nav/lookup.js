import {viewLookup} from "../lookup";


export function apiHashTagSearch(hashTag, callback) {
    const data = {hash_tag: hashTag};
    let endpoint = `hash_tag/search/${hashTag}`;
    console.log("endp",endpoint);
    viewLookup("GET", endpoint, callback);
}
