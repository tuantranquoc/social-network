import {backendLookup} from "../lookup";


export function apiChatRoom(username,callback) {
    backendLookup("GET",`/chatroom/get/${username}`,callback)
}

export function apiChat(username,content,callback) {
    const data = {"content":content};
    backendLookup("POST",`/chatroom/chat/${username}`,callback,data)
}

