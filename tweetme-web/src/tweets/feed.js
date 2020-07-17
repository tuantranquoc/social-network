import React, {useEffect, useState} from "react";
import {apiTweetFeed, apiTweetBookmark, apiHashTagSearch, apiTweetList} from "./lookup";
import {Tweet} from "./detail";
import {UserLink} from "../profile/profile_components";
import {UserAvatarSm} from "../profile/profile_components";

export function FeedList(props) {
    const [tweetsInit, setTweetsInit] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [preUrl, setPreUrl] = useState(null);
    const [tweetsDidCall, setTweetsDidCall] = useState(false);
    const {bookmark} = props.bookmark !== undefined ? props.bookmark : "ok";
    console.log("bookmark", bookmark);

    useEffect(() => {
        const final = [...props.newTweet].concat(tweetsInit);
        if (final.length !== tweets.length) {
            //   setTweets(final)
            const handleTweetLookup = (response, status) => {
                if (status === 200) {
                    setNextUrl(response.next);
                    setTweetsInit(response.results);
                    setTweets(response.results);
                    setTweetsDidCall(true)
                } else alert("There was an error");
            };
            if (bookmark) {
                apiTweetBookmark(handleTweetLookup)
            } else {
                apiTweetFeed(handleTweetLookup);
            }
        }

    }, [props.newTweet, tweets, tweetsInit]);
    useEffect(() => {
        // do my lookup
        if (tweetsDidCall === false) {
            const handleTweetLookup = (response, status) => {
                console.log("res-feed", response, status);
                if (status === 200) {
                    setNextUrl(response.next);
                    setTweetsInit(response.results);
                    setTweetsDidCall(true)
                }
            };
            if (bookmark) {
                apiTweetBookmark(handleTweetLookup)
            } else {
                apiTweetFeed(handleTweetLookup);
            }
        }
    }, [tweets, tweetsDidCall, setTweetsDidCall, props.username]);

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
            if (bookmark) {
                apiTweetBookmark(handleLoadNextResponse, nextUrl)
            } else {
                apiTweetFeed(handleLoadNextResponse, nextUrl);
            }
        }
    };


    console.log("list: ", tweets);
    return <React.Fragment>{tweets.map((item, index) => {
        return <Tweet
            tweet={item}
            didRetweet={handleDidRetweet}
            className=" my-3 mb-0 py-1 pt-3 border-top border-left border-right"
            key={`${index}-{item.id}`}/>
    })}{nextUrl !== null &&
    (<div className="text-center" style={{width: "598px"}}>
        <button onClick={handleLoadNext} className='btn p-1 px-2 mx-auto btn-primary' style={{fontSize: "15px"}}>Load
            More
        </button>
    </div>)}
    </React.Fragment>
}

export function BookmarkList(props) {
    const [tweetsInit, setTweetsInit] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [preUrl, setPreUrl] = useState(null);
    const [tweetsDidCall, setTweetsDidCall] = useState(false);


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
                console.log("res-book", response);
                if (status === 200) {
                    setNextUrl(response.next);
                    setTweetsInit(response.results);
                    setTweetsDidCall(true)
                }
            };
            apiTweetBookmark(handleTweetLookup)
        }
    }, [tweets, tweetsDidCall, setTweetsDidCall, props.username]);

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
            apiTweetBookmark(handleLoadNextResponse, nextUrl)
        }
    };

//className="my-5 py-5 border bg-white text-dark"
    console.log("list: ", tweets);
    return <React.Fragment>{tweets.map((item, index) => {
        return <Tweet
            tweet={item}
            didRetweet={handleDidRetweet}
            className="my-3 mb-0 py-1 pt-3 border-top border-left border-right"
            key={`${index}-{item.id}`}/>
    })}{nextUrl !== null &&
    (<div className="text-center" style={{width: "598px"}}>
        <button onClick={handleLoadNext} className='btn p-1 px-2 mx-auto btn-primary' style={{fontSize: "15px"}}>Load
            More
        </button>
    </div>)}</React.Fragment>
}

export function HashTagSearch(props) {
    const [tweetsInit, setTweetsInit] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [preUrl, setPreUrl] = useState(null);
    const [tweetsDidCall, setTweetsDidCall] = useState(false);
    const [tweetOrProfile, setTweetOrProfile] = useState(true);
    const [profile, setProfile] = useState([]);

    console.log("tag-rs", props.hashtag);
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
                console.log("res-hash", response);
                if (status === 200) {
                    setNextUrl(response.next);
                    response.results.length !== 0 ? response.results[0].location !== undefined ?
                        setTweetOrProfile(false) : setTweetOrProfile(true) : setTweetOrProfile(true);
                    setProfile(response.results);
                    setTweetsInit(response.results);
                    setTweetsDidCall(true)
                }
            };
            apiHashTagSearch(props.hashtag, handleTweetLookup)
        }
    }, [tweets, tweetsDidCall, setTweetsDidCall, props.hashtag]);

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
            apiTweetBookmark(props.hashtag, handleLoadNextResponse, nextUrl)
        }
    };


    console.log("list: ", tweets);
    return <div>{tweetOrProfile === true ? <React.Fragment>{tweets.map((item, index) => {
            return <Tweet
                tweet={item}
                didRetweet={handleDidRetweet}
                className="my-3 mb-0 py-1 pt-3 border-top border-left border-right"
                key={`${index}-{item.id}`}/>
        })}{nextUrl !== null &&
        (<div className="text-center" style={{width: "598px"}}>
            <button onClick={handleLoadNext} className='btn p-1 px-2 mx-auto btn-primary' style={{fontSize: "15px"}}>Load
                More
            </button>
        </div>)}</React.Fragment> :
        <div className="border rounded p-2 h-auto" style={{width: "598px", maxHeight: "1000px", overflow: "auto"}}>
            <div className="d-block">{profile.map((item, index) => {
                return <div className="text-black d-flex ml-2 mb-2">
                    <div className=" pt-1 mr-1">
                        <UserLink username={item.username}><UserAvatarSm user={item}/></UserLink>
                    </div>

                    <div className="d-block py-auto">
                        <UserLink username={item.username}><p className="textlinks mb-0" style={{
                            fontSize: "17px",
                            fontWeight: "500",
                            fontFamily: "system-ui", color: "#8bd3dd",
                        }}>@{item.username}</p></UserLink>
                        <p style={{fontSize: "18px"}}>{item.first_name} {item.last_name}</p>
                    </div>
                </div>
            })}</div>
        </div>}</div>
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
            className="my-3 mb-0 py-1 pt-3 border-top border-left border-right"
            key={`${index}-{item.id}`}/>
    })}</React.Fragment>
}