import React, {useEffect, useState} from "react";
import {apiChatRoom, apiChat} from "./lookup";
import {apiProfileFollowing, apiProfileFollower} from "../profile/lookup";
import {apiHashTagSearch} from "../tweets/lookup";
import {UserAvatarSm} from "../profile/profile_components";


function ProfileLink(props) {
    const {username} = props;
    const endpoint = `/profile/${username}`;
    return username !== undefined ?
        <a href={endpoint} style={{cursor: 'pointer', fontSize: "17px"}}>@{username}</a> : null
}

export function ProfileList(props) {
    const [didLookUp, setDidLookUp] = useState(false);
    const [profiles, setProfiles] = useState([]);

    const handleBackEndLookUp = (response, status) => {
        if (status === 200) {
            setProfiles(response.results);
            setDidLookUp(true)
        }
    };

    useEffect(() => {
        if (didLookUp === false) {
            apiProfileFollowing(props.username, handleBackEndLookUp)
        }
    });


    return profiles !== undefined ?
        <div className="border rounded p-2 h-auto" style={{width: "598px", height: "700px", overflow: "auto"}}>
            <form className="form-inline mb-1">
                <div className="active-purple-3 form-group-sm active-purple-4 mr-2">
                    <input className="form-control ex input-lg" type="text" name="hash_tag" style={{fontSize: "18px"}}
                           aria-label="Search" placeholder="Search following profiles"/>
                </div>
                <button className="btn btn-outline-primary my-2 my-sm-0"
                        style={{fontFamily: 'Seoge UI', fontSize: "18px"}} type="submit">Search
                </button>
            </form>
            <div className="d-block">{profiles.map((item, index) => {
                return <div className="text-black d-flex ml-2 mb-2">
                    <div className="mt-1 mr-1">
                        <UserAvatarSm user={item}/>
                    </div>
                    <div className="d-block">
                        <ProfileLink username={item.username}/>
                        <p style={{fontSize: "18px"}}>{item.first_name} {item.last_name}</p>
                    </div>

                </div>
            })}</div>
        </div> : null
}

export function ProfileListFollower(props) {
    const [didLookUp, setDidLookUp] = useState(false);
    const [profiles, setProfiles] = useState([]);

    const handleBackEndLookUp = (response, status) => {
        if (status === 200) {
            setProfiles(response.results);
            setDidLookUp(true)
        }
    };

    useEffect(() => {
        if (didLookUp === false) {
            apiProfileFollower(props.username, handleBackEndLookUp)
        }
    });


    return profiles !== undefined ?
        <div className="border rounded p-2 h-auto" style={{width: "598px", height: "700px", overflow: "auto"}}>
            <form className="form-inline mb-1">
                <div className="active-purple-3 form-group-sm active-purple-4 mr-2">
                    <input className="form-control ex input-lg" type="text" name="hash_tag" style={{fontSize: "18px"}}
                           aria-label="Search" placeholder="Search following profiles"/>
                </div>
                <button className="btn btn-outline-primary my-2 my-sm-0"
                        style={{fontFamily: 'Seoge UI', fontSize: "18px"}} type="submit">Search
                </button>
            </form>
            <div className="d-block">{profiles.map((item, index) => {
                return <div className="text-black d-flex ml-2 mb-2">
                    <div className="mt-1 mr-1">
                        <UserAvatarSm user={item}/>
                    </div>
                    <div className="d-block">
                        <ProfileLink username={item.username}/>
                        <p style={{fontSize: "18px"}}>{item.first_name} {item.last_name}</p>
                    </div>
                </div>
            })}</div>
        </div> : null
}


function ChatLine(props) {
    const {username, targetUsername, content} = props;
    console.log("chat", username, targetUsername, content);
    return username !== targetUsername ?
        <div className="w-100 d-inline-flex"><p
            className="w-auto ml-auto px-1 py-1 border rounded" style={{
            fontSize: "15px",
            width: "200px",
            background: "#8bd3dd",
            fontWeight: "500",
            lineHeight: "25px", marginBottom: "17px",
            color: "#172c66"
        }}>{content}</p></div>
        : <div className="w-100 d-inline-flex"><p
            className="w-auto mr-auto border px-1 py-1 rounded" style={{
            fontSize: "15px",
            width: "200px", marginBottom: "17px",
            background: "#faeee7",
            fontWeight: "400",
            lineHeight: "25px",
            color: "#594a4e"
        }}>{content}</p></div>
}

