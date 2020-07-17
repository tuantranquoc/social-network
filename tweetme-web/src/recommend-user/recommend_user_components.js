import React, {useEffect, useState} from "react";
import {apiRecommendUserGlobal, apiRecommendUserFeed, apiRecommendUserProfile} from "./lookup";
import {apiProfileFollowToggle} from "../profile/lookup";
import {UserAvatarSm} from "../profile/profile_components";
import '../App.css'

function Recommend(props) {
    const {username} = props;
    const endpoint = `/profile/${username}`;
    console.log("username", username);
    return username !== undefined ? <div className="d-flex position-relative">
        <div className="my-auto">
            <a href={endpoint} className="font-weight-bolder text-justify
     text-black-50 ml-1 my-auto text-sm"
               style={{fontSize: "15px", textDecoration: "none"}}>@{username}
            </a>
        </div>
    </div> : <div>not found</div>
}

function Follow(props) {
    // const {action} = props;
    const [action, setAction] = useState("Follow");
    const {user} = props;
    const handleBackEndUpdate = (response, status) => {
        if (status === 200) {
            if (response.is_following === true) {
                setAction("UnFollow")
            } else {
                setAction("Follow");
            }
        }
    };
    const handleAction = (event) => {
        event.preventDefault();
        apiProfileFollowToggle(user.username, action, handleBackEndUpdate)
    };
    return action !== undefined ? <div>
        <button onClick={handleAction} className="btn btn-sm btn-outline-info"
                style={{fontSize: "14px", fontWeight: "600"}}>{action}</button>
    </div> : null
}

export function RecommendGlobalComponent(props) {
    const [didCall, setDidCall] = useState(false);
    const [recommend, setRecommend] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);


    const handleBackEndLookup = (response, status) => {
        if (status === 200) {
            console.log("set-rd", response);
            setRecommend(response.results);
            console.log("set-rd-n", response.results[0].username);
            setDidCall(true);
            if (response.next !== null) {
                setNextUrl(response.next)
            }
        }
    };
    useEffect(() => {
        if (didCall === false) {
            apiRecommendUserGlobal(handleBackEndLookup, nextUrl);
        }
    });


    return (recommend !== undefined && recommend.length !== 0) ?
        <div className="ml-3 mt-2 rounded-circle" style={{width: "498px"}}>
            <h6 className=" w-auto" style={{
                fontSize: "19px",
                fontWeight: "800",
                lineHeight: "25px",
                color: "#14171a", fontFamily: "system-ui", maxWidth: "498px"
            }}>Recommend User</h6>
            {recommend.map((item, index) => {
                return <div className="d-flex mb-0 rounded"
                            style={{width: "288px", background: "#f5f8fa", borderRadius: "20px", border: "1px"}}>
                    <div className="p-1 h-100" style={{width: "198px"}}>
                        <div className="d-flex">
                            <div className="my-auto">
                                <UserAvatarSm user={item}/>
                            </div>
                            <div className="ml-1 pb-2 d-block">
                                <Recommend username={item.username}/>
                                <p className="mb-0 ml-1 mt-0" style={{
                                    fontSize: "15px",
                                    fontFamily: "system-ui"
                                }}>{item.first_name} {item.last_name}</p>


                            </div>
                        </div>
                    </div>
                    <div className="h-100 my-auto" style={{width: "54px"}}>
                        <Follow user={item}/>
                    </div>
                </div>
            })}</div> : null
}

export function RecommendFeedComponent(props) {
    const [didCall, setDidCall] = useState(false);
    const [recommend, setRecommend] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);


    const handleBackEndLookup = (response, status) => {
        if (status === 200) {
            console.log("set-rd-f", response);
            setRecommend(response.results);
            console.log("set-rd-f", response.results[0]);
            setDidCall(true);
            if (response.next !== null) {
                setNextUrl(response.next)
            }
        }
    };
    useEffect(() => {
        if (didCall === false) {
            apiRecommendUserFeed(handleBackEndLookup, nextUrl);
        }
    });


    return (recommend !== undefined && recommend.length !== 0) ?
        <div className="ml-3 mt-2 rounded-circle" style={{width: "498px"}}>
            <h6 className=" w-auto" style={{
                fontSize: "19px",
                fontWeight: "800",
                lineHeight: "25px",
                color: "#14171a", fontFamily: "system-ui", maxWidth: "498px"
            }}>Recommend User</h6>
            {recommend.map((item, index) => {
                return <div className="d-flex rounded"
                            style={{width: "288px", background: "#f5f8fa", borderRadius: "20px", border: "1px"}}>
                    <div className="p-1 h-100" style={{width: "198px"}}>
                        <div className="d-flex">
                            <div className="my-auto">
                                <UserAvatarSm user={item}/>
                            </div>
                            <div className="ml-1 pb-2 d-block">
                                <Recommend username={item.username}/>
                                <p className="mb-0 ml-1 mt-0" style={{
                                    fontSize: "15px",
                                    fontFamily: "system-ui"
                                }}>{item.first_name} {item.last_name}</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-100 my-auto" style={{width: "54px"}}>
                        <Follow user={item}/>
                    </div>
                </div>
            })}</div> : null
}

export function RecommendProfileComponent(props) {
    const [didCall, setDidCall] = useState(false);
    const [recommend, setRecommend] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);


    const handleBackEndLookup = (response, status) => {
        if (status === 200) {
            console.log("set-rd", response);
            setRecommend(response.results);
            console.log("set-rd-p", response.results[0]);
            setDidCall(true);
            if (response.next !== null) {
                setNextUrl(response.next)
            }
        }
    };
    useEffect(() => {
        if (didCall === false) {
            apiRecommendUserProfile(props.username, handleBackEndLookup, nextUrl);
        }
    });


    return (recommend !== undefined && recommend.length !== 0) ?
        <div className="ml-3 mt-2 rounded-circle" style={{maxWidth: "498px"}}>
            <h6 className=" w-auto" style={{
                fontSize: "19px",
                fontWeight: "800",
                lineHeight: "25px",
                color: "#14171a", fontFamily: "system-ui", maxWidth: "498px"
            }}>Recommend User</h6>
            {recommend.map((item, index) => {
                return <div className="d-flex rounded"
                            style={{width: "288px", background: "#f5f8fa", borderRadius: "20px", border: "1px"}}>
                    <div className="p-1 h-100" style={{width: "198px"}}>
                        <div className="d-flex">
                            <div className="my-auto">
                                <UserAvatarSm user={item}/>
                            </div>
                            <div className="ml-1 pb-2 d-block">
                                <Recommend username={item.username}/>
                                <p className="mb-0 ml-1 mt-0" style={{
                                    fontSize: "15px",
                                    fontFamily: "system-ui"
                                }}>{item.first_name} {item.last_name}</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-100 my-auto" style={{width: "54px"}}>
                        <Follow user={item}/>
                    </div>
                </div>
            })}</div> : null
}


