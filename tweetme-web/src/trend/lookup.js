import {backendLookup} from "../lookup";


export function apiTrendList(callback) {
    backendLookup("GET","/tweets/hash_tag/top",callback)
}