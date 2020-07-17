import React, {useEffect, useState, Component} from "react";
import {
    apiTweetCreate,
    apiCommentCreate,
    apiCommentList,
    apiChildCommentCreate,
    apiParentCommentList,
    apiTweetDetail, apiTweetCommunityCreate
} from "./lookup";
import {AllowComment, AllowChildComment, callAllowChildComment} from "./detail";
import {getBase64Image, getCookie} from "../profile/badge";
import Select from 'react-select';
import $ from 'jquery';
import {findDOMNode} from "react-dom";
import {File} from "../profile/badge";
import {apiProfileAvatarEdit, apiProfileBackgroundEdit} from "../profile/lookup";

const pSm = {
    fontSize: "15px", fontWeight: "400", lineHeight: "20px", color: "#657786",
};

export function TweetCreate(props) {
    console.log(props);
    // ...props === username
    const {username} = props;
    const {didTweet} = props;
    const [isSuccess, setIsSuccess] = useState(false);
    const [state, setState] = useState([]);
    const [dataUrl, setDataUrl] = useState(null);
    const [picture, setPicture] = useState(null);
    const className = "";
    let arr = [];
    const textAreaRef = React.createRef();
    const inpFileRef = React.createRef();
    const hashTag = React.createRef();
    const selectOptionRef = React.createRef();
    const handleBackEndUpdate =
        (response, status) => {
            // backend api response
            if (status === 201) {
                console.log("create", response.id);
                console.log("cur-state", state);
                // apiTweetCommunityCreate(arr, response.id, handleBackEndUpdate);
                if (state !== undefined) {
                    const formData = new FormData();
                    formData.append("img", state);
                    const endpoint = `https://k01q.herokuapp.com/api/tweets/create/image/${response.id}`;
                    const csrftoken = getCookie('csrftoken');
                    console.log("csrfToken", csrftoken);
                    fetch(endpoint, {
                        method: "post",
                        headers: {
                            "X-CSRFToken": csrftoken
                        },
                        body: formData
                    }).then(response => handleImageUpload(response, response.status)).catch(console.error);
                    // backend api request
                    console.log("new image", formData)
                }
                if (isSuccess === false) {
                    didTweet(response);
                }
            }
            if (status === 200) {
                console.log("create-c", response);
            }
        };

    const handleImageUpload = (response, status) => {
        if (status === 200) {
            setIsSuccess(true);
            didTweet(response);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newVal = textAreaRef.current.value;
        const newHashTag = hashTag.current.value;

        console.log("new-tw", newVal.length);
        console.log("new-hash", newHashTag);
        let base64 = getBase64Image(document.getElementById("down"));
        const data = {"img": base64};
        apiTweetCreate(newVal, arr, newHashTag, base64, handleBackendUpDate);
        textAreaRef.current.value = '';
    };


    const handleImgSubmit = (event) => {
        event.preventDefault();
        const newVal = textAreaRef.current.value;
        const myForm = document.getElementById('tweetForm');
        const intFile = document.getElementById('tweetImg');
        const intsFile = document.getElementById('Img');
        const formData = new FormData();
        console.log("ele-file", intsFile.files);
        console.log("int file", intFile.files);
        console.log("img", intFile.files[0]);
        formData.append("img", intFile.files[0]);
        // const endpoint = `http://localhost:8000/api/profiles/upload/he/`;
        // const csrftoken = getCookie('csrftoken');
        // console.log("csrfToken", csrftoken);
        // fetch(endpoint, {
        //     method: "post",
        //     headers: {
        //         "X-CSRFToken": csrftoken
        //     },
        //     body: formData
        // }).catch(console.error);
        // // backend api request
        // console.log("new image", formData)
    };

    const handleChange = (event) => {
        event.preventDefault();
        const newStr = event.target.value;
        console.log('opt', newStr);

        if (arr.includes(newStr)) {
        } else {
            arr.push(newStr)
        }
        console.log("opt arr", arr)
    };


    const onSelectFile = (event) => {
        event.preventDefault();
        if (event.target.files && event.target.files.length > 0) {
            console.log("file-pre", event.target.files);
            setState(event.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setDataUrl(reader.result);
            });
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleBackgroundUpDate = (response, status) => {
        console.log("res-ava", response, status);
        if (status === 201) {
            let base64 = getBase64Image(document.getElementById("down"));
            const data = {"img": base64};
            apiProfileBackgroundEdit(data, handleBackendUpDate);
        }
    };

    const handleBackendUpDate = (response, status) => {
        console.log("res-ava", response, status);
        if (status === 201) {
            didTweet(response);
        }
    };

    // const handleSubmitE = (event) => {
    //     setDidCall(true);
    //     setState("uploading");
    //     event.preventDefault();
    //     console.log("img-avatar", document.getElementById("down"));
    //     var base64 = getBase64Image(document.getElementById("down"));
    //     console.log("result-b", base64);
    //     const data = {"img": base64};
    //
    //     //   formData.append("blob", props.image, "textFile.jpg");
    //     const endpoint = `http://localhost:8000/api/profiles/upload/avatar/`;
    //     const csrftoken = getCookie('csrftoken');
    //     console.log("csrfToken", csrftoken);
    //     apiProfileAvatarEdit(data, handleBackendUpDate);
    //     // backend api request
    // };


    return <div className="ml-2">
        <img id="down" className="d-none" src={dataUrl}/>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className='mr-2' style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    lineHeight: "20px",
                    color: "#14171a"
                }}>Community</label>
                <select onChange={handleChange} id='select' ref={selectOptionRef} className="selectpicker"
                        data-max-options="3"
                        style={{fontSize: "17px", fontWeight: "700", lineHeight: "20px", color: "#14171a"}}>
                    <option style={{fontSize: "15px", fontWeight: "700", lineHeight: "20px", color: "#14171a"}} value=""
                            selected disabled>Please select
                    </option>
                    <option style={{fontSize: "15px", fontWeight: "700", lineHeight: "20px", color: "#657786"}}
                            value='news'>News
                    </option>
                    <option style={{fontSize: "15px", fontWeight: "700", lineHeight: "20px", color: "#657786"}}
                            value='anime'>Anime
                    </option>
                    <option style={{fontSize: "15px", fontWeight: "700", lineHeight: "20px", color: "#657786"}}
                            value='art & design'>Art & Design
                    </option>
                    <option style={{fontSize: "15px", fontWeight: "700", lineHeight: "20px", color: "#657786"}}
                            value='music'>Music
                    </option>
                    <option style={{fontSize: "15px", fontWeight: "700", lineHeight: "20px", color: "#657786"}}
                            value='animals & pets'>Animals & Pets
                    </option>
                </select>
            </div>
            <input ref={hashTag} className='form-control rounded required w-50 h-50 mb-1' size="10"
                   pattern="[A-Za-z-#]{1,25}" maxLength="25" type="text"
                   title="No special character, no space" style={{fontSize: "15px"}} name='tweet'>
            </input>
            <form className="ml-2 mb-1" onSubmit={handleSubmit} encType="multipart/form-data">
                <label className="mr-2" style={{fontSize: "15px"}}>Upload file here</label>
                <input type="file" style={{fontSize: "15px", color: "#6f6f6f"}} accept="image/*"
                       onChange={onSelectFile}/>
            </form>
            <textarea ref={textAreaRef} rows="1" className='form-control mb-0 rounded-pill required w-50' name='tweet'
                      style={{fontSize: "15px"}}>
            </textarea>
            <button className='btn btn-sm btn-primary my-1 ml-auto rounded-pill mr-2 ml-auto'>Tweet</button>
        </form>
    </div>
}


