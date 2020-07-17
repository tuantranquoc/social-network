import React, {useEffect, useState} from 'react';
import logo from './auth/logo.svg';
import './App.css';
import {TweetComponent} from "./tweets";
import {apiCommentList, apiTweetListTest} from "./tweets/lookup";
import {CommentComponent} from "./tweets/tweet_components";

function Tweet(props) {
    const {tweet} = props;
    const className = props.className ? props.className : 'col-10 mx-auto'
    return <div className={className}>
        <p>{tweet.id} - {tweet.content}</p>
    </div>
}

function App() {
    const [tweets, setTweets] = useState([]);
    useEffect(() => {
        const handleRes = (response, status) => {
            console.log("username:status", typeof response);
            if (status === 200) {
                setTweets(response)
            }
        };
        apiCommentList(276, handleRes)
    }, []);

    const results = tweets.map((item, index) => {

    });
    const a = tweets[0];
    const b = tweets[1];
    let c = tweets.forEach(k);

    function k(item, index) {
        if (console.log("username:item", item.content))
            return typeof item.content;
        else return 1
    }

    console.log("username:comment", tweets.forEach(k));
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <p>
                    {tweets.map((item, index) => {
                        return <li>{item.content}</li>
                    })}
                </p>
                <p><CommentComponent tweet={tweets}/></p>
            </header>
        </div>
    );
}

export default App;
