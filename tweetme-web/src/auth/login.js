import React, {useState} from "react";
import dream from "./dream-girl-1.jpg"
import {apiLogin} from "./lookup";

export function LoginComponent(props) {
    const usernameAreaRef = React.createRef();
    const passwordAreaRef = React.createRef();
    const [state, setState] = useState(true);


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

    const handleBackendLookup = (response, status) => {
        console.log("status", status);
        if (status === 200) {
            window.location.href = `/`
        }
        if (status === 404){
            setState(false)
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setState(true);
        const username = usernameAreaRef.current.value;
        const password = passwordAreaRef.current.value;
        console.log("username-password", username, password);
        if (username.length !== undefined && password.length !== undefined) {
            apiLogin(username, password, handleBackendLookup);
        }
        usernameAreaRef.current.value = '';
        passwordAreaRef.current.value = '';
    };

    return <div className="d-inline-flex">
        <div className="" style={{marginRight: "50px", marginTop: "10px",marginLeft:"10px"}}>
            <img className="rounded" src={dream} style={{maxWidth: "598px", maxHeight: "540px"}}/>
        </div>
        <div style={{width: "498px", marginTop: "10px",marginLeft:"10px"}}>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label style={style}>User Name</label>
                    <input ref={usernameAreaRef} style={inputStyle} type="text" name="username" className="form-control required"
                           aria-describedby="emailHelp"
                           placeholder="Enter user name">
                    </input>
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone
                        else.</small>
                </div>
                <div className="form-group">
                    <label style={style} htmlFor="exampleInputPassword1">Password</label>
                    <input ref={passwordAreaRef} style={inputStyle} type="password" name="password" className="form-control required"
                           id="exampleInputPassword1" placeholder="Password">
                    </input>
                </div>
                 <small id="emailHelp"
                           className="form-text mb-2 text-danger">{state === true ? "" : "Wrong username or password"}</small>
                <button style={{fontSize: "15px", fontWeight:"500"}} type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    </div>
}