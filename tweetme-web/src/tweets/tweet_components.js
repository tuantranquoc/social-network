import React, {useEffect, useState} from "react";
import {TweetList} from "./list";
import {TweetCreate} from "./create";
import {apiTweetDetail, apiTweetList, apiCommentList, apiTweetFeed, apiTweetBookmark, apiTweetCreate} from "./lookup"
import {Tweet} from "./detail";
import {BookmarkList, FeedList, HashTagSearch} from "./feed";
import {CommunityFeedList} from "./community";
import {getBase64Image, getCookie} from "../profile/badge";
import {apiProfileBackgroundEdit} from "../profile/lookup";


export function FeedComponent(props) {
    const canTweet = props.canTweet !== "false";

    const [newTweets, setNewTweet] = useState([]);
    const handleNewTweet =
        (newTweet) => {
            console.log("new tweet", [...newTweets]);
            let tempNewTweet = [...newTweets];
            tempNewTweet.unshift(newTweet);
            setNewTweet(tempNewTweet);
        };
    console.log("component");
    return <div className={props.className}>
        {(canTweet === true) && <TweetCreate didTweet={handleNewTweet} className='col-12 mb-3'/>}
        <FeedList newTweet={newTweets} bookmark="0" {...props}/>
    </div>
}

export function CommunityComponent(props) {
    const canTweet = props.canTweet !== "false";

    const [newTweets, setNewTweet] = useState([]);
    const handleNewTweet =
        (newTweet) => {
            console.log("new tweet", [...newTweets]);
            let tempNewTweet = [...newTweets];
            tempNewTweet.unshift(newTweet);
            setNewTweet(tempNewTweet);
        };
    console.log("component");
    return <div className={props.className}>
        {(canTweet === true) && <TweetCreate didTweet={handleNewTweet} className='col-12 mb-3'/>}
        <CommunityFeedList newTweet={newTweets} {...props}/>
    </div>
}

export function TweetComponent(props) {
    console.log(props);
    const canTweet = props.canTweet !== "false";

    const [newTweets, setNewTweet] = useState([]);
    const handleNewTweet =
        (newTweet) => {
            console.log("new tweet", [...newTweets]);
            let tempNewTweet = [...newTweets];
            tempNewTweet.unshift(newTweet);
            setNewTweet(tempNewTweet);
        };
    console.log("component");
    return <div className={props.className}>
        {(canTweet === true) && <TweetCreate didTweet={handleNewTweet} className='col-12 mb-3'/>}

        <TweetList newTweet={newTweets} {...props}/>
    </div>
}

export function TweetDetailComponent(props) {
    const {tweetId} = props;
    const [didLookup, setDidLookUp] = useState(false);
    const [tweet, setTweet] = useState(null);
    const handleBackendLookUp = (response, status) => {
        if (status === 200) {
            console.log("set tweet", response);
            setTweet(response)
        } else {
            alert("There was an error finding your tweet! TweetDetailComponent!")
        }
    };
    useEffect(() => {
        if (didLookup === false) {
            apiTweetDetail(tweetId, handleBackendLookUp);
            setDidLookUp(true)
        }
    }, [tweetId, didLookup, setDidLookUp]);
    return tweet === null ? null : <Tweet tweet={tweet}
                                          className="my-3 mb-0 py-1 pt-3 border-top border-left border-right tweet"/>
}


export function CommentComponent(props) {
    const [comments, setComments] = useState([]);
    const [didLookup, setDidLookUp] = useState(false);
    useEffect(() => {
            const myCallBack = (response, status) => {
                console.log("username:", response, status);
                if (status === 200) {
                    setComments(response)
                }
            };
            apiCommentList(276, myCallBack)
        }
    );
    return comments === null ? <div className='border-dark border'><p>not success call</p></div> :
        <div className='border-dark border'><p>{comments.map((item, index) => {
            return <li>{item.content}, userid: {item.user}</li>
        })} perfect nha</p></div>
}


export function BookmarkComponent(props) {
    const canTweet = props.canTweet !== "false";
    const [newTweets, setNewTweet] = useState([]);
    const handleNewTweet =
        (newTweet) => {
            console.log("new tweet", [...newTweets]);
            let tempNewTweet = [...newTweets];
            tempNewTweet.unshift(newTweet);
            setNewTweet(tempNewTweet);
        };
    console.log("component");
    return <div className={props.className}>
        {(canTweet === true) && <TweetCreate didTweet={handleNewTweet} className='col-12 mb-3'/>}
        <BookmarkList newTweet={newTweets} {...props}/>
    </div>
}


export function HashTagComponent(props) {
    const canTweet = props.canTweet !== "false";
    const [newTweets, setNewTweet] = useState([]);
    const handleNewTweet =
        (newTweet) => {
            console.log("new tweet", [...newTweets]);
            let tempNewTweet = [...newTweets];
            tempNewTweet.unshift(newTweet);
            setNewTweet(tempNewTweet);
        };
    console.log("component");
    return <div className={props.className}>
        {(canTweet === true) && <TweetCreate didTweet={handleNewTweet} className='col-12 mb-3'/>}
        <HashTagSearch newTweet={newTweets} {...props}/>
    </div>
}

