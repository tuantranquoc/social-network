import React, {useEffect, useState} from "react";
import {getBase64Image} from "../../profile/badge";
import {apiCommunityFeed, apiTweetBookmark, apiTweetCreate, apiTweetFeed} from "../lookup";
import {Tweet} from "../detail";

export function HandleCreateAndCommunityComponent(props) {
    console.log("co-", props.community);
    // ...props === username
    const {username} = props;
    const {didTweet} = props;
    const [selected, setSelected] = useState("selected");
    const [select, setSelect] = useState([]);
    const [state, setState] = useState([]);
    const [tweet, setTweet] = useState("Tweet");
    const [dataUrl, setDataUrl] = useState(null);
    const [picture, setPicture] = useState(null);
    const [newVal, setNewVal] = useState([]);
    const className = "";
    let arr = [];
    const textAreaRef = React.createRef();
    const inpFileRef = React.createRef();
    const hashTag = React.createRef();
    const selectOptionRef = React.createRef();


    const handleSubmit = (event) => {
        event.preventDefault();
        const newVal = textAreaRef.current.value;
        const newHashTag = hashTag.current.value;
        setTweet("Uploading")
        console.log("new-tw", newVal.length);
        console.log("new-hash", newHashTag);
        let base64 = getBase64Image(document.getElementById("up-community"));
        const data = {"img": base64};
        apiTweetCreate(newVal, select, newHashTag, base64, handleBackendUpDate);

        textAreaRef.current.value = '';
        inpFileRef.current.value = '';
        hashTag.current.value = '';
        arr = [];
        setDataUrl(null)
        setSelect([]);
    };


    const handleChange = (event) => {
        event.preventDefault();
        //  setSelected();
        const newStr = event.target.value;
        console.log('opt', newStr);
        let newSelect = [...select].concat(newStr);
        setSelect(newSelect);
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


    const handleBackendUpDate = (response, status) => {
        console.log("res-ava", response, status);
        if (status === 201) {
            setTweet("Success");
            setNewVal(response)
        }
    };

    return <div className="ml-2">
        <img id="up-community" className="d-none" src={dataUrl}/>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className='mr-2' style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    lineHeight: "20px",
                    color: "#14171a"
                }}>Community</label>
                <select onChange={handleChange} id='select-community' ref={selectOptionRef} className="selectpicker"
                        data-max-options="3"
                        style={{fontSize: "17px", fontWeight: "700", lineHeight: "20px", color: "#14171a"}}>
                    <option style={{fontSize: "15px", fontWeight: "700", lineHeight: "20px", color: "#14171a"}}
                            value="Default"
                            selected={selected} disabled>Please select
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
                <input ref={inpFileRef} type="file" style={{fontSize: "15px", color: "#6f6f6f"}} accept="image/*"
                       onChange={onSelectFile}/>
            </form>
            <textarea ref={textAreaRef} rows="1" className='form-control mb-0 rounded-pill required w-50' name='tweet'
                      style={{fontSize: "15px"}}>
            </textarea>
            <button className='btn btn-sm btn-primary my-1 ml-auto rounded-pill mr-2 ml-auto'>{tweet}</button>
        </form>
        <CommunityFeedList new={newVal} community={props.community}/>
    </div>
}


export function CommunityFeedList(props) {
    console.log("we are here", props.community);
    const [tweetsInit, setTweetsInit] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [preUrl, setPreUrl] = useState(null);
    const [tweetsDidCall, setTweetsDidCall] = useState(false);
    console.log("communityType", props.community);


    useEffect(() => {
        if (props.new !== undefined) {
            if (props.new.id !== undefined) {
                if (props.new.id !== tweets[0]) {
                    console.log("new tweet", props.new);
                    let newTweet = props.new;
                    let avatar = newTweet.user.avatar;
                    let background = newTweet.user.background;
                    let image = newTweet.image;
                    if (avatar.includes('k02q') === false) {
                        avatar = 'https://k02q.herokuapp.com' + avatar;
                        background = 'https://k02q.herokuapp.com' + background;
                        if (image !== null) {
                            image = 'https://k02q.herokuapp.com' + image;
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
            console.log("co--", props.community);
            if (props.community !== undefined) {
                const handleTweetLookup = (response, status) => {
                    console.log("communitySt", response);
                    if (status === 200) {
                        setNextUrl(response.next);
                        setTweetsInit(response.results);
                        setTweetsDidCall(true);
                        setTweets(response.results)
                    }
                };
                apiCommunityFeed(props.community, handleTweetLookup);
            }
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

     const handleReTweet = (newTweet) => {
        console.log("newRetweet-rev", newTweet);
        let avatar = newTweet.user.avatar;
        let background = newTweet.user.background;
        let image = newTweet.image;
        if (avatar.includes('k02q') === false) {
            avatar = 'https://k02q.herokuapp.com' + avatar;
            background = 'https://k02q.herokuapp.com' + background;
            if (image !== null) {
                image = 'https://k02q.herokuapp.com' + image;
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
        if (avatar.includes('k02q') === false) {
            avatar = 'https://k02q.herokuapp.com' + avatar;
            background = 'https://k02q.herokuapp.com' + background;
            if (image !== null) {
                image = 'https://k02q.herokuapp.com' + image;
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
                    setNextUrl(response.next);
                    setTweetsInit(response.results);
                    const final = [...tweets].concat(response.results);
                    setTweets(final);
                    setTweetsInit(final)
                }
            };
            apiCommunityFeed(props.community, handleLoadNextResponse, nextUrl)
        }
    };


    console.log("list: ", tweets);
    return <React.Fragment>{tweets.map((item, index) => {
        return <Tweet
            tweet={item}
            didRetweet={handleDidRetweet}
            reTweet={handleReTweet}
            className="my-3 mt-0 mb-0 py-2 pt-3 border-top border-bottom border-left border-right"
            key={`${index}-{item.id}`}/>
    })}{nextUrl !== null &&
    <button onClick={handleLoadNext} className='btn btn-outline-primary'>Load Next</button>}</React.Fragment>
}