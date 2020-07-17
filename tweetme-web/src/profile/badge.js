import React, {PureComponent, useEffect, useState} from "react";
import {apiProfileAvatarEdit, apiProfileDetail, apiProfileFollowToggle} from "./lookup";
import {UserAvatar, UserPicture} from "./profile_components";
import {DisplayCount} from "./utils";
import 'cropperjs/dist/cropper.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Popup from "reactjs-popup";
import Examples from "../nav/popup";

const pSm = {
    fontSize: "15px", fontWeight: "400", lineHeight: "20px", color: "#657786",
};

function GetCropImage(props) {
    const {imageCrop} = props;
    const [image, setImage] = useState([]);
    const [didCall, setDidCall] = useState(false);
    const [state, setState] = useState("upload");
    let Upload = !didCall ? "upload" : "uploading";
    useEffect(() => {
        if (didCall === false) {
            console.log("set-img-", props.image);

            //    setImage(answer_array[1]);
            setImage(props.image);
            console.log("img", props.image)
        }
    });
    const handleBackendUpDate = (response, status) => {
        console.log("res-ava", response, status);
        if (status === 200) {
            setState("upload success")
        }
    };
    const handleSubmit = (event) => {
        setDidCall(true);
        setState("uploading");
        event.preventDefault();
        console.log("img-avatar", document.getElementById("down"));
        var base64 = getBase64Image(document.getElementById("down"));
        console.log("result-b", base64);
        const data = {"img": base64};

        //   formData.append("blob", props.image, "textFile.jpg");
        const endpoint = `https://k01q.herokuapp.com/api/profiles/upload/avatar/`;
        const csrftoken = getCookie('csrftoken');
        console.log("csrfToken", csrftoken);
        apiProfileAvatarEdit(data, handleBackendUpDate);
        // backend api request
    };
    console.log("cropped-via", image);
    return <div>
        <img id="down" className="d-none" src={image}/>
        <button className="btn mt-1 btn-outline-success p-1 px-2 mb-2 ml-auto" style={{fontSize: "15px"}}
                onClick={handleSubmit}>{state}
        </button>
    </div>
}

export class CropImage extends PureComponent {
    state = {
        src: null,
        crop: {
            unit: '%',
            width: 50,
            height: 50,
            aspect: 20 / 9,
            x: 25, y: 25,
        },
    };
    toggle = false;

    cancelDiv = e => {
        this.toggle = false;
        console.log("tog-change", this.toggle)
    };

    onSelectFile = e => {
        this.toggle = true;
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({src: reader.result})
            );
            console.log("cropped", "selected");
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // If you setState the crop in here you should return false.
    onImageLoaded = image => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        console.log("cropped", crop);

        this.setState({crop});
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'newFile.jpeg'
            );
            console.log("cropped-img-ref", this.imageRef);
            console.log("cropped-img-cr", croppedImageUrl);
            this.setState({croppedImageUrl});
        }
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, 'image/jpeg');
        });
    }

// <img alt="Crop" style={{maxWidth: '100%'}} src={croppedImageUrl}/>
    render() {
        const {crop, croppedImageUrl, src} = this.state;
        if (croppedImageUrl) {
            console.log("cropped", this.imageRef)
        }
        return (
            <div>
                <input type="file" style={{fontSize: "15px", color: "#6f6f6f"}} accept="image/*"
                       onChange={this.onSelectFile}/>
                {croppedImageUrl && (
                    <div>
                        <GetCropImage image={croppedImageUrl}/>
                    </div>
                )}
                <div className=""
                     style={{width: "1000px", height: "1000px"}}>

                    {src && (
                        <ReactCrop className="invisible" style={{maxWidth: "600px", maxHeight: "400px"}}
                                   src={src}
                                   crop={crop}
                                   ruleOfThirds
                                   onImageLoaded={this.onImageLoaded}
                                   onComplete={this.onCropComplete}
                                   onChange={this.onCropChange}
                        />)}
                </div>
            </div>
        );
    }
}

// ReactDOM.render(<CropImage/>, document.getElementById('crop'));


function ProfileLink(props) {
    const {username} = props;
    const endpoint = `/profile/${username}/following`;
    console.log("endpoint", endpoint, username);
    return username !== undefined ?
        <a href={endpoint} style={{cursor: 'pointer', color: "#657786"}}>Following</a> : null
}

function ProfileFollowerLink(props) {
    const {username} = props;
    const endpoint = `/profile/${username}/follower`;
    console.log("endpoint", endpoint, username);
    return username !== undefined ?
        <a href={endpoint} style={{cursor: 'pointer', color: "#657786"}}>{props.follow}</a> : null
}