export function CommentCreate(props) {
    // ...props === username
    const [showResults, setShowResults] = useState(false);
    const {tweetId} = props;
    const {didComment} = props;

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState([]);
    const [didLookup, setDidLookUp] = useState(false);
    const [newComments, setNewComments] = useState(false);
    const textAreaRef = React.createRef();

    console.log("tweetId: ", tweetId);
    const handleBackEndUpdate =
        (response, status) => {
            // backend api response
            if (status === 201) {
                //   didComment(response);
                setNewComment(response[0].content);
                setNewComments(true);
            }
        };
    let dict = {};
    const handleResultAsDict = (key, value) => {
        dict[key] = value;
        console.log("dict", dict[key], key)
    };


    const callAllowChildComment = (commentId) => {
        console.log("called", commentId)
        return <callAllowChildComment commentId={commentId}/>
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const newVal = textAreaRef.current.value;
        // backend api request
        apiCommentCreate(tweetId, newVal, handleBackEndUpdate);
        textAreaRef.current.value = '';
    };

    const handleBackEndLookUp = (response, status) => {
        if (status === 200) {
            setComments(response);
            console.log("username:response", response)
        }
    };

    useEffect(() => {
        if (didLookup === false) {
            apiCommentList(tweetId, handleBackEndLookUp);
            setDidLookUp(true)
        }
    }, [tweetId, didLookup, setDidLookUp]);
    const onCommentClick = (event) => {
        event.preventDefault();
        if (setShowResults !== true) {
            console.log("set show result 1", showResults);
            setShowResults(true);
        }
    };
    useEffect(() => {
        console.log("we has new comment", newComments);
        if (newComments === true) {
            apiCommentList(tweetId, handleBackEndLookUp);
            console.log("new comments list inside", comments);
            setNewComments(false)
        }
    }, [tweetId, newComments, setNewComments]);
    console.log("username:newComment", newComment);
    console.log("new comments list outside", comments);
    return <div>
        <div className='text-left mb-2'>{comments.map((item, index) => {
            return <React.Fragment>
                <div className=''>
                    <li className='mb-1 pl-1'
                        style={pSm}>@{item.username} reply: {item.content} {handleResultAsDict(index, false)}</li>
                    <AllowChildComment commentId={item.id} showResult={showResults} result={dict[index]}/>
                </div>
            </React.Fragment>
        })}</div>
        <div className={props.className}>
            <form onSubmit={handleSubmit}>
                <textarea ref={textAreaRef} rows="1" className='form-control p-1' style={{fontSize: "15px"}}
                          name='tweet'>
                </textarea>
                <button className='btn btn-primary mt-1 mr-2' style={{fontSize: "15px"}}>Comment</button>
            </form>
        </div>
    </div>
}

