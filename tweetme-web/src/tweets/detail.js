import React, {useEffect, useState} from "react";
import {ActionBtn} from "./button";
import {UserDisplay, UserPicture} from "../profile";
import {apiBookmarkCreate, apiCommentList, apiTweetAction, apiTweetDetail} from "./lookup";
import {CommentCreate, CommentChildCreate} from "./create";
import 'font-awesome/css/font-awesome.min.css';
import {Icon} from "react-animated-fa";

const pSm = {
    fontSize: "15px", fontWeight: "400", lineHeight: "20px", color: "#657786",
};

export function ParentTweet(props) {
    const style = {
        width: "520px",
        backgroundColor: '#ffffff',
        maxHeight: "340px",
    };
    const {tweet} = props;
    return tweet.parent ?
        <Tweet hideActions isReTweet retweeter={props.retweeter} className={' '} style={style}
               tweet={tweet.parent}/> : null
}

function UserLink(props) {
    const {username} = props;
    const handleUserLink = (event) => {
        event.preventDefault();
        window.location.href = `/profile/${username}`
    };
    return <span className='pointer' onClick={handleUserLink}>
        {props.children}
    </span>
}

export function Tweet(props) {
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);
    const {tweet, didRetweet, hideActions, isReTweet, retweeter, reTweet} = props;
    const [tweets,setTweets] = useState(tweet);
    const [comments, setComments] = useState([]);
    const [didLookup, setDidLookUp] = useState(false);
    const [actionTweet, setActionTweet] = useState(props.tweet ? props.tweet : null);
    const [showResults, setShowResults] = useState(false);
    let tweetImg = tweet.image ? "mt-1 mb-1" : "d-none";
    const onCommentClick = (event) => {
        event.preventDefault();
        setShowResults(!showResults);
    };

    const normal_style = {
        width: "598px",
        backgroundColor: "#ffffff",
        maxHeight: "540px",
    };
    let className = props.className ? props.className : 'ml-5 mx-auto w-auto tweet';

    let style = props.style ? props.style : normal_style;
    if (props.style) {
        console.log("parent style", props.style)
    }
    className = isReTweet === true ? `${className} p-2 border rounded` : className;
    const handlePerformAction = (newActionTweet, status) => {
        if (status === 200) {
            console.log("like-or-unlike");
            setActionTweet(newActionTweet);
        } else if (status === 201) {
            //let 'em known tweet created
            if (didRetweet) {
                didRetweet(newActionTweet)
            }
        }
    };


    const handleReTweetAction = (response, status) => {
        console.log("ReTweet action", response, status);
        if (status === 201) {
            const newTweet = response;
            reTweet(response);
            const final = [newTweet].concat(tweet);
            console.log("current-old",tweet);
            console.log("current-newTweet",newTweet);
  //          console.log("current-newList",newTweet);
        }
    };


    const handleBackEndLookUp = (response, status) => {
        if (status === 200) {
            setComments(response)
        }
    };

    useEffect(() => {
        if (didLookup === false) {
            apiCommentList(tweet.id, handleBackEndLookUp);
            setDidLookUp(true)
        }
    }, [tweet.id, didLookup, setDidLookUp]);


    const path = window.location.pathname;
    const idRegex = /(?<id>\d+)/;
    const match = path.match(idRegex);
    const urlTweetId = match ? match.groups.id : -1;

    const isDetail = `${tweet.id}` === `${urlTweetId}`;
    const handleLink = (event) => {
        event.preventDefault();
        window.location.href = `/${tweet.id}`
    };

    if (tweet.community !== undefined && tweet.community.length !== 0) {
        console.log("tweetCommunity", tweet.community);
    }
    const newBackground = (style) => {
        console.log("old style", style);
        let newStyle = {
            width: style.width,
            backgroundColor: "#f5f8fa",
            maxHeight: "1000px",
        };
        console.log("new style", style);
        return newStyle;
    };
    const oldBackground = (style) => {
        let newStyle = {
            width: style.width,
            backgroundColor: "#ffffff",
            maxHeight: "1000px",
        };
        return newStyle;
    };