function ProfileBadge(props) {
    const [hovered, setHovered] = useState(false);
    const [crop, setCrop] = useState({aspect: 16 / 9});
    const [allow, setAllow] = useState(false);
    const [upload, setUpload] = useState("Upload");
    const {user, didFollowToggle, profileLoading} = props;
    let currentVerb = (user && user.is_following) ? "UnFollow" : "Follow";
    currentVerb = profileLoading ? "Loading..." : currentVerb;
    const toggleHover = () => setHovered(!hovered);
    const textAreaRef = React.createRef();
    console.log("user-profile",user);
    let allowUpdate = false;
    if (props.username) {
        if (props.username === props.target) {
            console.log("eq");
            allowUpdate = true;
        }
    }

    console.log("username:verb", currentVerb);
    const handleFollowToggle = (event) => {
        console.log(event);
        event.preventDefault();
        if (didFollowToggle && !profileLoading) {
            didFollowToggle(currentVerb)
        }
    };

    const handleBackendLookUp = (status) => {
        if (status === 200) {
            setUpload("Success");
        }
    };
    const style = {
        maxWidth: "109px",
        backgroundColor: "#ffffff",
        maxHeight: "39px",
    };
    let currentColor = "blue";
    const newBackground = (style) => {
        if (currentVerb === "UnFollow") {
            currentColor = "#be1931";
        }
        if (currentVerb === "Follow") {
            currentColor = "#1da1f2";
        }
        console.log("old style", style);
        let newStyle = {
            width: style.width,
            backgroundColor: currentColor,
            maxHeight: "39px", color: "#ffffff",
            fontSize: "15px", lineHeight: "25px", weight: "400",
        };
        console.log("new style", style);
        return newStyle;
    };

    const oldBackground = (style) => {
        let newStyle = {
            width: style.width,
            backgroundColor: "#ffffff",
            maxHeight: "39px",
            color: "#1da1f2",
            fontSize: "15px", lineHeight: "25px", weight: "400",
        };
        return newStyle;
    };

    const handleInputChange = (event) => {
        event.preventDefault();
        setUpload("Upload")
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setUpload("Uploading");
        const myForm = document.getElementById('myForm');
        const intFile = document.getElementById('inpFile');
        const formData = new FormData();
        console.log("ele", intFile);
        console.log("int file", intFile.files);
        console.log("img", intFile.files[0]);
        formData.append("img", intFile.files[0]);
        const endpoint = `https://k01q.herokuapp.com/api/profiles/upload/he/`;
        const csrftoken = getCookie('csrftoken');
        console.log("csrfToken", csrftoken);
        fetch(endpoint, {
            method: "post",
            headers: {
                "X-CSRFToken": csrftoken
            },
            body: formData
        }).then(response => handleBackendLookUp(response.status)).catch(console.error);
        // backend api request
        console.log("new image", formData)
    };

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     console.log("img-background", document.getElementById("inpFile"))
    //     let fileList = document.getElementById("inpFile")
    //     console.log("img-b", fileList.files[0]);
    //     const file = fileList.files[0];
    //     setUpload("uploading");
    //
    //     var base64 = getBase64Image(file);
    //     console.log("result-b", base64);
    //     const data = {"img": base64};
    //
    //     //   formData.append("blob", props.image, "textFile.jpg");
    //     const endpoint = `http://localhost:8000/api/profiles/upload/avatar/`;
    //     const csrftoken = getCookie('csrftoken');
    //     console.log("csrfToken", csrftoken);
    //     apiProfileAvatarEdit(data, handleBackendUpDate);
    // };

    const whiteB = {
        backgroundColor: "white",
        maxWidth: "250px",
        border: "1px",
        borderColor: "black",
    };

    return user ? <div>
        <div className='mb-2 mt-2' style={{width: "598px", height: "256px"}}>
            <img src={user.background} className="w-100 rounded h-100" alt="user-background"/>
        </div>
        <div className='d-block position-relative'>
            <div className="pl-3 row align-items-center d-inline-flex"
                 style={{marginTop: "-5%", marginLeft: "", width: "598px"}}>
                <div className="d-inline-flex" style={{marginTop: "-55px"}}>
                    <UserAvatar user={user}/>

                    {allowUpdate === true ? <Examples/> : null}
                </div>

                {allowUpdate === true ?
                    <form className="ml-auto border" id='myForm' style={{marginRight: "17%", marginTop: "50px"}}
                          onSubmit={handleSubmit}
                          encType="multipart/form-data">
                        <input onChange={handleInputChange} className="border pr-1 mr-2" id='inpFile' style={{
                            fontSize: "15px",
                            width: "200px",
                            background: "#ffffff",
                            fontWeight: "400",
                            lineHeight: "20px",
                            color: "#14171a"
                        }}
                               type="file" name='image'/>
                        <button className="btn btn-outline-success px-1 py-0" style={{fontSize: "15px"}}
                                type='submit'>{upload}
                        </button>
                    </form> : null}
            </div>


        </div>
        <div className="ml-2">
            <p className="mb-0" style={{
                fontSize: "19px",
                fontWeight: "800",
                lineHeight: "25px",
                color: "#14171a"
            }}>{user.first_name} {user.last_name}</p>
            <p className=" mb-0"
               style={{fontSize: "15px", fontWeight: "400", lineHeight: "20px", color: "#657786"}}>@{user.username}</p>
            <p className=' mb-0'
               style={{fontSize: "15px", fontWeight: "400", lineHeight: "20px", color: "#14171a"}}>bio: {user.bio}</p>
            <p className='mb-0' style={{
                fontSize: "15px",
                fontWeight: "400",
                lineHeight: "20px",
                color: "#14171a"
            }}>location: {user.location}</p>
            <p className='mb-0' style={{
                fontSize: "15px",
                fontWeight: "400",
                lineHeight: "20px",
                color: "#14171a"
            }}>Joined: {user.timestamp}</p>
            <div className='d-flex'>
                <p className='mr-3 mb-1' style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    lineHeight: "20px",
                    color: "#14171a"
                }}>
                    <DisplayCount>{user.follower_count}</DisplayCount> {user.follower_count === 1 ?
                    <ProfileFollowerLink username={user.username} follow={"Follower"}/>
                    : <ProfileFollowerLink username={user.username} follow={"Followers"}/>}
                </p>
                <p className='mb-1' style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    lineHeight: "20px",
                    color: "#14171a"
                }}><DisplayCount>{user.following_count}</DisplayCount> <ProfileLink username={user.username}/></p>
            </div>
        </div>


        <button className='btn text-center  btn-outline-primary ml-2'
                style={hovered ? newBackground(style) : oldBackground(style)}
                onMouseEnter={toggleHover}
                onMouseLeave={toggleHover} onClick={handleFollowToggle}>{currentVerb}</button>
    </div> : null
}

