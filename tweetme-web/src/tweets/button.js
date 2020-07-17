import {apiTweetAction} from "./lookup";
import React, {useState} from "react";
import 'font-awesome/css/font-awesome.min.css';
import {Icon} from "react-animated-fa/lib";


export function ActionBtn(props) {

    const {tweet, didPerformAction, action} = props;
    const [state, setState] = useState(false);
    const likes = tweet.likes ? tweet.likes : 0;
    const className = props.className ? props.className : 'btn btn-dark btn-sm mr-3 px-1 py-0 px-auto';
    const actionDisplay = action.display ? action.display : 'Action';
    const handleActionBackendEvent = (response, status) => {
        console.log(status, response);
        if ((status === 201 || status === 200) && didPerformAction) {
            didPerformAction(response, status);
            //   setUserLikes(true)
            console.log("action",response,status)
        }
    };

    const normalStyle = {fontSize: "15px",color:"white"};
    const changeStyle = {fontSize: "17px", color: "red",};
    // const handleChange =(event)=>{
    //     event.preventDefault()
    //     let el = do
    // };
    // <Icon
    //           iconUrl="fab fa-heart"
    //           link="https://www.facebook.com/"
    //           color="rgb(29, 179, 199)"
    //           layerColor="rgb(29, 179, 199)"
    //           bgColor="#f1f1f1"
    //           rounded={true}
    //       />
    // <i className="fa fa-thumbs-down" style={{fontSize:"15px"}} aria-hidden="true"></i>

    let likesFa = action.type === "like" ?
        <div className="p-0">{likes} <i className="fa fa-heartbeat animated pulse" style={state === false ? normalStyle : changeStyle}
                                        aria-hidden="true"></i>
        </div> : action.type === "unlike" ?
            <i className="fa fa-thumbs-down" style={{fontSize: "15px"}} aria-hidden="true"></i> :
            <i className="fa fa-retweet" style={{fontSize: "15px"}} aria-hidden="true"></i>
    const handleClick = (event) => {
        event.preventDefault();
        console.log("tweet_id", tweet.id);
        apiTweetAction(tweet.id, action.type, handleActionBackendEvent);
        setState(!state)
            console.log("state",state);
    };
    const display = action.type === "like" ? likes + " " + action.type : actionDisplay;
    return <button className={className} style={{}} onClick={handleClick}>{likesFa}</button>;
}