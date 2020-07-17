import React, {useState} from "react";
import dream from "./dream-girl.jpg"
import {apiRegister} from "./lookup";

export function RegisterComponent(props) {
    const usernameAreaRef = React.createRef();
    const passwordAreaRef = React.createRef();
    const passwordConfirmAreaRef = React.createRef();
    const [state, setState] = useState("");


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
        if (status === 200){
             window.location.href = `/`
        }
        if (status === 400){
            setState("User name already exist")
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const username = usernameAreaRef.current.value;
        const password = passwordAreaRef.current.value;
        const passwordConfirm = passwordConfirmAreaRef.current.value;
        console.log("username-password", username, password);
        if (username.length !== undefined && password.length !== undefined) {
            if (password === passwordConfirm) {
                apiRegister(username, password, handleBackendLookup);
            } else {
                setState("Password does not match")
            }
        }
        usernameAreaRef.current.value = '';
        passwordAreaRef.current.value = '';
        passwordConfirmAreaRef.current.value = '';
    };

    return <div className="d-inline-flex">
        <div className="" style={{marginRight: "50px", marginTop: "10px",marginLeft:"10px"}}>
            <img className="rounded" src={dream} style={{maxWidth: "598px", maxHeight: "540px"}}/>
        </div>
        <div style={{width: "498px", marginTop: "10px",marginLeft:"10px"}}>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label style={style}>User Name</label>
                    <input ref={usernameAreaRef} style={inputStyle} type="text" className="form-control required"
                           aria-describedby="emailHelp"
                           placeholder="Enter user name">
                    </input>
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone
                        else.</small>
                </div>
                <div className="form-group">
                    <label style={style} htmlFor="exampleInputPassword1">Password</label>
                    <input ref={passwordAreaRef} style={inputStyle} type="password" className="form-control required"
                           id="exampleInputPassword1" placeholder="Password">
                    </input>
                    <small id="emailHelp" className="form-text text-muted">Your password must match out
                        requirement</small>
                </div>
                <div className="form-group">
                    <label style={style} htmlFor="exampleInputPassword1">Confirm password</label>
                    <input ref={passwordConfirmAreaRef} style={inputStyle} type="password" className="form-control required"
                           id="exampleInputPassword1" placeholder="Password">
                    </input>
                    <small id="emailHelp"
                           className="form-text text-muted">{state}</small>
                </div>
                <button style={{fontSize: "15px",fontWeight:"500"}} type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    </div>
}