export function ProfileBadgeComponent(props) {
    const target = props.target;
    const username = props.username;
    console.log("props", props, props.target, username);
    const [didLookup, setDidLookUp] = useState(false);
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const handleBackendLookUp = (response, status) => {
        if (status === 200) {
            console.log("username:res", response);
            setProfile(response)
        }
    };


    useEffect(() => {
        if (didLookup === false) {
            apiProfileDetail(username, handleBackendLookUp);
            setDidLookUp(true)
        }
    }, [target, didLookup, setDidLookUp]);

    const handleNewFollow = (actionVerb) => {
        apiProfileFollowToggle(username, actionVerb, (_response, status) => {
            console.log("username:res", _response, status);
            if (status === 200) {
                setProfile(_response)
                //  apiProfileDetail(username,handleBackendLookUp)
            }
            setProfileLoading(false)
        });
        setProfileLoading(true);
    };
    return didLookup === false ? "Loading..." : profile ?
        <ProfileBadge target={target} username={username} user={profile} didFollowToggle={handleNewFollow}
                      profileLoading={profileLoading}/> : null
}


export function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

export function File(props) {
    const {user} = props;
    const [state, setState] = useState([]);
    console.log("user-file", user);
    const handleSubmit = (event) => {

        const myForm = document.getElementById('myForm01');
        const intFile = document.getElementById('ex1');
        const formData = new FormData();
        console.log("int file", state);
        console.log("img", intFile.files[0]);
        formData.append("img", intFile.files[0]);
        const endpoint = `https://k01q.herokuapp.com/api/profiles/upload/avatar/`;
        const csrftoken = getCookie('csrftoken');
        console.log("csrfToken", csrftoken);
        fetch(endpoint, {
            method: "post",
            headers: {
                "X-CSRFToken": csrftoken
            },
            body: formData
        }).catch(console.error);
        // backend api request
        console.log("new image", formData)
    };

    const onSelectFile = (event) => {
        event.preventDefault();
        if (event.target.files && event.target.files.length > 0) {
            console.log("file-pre", event.target.files);
            setState(event.target.files[0])
        }
    };

    const handleClick = (event) => {
        event.preventDefault();
        console.log("file-pre-sub", state)
    };
    return user ? <div>
        <form className="ml-5" onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="file" style={{fontSize: "15px", color: "#6f6f6f"}} accept="image/*"
                   onChange={onSelectFile}/>
            <button type="submit">up</button>
        </form>
    </div> : <p>hello world</p>
}
