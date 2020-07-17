import React, {useEffect, useState} from "react";
import {apiTweetFeed,apiCommunityFeed} from "./lookup";
import {Tweet} from "./detail";

export function CommunityFeedList(props) {

    const [tweetsInit, setTweetsInit] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [preUrl, setPreUrl] = useState(null);
    const [tweetsDidCall, setTweetsDidCall] = useState(false);
    console.log("communityType",props.community);



    useEffect(() => {
        const final = [...props.newTweet].concat(tweetsInit);
        if (final.length !== tweets.length) {
            setTweets(final)
        }
    }, [props.newTweet, tweets, tweetsInit]);
    useEffect(() => {
        // do my lookup
        if (tweetsDidCall === false) {
            const handleTweetLookup = (response, status) => {
                console.log("communitySt",response);
                if (status === 200) {
                    setNextUrl(response.next);
                    setTweetsInit(response.results);
                    setTweetsDidCall(true)
                }
            };
            apiCommunityFeed(props.community,handleTweetLookup);
        }
    }, [tweets, tweetsDidCall, setTweetsDidCall, props.community]);

    const handleDidRetweet = (newTweet) => {
        const updateTweetInit = [...tweetsInit];
        updateTweetInit.unshift(newTweet);
        setTweetsInit(updateTweetInit);
        const updateFinalTweetInit = [...tweets];
        updateFinalTweetInit.unshift(tweets);
        setTweets(updateFinalTweetInit)
    };

    const handleLoadNext = (event) => {
        event.preventDefault();
        if (nextUrl !== null) {
            const handleLoadNextResponse = (response, status) => {
                if (status === 200) {
                    const newTweets = [...tweets].concat(response.results);
                    setNextUrl(response.next);
                    setTweetsInit(response.results);
                    setTweets(response.results);
                }
            };
            apiCommunityFeed(props.community,handleLoadNextResponse, nextUrl)
        }
    };


    console.log("list: ", tweets);
    return <React.Fragment>{tweets.map((item, index) => {
        return <Tweet
            tweet={item}
            didRetweet={handleDidRetweet}
            className="my-3 mt-0 mb-0 py-2 pt-3 border-top border-bottom border-left border-right"
            key={`${index}-{item.id}`}/>
    })}{nextUrl !== null &&
    <button onClick={handleLoadNext} className='btn btn-outline-primary'>Load Next</button>}</React.Fragment>
}

function CommentList(props) {
    const [comments, setComments] = useState([]);
    const {newComment} = props.newComment;
    const [commentsInit, setCommentsInit] = useState([]);
    const [commentsDidCall, setCommentsDidCall] = useState(false);


    useEffect(() => {
        const final = [...newComment].concat(commentsInit);
        if (final.length !== comments.length) {
            setComments(final)
        }

    }, [props.newComment, comments, commentsInit]);
    useEffect(() => {
        // do my lookup
        if (commentsDidCall === false) {
            const handleTweetLookup = (response, status) => {
                if (status === 200) {
                    setCommentsInit(response.results);
                    setCommentsDidCall(true)
                }
            };
            apiTweetFeed(handleTweetLookup);
        }
    }, [comments, commentsDidCall, setCommentsDidCall]);

     return <React.Fragment>{comments.map((item, index) => {
        return <Tweet
            comments={comments}
            className="border bg-white text-dark"
            key={`${index}-{item.id}`}/>
    })}</React.Fragment>
}