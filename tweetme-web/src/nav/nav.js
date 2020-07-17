import React, {useState} from "react";
import {apiHashTagSearch} from "./lookup";


export function NavBar(props) {
    const [search, setSearch] = useState(false);
    const [didCall, setDidCall] = useState(false);
    const {username} = props.username;
    let textAreaRef = React.createRef();

    const handleBackEndLookUp = (response, status) => {
        if (status === 200) {
            console.log("username:response", response)
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const hashTag = textAreaRef.current.value;
        if (hashTag.length !== 0) {
            apiHashTagSearch(hashTag, handleBackEndLookUp);
        }
    };


    const style = {
        fontSize: "19px",
        fontWeight: "700",
        lineHeight: "2px",
        color: "#fffefe",
        fontFamily: "system-ui", textDecoration: "none", width: "100px",
    };
    //#2bbbad
    return <nav
        className="navbar mx-auto container-fluid navbar-expand-lg navbar-dark mb-2 navbar-inverse border-bottom"
        style={{background: "#2bbbad", width: "80%"}}>
        <a className="navbar-brand" style={{
            fontSize: "19px",
            fontWeight: "700",
            lineHeight: "2px",
            color: "#fffefe",
            fontFamily: "system-ui", textDecoration: "none", width: "100px",
        }}
           href="/global/">ToDo</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon">
        </span>
        </button>

        <form method="post" onSubmit={handleSubmit} className="collapse navbar-collapse form-inline">
            <div className="active-purple-3 form-group-sm active-purple-4 mr-2">
                <button type="submit" className="btn fa position-relative fa-search"
                        style={{background: "#faf3fd", fontSize: "15px", left: "55px", zIndex: "2"}}/>
                <input ref={textAreaRef} className="form-control pl-5 py-0 ex input-lg" type="text" name="hash_tag"
                       aria-label="Search" style={{
                    backgroundColor: "#faf3fd",
                    color: "#faf3fd",
                    border: "0",
                    borderBottom: "2px solid white", fontSize: "15px", zIndex: "1"
                }} placeholder="Search..."/>
                <i className="fa fa-spinner position-relative fa-spin" style={{right: "30px"}}/>
            </div>
        </form>
        <div className="collapse navbar-collapse " id="navbarNav">

        </div>
        <nav className="navbar collapse navbar-collapse  p-0 navbar-light ml-auto">
            <ul className="navbar-nav w-100 text-center">
                {props.username !== undefined ?
                    <div className="d-inline-flex ml-auto">
                        <li className="nav-item">
                            <a className="nav-link font-weight-bold" style={style} href="/logout/">Logout</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" style={style}
                               href="/profile/edit/">Edit<span
                                className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" style={style}
                               href="/profile/">{props.username}<span
                                className="sr-only">(current)</span></a>
                        </li>
                    </div> : <div className="d-inline-flex border border-danger">
                        <li className="nav-item">
                            <a className="nav-link" style={style} href="/login/">Login <span
                                className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" style={style} href="/register/">Register<span
                                className="sr-only">(current)</span></a>
                        </li>
                    </div>
                }
            </ul>
        </nav>
    </nav>
}