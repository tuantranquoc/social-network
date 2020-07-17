import React, {useEffect, useState} from "react";
import {apiTweetList} from "./lookup";
import {Tweet} from "./detail";
import {apiChatRoom} from "../chat/lookup";

export function TweetList(props) {
    const [tweetsInit, setTweetsInit] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [preUrl, setPreUrl] = useState(null);
    const [tweetsDidCall, setTweetsDidCall] = useState(false);
    const [firstLookUp, setFirstDidLookUp] = useState(true);
    const [newTweet, setNewTweet] = useState([]);
    let nTweet = props.newTweet;

    useEffect(() => {
        const final = [props.new].concat(tweetsInit);
        if (props.new !== undefined) {
            if (props.new.id !== undefined) {
                if (props.new.id !== tweets[0]) {
                    let newTweet = props.new;
                    let avatar = newTweet.user.avatar;
                    let background = newTweet.user.background;
                    let image = newTweet.image;
                    if (avatar.includes('k01q') === false) {
                        avatar = 'https://k01q.herokuapp.com' + avatar;
                        background = 'https://k01q.herokuapp.com' + background;
                        if (image !== null) {
                            image = 'https://k01q.herokuapp.com' + image;
                        }
                        newTweet.user.avatar = avatar;
                        newTweet.user.background = background;
                        newTweet.image = image;
                        const final = [newTweet].concat(tweets);
                        setTweets(final)
                    }
                }
            }
        }
    }, [props.new, tweets, tweetsInit]);

    useEffect(() => {
        // do my lookup
        if (tweetsDidCall === false) {
            const handleTweetLookup = (response, status) => {
                if (status === 200) {
                    setNextUrl(response.next);
                    setTweetsInit(response.results);
                    setTweetsDidCall(true);
                    setTweets(response.results);
                } else alert("There was an error");
            };
            apiTweetList(props.username, handleTweetLookup);
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

    const handleReTweet = (newTweet) => {
        console.log("newRetweet-rev", newTweet);
        let avatar = newTweet.user.avatar;
        let background = newTweet.user.background;
        let image = newTweet.image;
        if (avatar.includes('k01q') === false) {
            avatar = 'https://k01q.herokuapp.com' + avatar;
            background = 'https://k01q.herokuapp.com' + background;
            if (image !== null) {
                image = 'https://k01q.herokuapp.com' + image;
            }
            newTweet.user.avatar = avatar;
            newTweet.user.background = background;
            newTweet.image = image;
            const final = [newTweet].concat(tweets);
            setTweets(final)
        }

        avatar = newTweet.parent.user.avatar;
        background = newTweet.parent.user.background;
        // image = newTweet.image;
        if (avatar.includes('k01q') === false) {
            avatar = 'https://k01q.herokuapp.com' + avatar;
            background = 'https://k01q.herokuapp.com' + background;
            if (image !== null) {
                image = 'https://k01q.herokuapp.com' + image;
            }
            newTweet.parent.user.avatar = avatar;
            newTweet.parent.user.background = background;
            //        newTweet.image = image;
            const final = [newTweet].concat(tweets);
            setTweets(final)
        }
    };

    const handleLoadNext = (event) => {
        event.preventDefault();
        if (nextUrl !== null) {
            const handleLoadNextResponse = (response, status) => {
                if (status === 200) {
                    const newTweets = [...tweets].concat(response.results);
                    setNextUrl(response.next);
                    setTweetsInit(response.results);
                    //const results = tweets.push(response.results);
                    const final = [...tweets].concat(response.results);
                    setTweets(final);
                    setTweetsInit(final)

                } else alert("There was an error");
            };
            apiTweetList(props.username, handleLoadNextResponse, nextUrl)
        }
    };


    return <React.Fragment>{tweets.map((item, index) => {
        return <Tweet
            tweet={item}
            didRetweet={handleDidRetweet}
            reTweet={handleReTweet}
            className="my-3 mb-0 py-1 pt-3 border-top border-left border-right tweet"
            key={`${index}-{item.id}`}/>
    })}{nextUrl !== null &&
    (<div className="text-center border" style={{width: "598px"}}>
        <button onClick={handleLoadNext} className='btn p-1 px-2 mx-auto btn-primary' style={{fontSize: "15px"}}>Load
            More
        </button>
    </div>)}</React.Fragment>
}