export function ChatComponents(props) {
    const [contentList, setContentList] = useState([]);
    const [didLookUp, setDidLookUp] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [firstLookUp, setFirstDidLookUp] = useState(true);
    const textAreaRef = React.createRef();
    let send = submit ? "sending" : "send";
    const handleBackEndLookUp = (response, status) => {
        if (status === 200) {
            console.log("set-ct", response.results);
            setContentList(response);
            setSubmit(false)

        }
    };


    const handleChatLookUp = (response, status) => {
        console.log("chat-res", response, status)
    };

    // useEffect(() => {
    //     if (didLookUp === false) {
    //         apiChatRoom(props.username, handleBackEndLookUp)
    //     }
    // });

    const handleCancel = () => {
        if (didLookUp === false) {
            setDidLookUp(true)
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newVal = textAreaRef.current.value;
        if (newVal) {
            apiChat(props.username, newVal, handleChatLookUp);
            textAreaRef.current.value = '';
            setSubmit(true)
        }
    };

    useEffect(() => {
        if (firstLookUp === false) {
            const timer = setTimeout(() => {
                apiChatRoom(props.username, handleBackEndLookUp)
            }, 5000);
            return () => clearTimeout(timer);
        }
        if (firstLookUp === true) {
            apiChatRoom(props.username, handleBackEndLookUp);
            setFirstDidLookUp(false)
        }

    });
    console.log("content list", contentList);
    return contentList ? <div className="">
        <div className="ml-0 mb-0 pl-1 position-relative text-left border rounded"
             style={{width: "200px", backgroundColor: "#bae8e8"}}>
            <p className="mx-auto my-auto" style={{
                fontSize: "17px",
                width: "200px",
                fontWeight: "600",
                lineHeight: "25px",
                color: "black"
            }}>Chatting with @{props.username}</p>
        </div>
        <div className="" style={{width: "598px", maxHeight: "500px", minHeight: "0px", overflow: "auto"}}>
            <div className="w-100 p-2 border-left border-right border-bottom form-group rounded"
                 style={{borderTop: "none"}}>{contentList.map((item, index) => {
                return <ChatLine content={item.content} username={item.username} targetUsername={props.username}/>
            })}</div>
        </div>
        <form onSubmit={handleSubmit} className="">
            <div className="form-group mb-1">
                <input ref={textAreaRef} className='form-control required' placeholder="Type your message here"
                       name='tweet'
                       style={{fontSize: "15px", width: "598px"}}>
                </input>
            </div>
            <div className="position-relative text-right" style={{width: "598px"}}>
                <button className="btn btn-primary rounded p-1" style={{fontSize: "17px"}} type="submit">{send}</button>
            </div>
        </form>
    </div> : <p>no data</p>
}

function ChatBoxLink(props) {
    const {username} = props;
    const endpoint = `/chat/${username}`;
    return username !== undefined ?
        <a href={endpoint} style={{
            cursor: 'pointer', fontSize: "17px", textDecoration: "none", fontWeight: "500",
            fontFamily: "system-ui", color: "#8bd3dd",
        }}>@{username}</a> : null
}

export function ProfileMessageList(props) {
    const [didLookUp, setDidLookUp] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const [input, setInput] = useState("");
    const handleBackEndLookUp = (response, status) => {
        console.log("chat-s", response, status);
        if (status === 200) {

            console.log("isProfile",);
            if (response.results[0].user !== undefined) {
                setProfiles(undefined);
            } else {
                setProfiles(response.results);
            }
            setDidLookUp(true)
        }
        if (status === 400) {
            setProfiles(undefined);
        }
    };

    useEffect(() => {
        if (didLookUp === false) {
            apiProfileFollowing(props.username, handleBackEndLookUp)
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        apiHashTagSearch(input, handleBackEndLookUp)
    };

    return <div className="border rounded p-2 h-auto" style={{width: "598px", maxHeight: "1000px", overflow: "auto"}}>
        <div className=" text-center  position-relative">
            <div className="d-inline-block">
                <form className="form-inline  mb-3" onSubmit={handleSubmit}>
                    <div className="active-purple-3 form-group-sm active-purple-4 mr-2">
                        <input onChange={e => setInput(e.target.value)} className="form-control ex input-lg"
                               type="text"
                               name="hash_tag" style={{fontSize: "18px"}}
                               aria-label="Search" placeholder="Search profiles"/>
                    </div>
                    <button className="btn btn-outline-primary my-2 my-sm-0"
                            style={{fontFamily: 'Seoge UI', fontSize: "18px"}} type="submit">Search
                    </button>
                </form>
            </div>
        </div>
        {profiles !== undefined ?
            <div className="d-block">{profiles.map((item, index) => {
                return <div className="text-black d-flex ml-2 mb-2">
                    <div className="pt-1 mr-1">
                        <UserAvatarSm user={item}/>
                    </div>
                    <div className="d-block">
                        <ChatBoxLink username={item.username}/>
                        <p style={{
                            fontSize: "18px",
                            fontFamily: "system-ui",
                            fontWeight: "500"
                        }}>{item.first_name} {item.last_name}</p>
                    </div>
                </div>
            })}</div> : null}
    </div>
}


