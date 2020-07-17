import React, {useEffect, useState} from "react";
import {apiEditProfile} from "./lookup";
import {apiProfileDetail} from "../profile/lookup";
import dream from "./dream-girl-2.jpg";


export function EditComponent(props) {
    const usernameAreaRef = React.createRef();
    const passwordAreaRef = React.createRef();
    const bioAreaRef = React.createRef();
    const [state, setState] = useState(false);
    const [didCall, setDidCall] = useState(false);
    const [profile, setProfile] = useState([]);
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");


    const style = {
        fontSize: "17px",
        width: "200px",
        background: "#ffffff",
        fontWeight: "600",
        lineHeight: "25px",
        color: "black",
    };

    const inputStyle = {
        fontSize: "15px",
        fontWeight: "400",
        lineHeight: "20px",
        color: "black",
    };


    const handleProfileLookup = (response, status) => {
        console.log("status", status);
        if (status === 200) {
            setProfile(response);
            setUsername(response.username);
            setEmail(response.email);
            setFirstName(response.first_name);
            setLastName(response.last_name);
            setLocation(response.location);
            setBio(response.bio);
            setDidCall(true);
            console.log("profile", response.username, status)
        }
    };

    useEffect(() => {
        if (didCall === false) {
            apiProfileDetail(props.username, handleProfileLookup);

            console.log("profile-u", username, profile.username)
        }
    });


    const handleBackendLookup = (response, status) => {
        console.log("status", status);
        if (status === 200) {
            console.log("updated")
            setState(true);
        }
        if (status === 404) {
            setState(false)
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();

        apiEditProfile(firstName, lastName, location, email, bio, handleBackendLookup);
    };

    return <div className="d-inline-flex">
        <div className="" style={{marginRight: "50px", marginTop: "10px",marginLeft:"10px"}}>
            <img className="rounded" src={dream} style={{maxWidth: "598px", maxHeight: "540px"}}/>
        </div>
        <div style={{width: "498px", marginTop: "10px",marginLeft:"10px"}}>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label style={style}>First Name</label>
                    <input style={inputStyle}
                           value={firstName} type="text" name="first_name"
                           className="form-control "
                           onChange={e => setFirstName(e.target.value)}
                           placeholder="Enter last name">
                    </input>
                </div>
                <div className="form-group">
                    <label style={style}>Last Name</label>
                    <input style={inputStyle}
                           value={lastName} type="text" name="last_name"
                           className="form-control "
                           onChange={e => setLastName(e.target.value)}
                           placeholder="Enter last name">
                    </input>
                </div>
                <div className="form-group">
                    <label style={style}>Location</label>
                    <input style={inputStyle}
                           value={location} type="text" name="location"
                           className="form-control"
                           onChange={e => setLocation(e.target.value)}
                           placeholder="Enter location name">
                    </input>
                </div>
                <div className="form-group">
                    <label style={style}>Email</label>
                    <input ref={usernameAreaRef} style={inputStyle}
                           value={email} type="text" name="email"
                           onChange={e => setEmail(e.target.value)}
                           className="form-control"
                           placeholder="Enter your email">
                    </input>
                </div>
                <div className="form-group">
                    <label style={style}>Bio</label>
                    <textarea ref={bioAreaRef} style={inputStyle} rows="3" name="bio"
                              className="form-control "
                              aria-describedby="emailHelp" onChange={e => setBio(e.target.value)} value={bio}
                              placeholder="Bio">
                    </textarea>
                    <small id="emailHelp" className="form-text text-muted">Update your profile to get better
                        experience</small>
                </div>
                <small id="emailHelp"
                       className="form-text mb-2 text-info">{state === true ? "Profile updated" : ""}</small>
                <button style={{fontSize: "15px", fontWeight: "500"}} type="submit" className="btn btn-primary">Edit
                </button>
            </form>
        </div>
    </div>
}