import React, {useState} from "react";
import {getBase64Image} from "../../profile/badge";
import {apiTweetCreate} from "../lookup";
import {TweetList} from "../list";

export function HandleCreateAndListComponent(props) {
    console.log(props);
    // ...props === username
    const {username} = props;
    const {didTweet} = props;
    const [isSuccess, setIsSuccess] = useState(false);
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
        setTweet("Uploading");
        console.log("new-tw", newVal.length);
        console.log("new-hash", newHashTag);
        let base64 = getBase64Image(document.getElementById("up"));
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
        <img id="up" className="d-none" src={dataUrl}/>
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
                <input ref={inpFileRef} type="file" style={{fontSize: "15px", color: "#6f6f6f"}} accept="image/*"
                       onChange={onSelectFile}/>
            </form>
            <textarea ref={textAreaRef} rows="1" className='form-control mb-0 rounded-pill required w-50' name='tweet'
                      style={{fontSize: "15px"}}>
            </textarea>
            <button className='btn btn-sm btn-primary my-1 ml-auto rounded-pill mr-2 ml-auto'>{tweet}</button>
        </form>
        <TweetList new={newVal}/>
    </div>
}