import {backendLookup} from "../lookup/lookup_components";

export function apiTweetCreate(newTweet, community, hash_tag,image, callback) {
    const data = {content: newTweet, community: community, hash_tag: hash_tag,image:image};
    backendLookup("POST", "/tweets/create/", callback, data)
}

export function apiTweetAction(tweetId, action, callback) {
    const data = {id: tweetId, action: action};
    backendLookup("POST", "/tweets/action/", callback, data)
}

export function apiTweetDetail(tweet_id, callback) {
    backendLookup("GET", `/tweets/${tweet_id}/`, callback,)
}

export function apiCommentList(tweetId, callback) {
    const endPoint = `/tweets/comment/${tweetId}`;
    backendLookup("GET", `/tweets/comment/${tweetId}`, callback,)
}

export function apiCommentCreate(tweetId, newComment, callback) {
    const data = {id: tweetId, content: newComment};
    backendLookup("POST", "/tweets/comment/create/", callback, data)
}

export function apiChildCommentCreate(commentId, newComment, callback) {
    const data = {content: newComment};
    backendLookup("POST", `/tweets/comment/child/create/${commentId}`, callback, data)
}

export function apiParentCommentList(commentId, callback) {
    console.log("comment-id in lookup", commentId);
    backendLookup("GET", `/tweets/comment/parent/${commentId}`, callback)
}

export function apiTweetList(username, callback, nextUrl) {
    let endpoint = "/tweets/";
    if (username) {
        endpoint = `/tweets/?username=${username}`;
    }
    if (nextUrl) {
        endpoint = nextUrl.replace('https://k01q.herokuapp.com', '')
    }
    backendLookup("GET", endpoint, callback,)
}

export function apiTweetListTest(callback) {
    let endpoint = "/tweets/";
    backendLookup("GET", endpoint, callback,)
}

export function apiTweetFeed(callback, nextUrl) {
    let endpoint = "/tweets/feed/";
    if (nextUrl) {
        endpoint = nextUrl.replace('https://k01q.herokuapp.com', '')
    }
    backendLookup("GET", endpoint, callback,)
}

export function apiTweetBookmark(callback, nextUrl) {
    let endpoint = "/bookmark/";
    if (nextUrl) {
        endpoint = nextUrl.replace('https://k01q.herokuapp.com', '')
    }
    backendLookup("GET", endpoint, callback,)
}

export function apiCommunityFeed(community, callback, nextUrl) {
    let endpoint = `/tweets/community/find/${community}/`;
    console.log("endp", endpoint);
    if (nextUrl) {
        endpoint = nextUrl.replace('https://k01q.herokuapp.com', '')
    }
    backendLookup("GET", endpoint, callback,)
}

export function apiHashTagSearch(hashTag, callback, nextUrl) {
    const data = {hash_tag: hashTag};
    let endpoint = `/tweets/hash_tag/search`;
    console.log("endp", endpoint);
    if (nextUrl) {
        endpoint = nextUrl.replace('https://k01q.herokuapp.com', '')
    }
    backendLookup("POST", endpoint, callback,data)
}


export function apiTweetCommunityCreate(community, tweetId, callback) {
    let endpoint = `/tweets/community/add/`;
    const data = {id: tweetId, community: community};
    console.log(data);
    backendLookup("POST", endpoint, callback, data);
}

export function apiBookmarkCreate(tweetId, callback) {
    const data = {"id": tweetId};
    const endpoint = `/bookmark/create`;
    backendLookup("POST", endpoint, callback, data)
}


export function apiProfileBackgroundEdit(data, callback) {
    backendLookup("POST", `/profiles/upload/background/`, callback, data)
}