export function CommentChildCreate(props) {
    // ...props === username
    const [showResults, setShowResults] = useState(false);
    const {commentId, showResult} = props;
    const {didComment} = props;
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState([]);
    const [didLookup, setDidLookUp] = useState(false);
    const [newComments, setNewComments] = useState(false);
    const textAreaRef = React.createRef();

    console.log("commentId: ", commentId);
    console.log("currentChildComment: ", comments);
    const handleBackEndUpdate =
        (response, status) => {
            console.log("child create status", status);
            // backend api response
            if (status === 201) {
                //   didComment(response);
                console.log("child create response", response);
                setNewComment(response.content);
                setNewComments(true);
            }
        };
    const handleSubmit = (event) => {
        event.preventDefault();
        const newVal = textAreaRef.current.value;
        // backend api request
        apiChildCommentCreate(commentId, newVal, handleBackEndUpdate);
        textAreaRef.current.value = '';
    };

    const handleBackEndLookUp = (response, status) => {
        console.log("child status", status);
        if (status === 200) {
            setComments(response);
            console.log("child status", status)
        }
    };

    useEffect(() => {
        console.log("didlook", commentId);
        if (didLookup === false) {
            console.log("we in here", commentId);
            apiParentCommentList(commentId, handleBackEndLookUp);
            setDidLookUp(true)
        }
    }, [commentId, didLookup, setDidLookUp]);

    useEffect(() => {
        console.log("did set", showResults);
        if (showResults === false) {
            setShowResults(true)
        }
    }, []);

    const onCommentClick = (event) => {
        event.preventDefault();
        if (setShowResults)
            setShowResults(false);
        setShowResults(true);
    };

    useEffect(() => {

        if (newComments === true) {
            apiParentCommentList(commentId, handleBackEndLookUp);
            console.log("new comments list inside", comments);
            setNewComments(false)
        }
    }, [commentId, newComments, setNewComments]);
    console.log("child showResult 01", showResults);
    return <div className='rounded-circle'>
        {showResult && <div className='text-left'>{comments.map((item, index) => {
            return <React.Fragment>
                <li className='mb-1' style={pSm}>@{item.username} said: {item.content}</li>
            </React.Fragment>
        })}
        </div>}
        {showResult && <div className={props.className}>
            <form onSubmit={handleSubmit}>
                <textarea ref={textAreaRef} rows="1" style={pSm} className='form-control' name='tweet'>
                </textarea>
                <div className=" text-right position-relative">
                    <button className='btn btn-primary my-1 mr-2 px-1 py-0 position-relative'
                            style={{fontSize: "15px",}}>send
                    </button>
                </div>

            </form>
        </div>}
    </div>
}

function SelectOptionCount(props) {
    const [count, setCount] = useState(0);
    const [str, setStr] = useState("1");
    const [didLookup, setDidLookUp] = useState(false);
    let arr = [];


    const handleChange = (event) => {
        event.preventDefault();
        const newStr = event.target.value;
        console.log('opt', newStr);

        if (arr.includes(newStr)) {
        } else {
            arr.push(newStr)
        }
        console.log("opt arr", arr)
    };

    const handleBackendLookUp = (response, status) => {
        if (status === 200) {
            console.log("set tweet", response);
        } else {
            alert("There was an error finding your tweet! TweetDetailComponent!")
        }
    };

    return <div>
        <textarea>{count}</textarea>
        <select onChange={handleChange} className="selectpicker"
                data-max-options="3">
            <option value="" selected disabled>Please select</option>
            <option value='1'>News</option>
            <option value='2'>Anime</option>
            <option value='3'>Art & Design</option>
        </select></div>
}