// {(`${tweet.user}` && `${tweet.user}`)}
    //   console.log("username:parent", tweet.parent);
    return <div className={className} style={hovered ? newBackground(style) : oldBackground(style)}
                onMouseEnter={toggleHover}
                onMouseLeave={toggleHover}>
        {isReTweet === true &&
        <div className='ml-1 mb-2'>
            <span className='small text-muted d-flex'>
                ReTweet via<p><UserDisplay user={retweeter}/></p>
            </span>
        </div>}
        <div className='d-flex pb-0 w-auto'>
            <div className='mr-2' style={{width: "30px", marginTop: "-10px"}}>
                <UserPicture user={tweet.user}/>
            </div>
            <div className='pb-0 tweet ml-4' style={{width: "500px"}}>
                <div className="w-100">
                    <div className="w-100">
                        <p className="mb-1 mr-1"
                           style={{
                               fontSize: "17px", fontWeight: "450",
                               lineHeight: "2px",
                               color: "#14171a",
                               fontFamily: "system-ui", textDecoration: "none",
                           }}>{tweet.user.first_name} {tweet.user.last_name}<span className="" style={{
                            fontSize: "13px",
                            fontWeight: "400",
                            fontFamily: "system-ui"
                        }}> {tweet.timestamp}</span></p>
                        <p className="mt-0" style={{fontSize: "15px"}}><UserLink
                            username={tweet.user.username}><span
                            style={{fontWeight: "400"}}>@{tweet.user.username}</span></UserLink></p>

                    </div>
                    {tweet.hash_tag !== undefined && tweet.hash_tag.length !== 0 ?
                        <HashTagList hashTag={tweet.hash_tag}/> : null}
                    <p style={{
                        fontSize: "15px",
                        fontWeight: "400",
                        lineHeight: "20px",
                        color: "#14171a", fontFamily: "system-ui"
                    }}>{tweet.content}</p>
                    <div className={tweetImg}>
                        <img src={tweet.image} style={{width: "507px", height: "265px", borderRadius: "10px"}}/>
                    </div>
                    {tweet.community !== undefined && tweet.community.length !== 0 ?
                        <CommunityTypeList communities={tweet.community}/> : null}
                    <ParentTweet tweet={tweet} retweeter={tweet.user}/>
                </div>
                <div className="btn btn-group-justified px-0 py-1 h-auto mb-0">
                    {(actionTweet && hideActions !== true) && <React.Fragment>
                        <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction}
                                   action={{type: "like", display: "Likes"}}/>
                        <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction}
                                   action={{type: "unlike", display: "UnLike"}}/>
                        <ReTweet tweet={tweet} action="retweet" didPerformAction={handleReTweetAction}/>
                        <button className='btn px-1 mr-3 py-0 btn-dark btn-sm mr-1' onClick={onCommentClick}><i
                            className="fa fa-comments" aria-hidden="true">
                        </i></button>
                        <BookmarkBtn tweet={tweet}/>
                    </React.Fragment>}
                    {isDetail !== false ? null :
                        <button className='btn btn-outline-primary btn-sm' onClick={handleLink}>
                            View
                        </button>}
                    <div className='mt-0 rounded'>​
                        {showResults === true ?
                            <div className='mb-2'>
                                <AllowComment tweet={tweet} showResult={showResults}
                                              commentList={comments}/></div> : null}
                    </div>
                </div>
            </div>
        </div>
    </div>
}

/**
 * @return {null}
 */
export function AllowComment(props) {
    const {commentList, showResult, tweet, handleNewComment, tweetId} = props;
    console.log("showResult", showResult);
    console.log("tweet_id", tweet.id);
    return commentList.length !== 0 && showResult ?
        <CommentCreate tweetId={tweet.id}/>
        : <CommentCreate tweetId={tweet.id}/>
}


export function AllowChildComment(props) {
    const {commentId} = props;
    const [showResult, setShowResult] = useState(false);

    const onCommentClick = (event) => {
        event.preventDefault();
        setShowResult(!showResult);
    };

    console.log("being call");
    return commentId !== undefined ?
        <React.Fragment>
            <div className=' p-0 position-relative border'>
                <button className='position-relative btn-info'
                        style={{fontSize: "10px", marginLeft: "75%", marginTop: "%"}} onClick={onCommentClick}>Reply
                </button>
                {showResult === true ? <CommentChildCreate showResult={true} commentId={commentId}/> : null}
            </div>
        </React.Fragment>
        : null
}

export function callAllowChildComment(props) {
    const {commentId} = props;
    console.log("called1");
    return <AllowChildComment commentId={commentId} showResult={true}/>
}

function CommunityTypeList(props) {

    const {communities} = props;

    return <div>{communities.map((item, index) => {
        return <HandleLink community={item.communities}/>
    })}</div>
}

function HandleLink(props) {
    const {community} = props;
    const handleLink = (event) => {
        event.preventDefault();
        window.location.href = `/community/${community}/`
    };
    return <button onClick={handleLink} className='btn py-0 px-1 btn-sm btn-danger mr-2'
                   style={{fontSize: "15px"}}>{community}</button>
}

function HandleHashTagLink(props) {
    const {hashTag} = props;
    const handleLink = (event) => {
        event.preventDefault();
        window.location.href = `/hash_tag/search/${hashTag}`
    };
    return <button onClick={handleLink} className='btn py-0 px-1 btn-sm btn-info mr-2'
                   style={{fontSize: "15px"}}>#{hashTag}</button>
}

function HashTagList(props) {

    const {hashTag} = props;

    return <div>{hashTag.map((item, index) => {
        return <HandleHashTagLink hashTag={item.hash_tag}/>
    })}</div>
}

function BookmarkBtn(props) {
    const {tweet} = props;

    const handleBackEndLookUp = (response, status) => {
        console.log("book-st", response, status);
        if (status === 200) {
            console.log("book-st", response, status)
        }
    };
    const handleBookmarkCreate = (event) => {
        event.preventDefault();
        console.log("book-tw", tweet.id);
        apiBookmarkCreate(tweet.id, handleBackEndLookUp)
    };

    return <button onClick={handleBookmarkCreate} className='btn px-1 mr-3 py-0 btn-light btn-sm mr-1'><i
        className="fa fa-bookmark"
        aria-hidden="true">

    </i>
    </button>;
}

function ReTweet(props) {
    const {tweet, action, didPerformAction} = props;
    const handleActionBackendEvent = (response, status) => {
        didPerformAction(response, status);
    };
    const className = 'btn btn-dark btn-sm mr-3 px-1 py-0 px-auto';
    let likesFa = <i className="fa fa-retweet" style={{fontSize: "15px"}} aria-hidden="true"/>;
    const handleClick = (event) => {
        event.preventDefault();
        console.log("tweet_id", tweet.id);
        apiTweetAction(tweet.id, action, handleActionBackendEvent);
    };
    return <button className={className} style={{}} onClick={handleClick}>{likesFa}</button>;
}

