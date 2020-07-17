import React, {Component, useState} from "react";
import './popup.css';
import Popup from "reactjs-popup";
import Modal from "react-awesome-modal";
import {apiLogout} from "./lookup";


export function LogoutComponent(props) {
    return <Examples/>
}

function Logout(props) {
    const [confirm, setConfirm] = useState("Click to confirm");
    const handleLookup = (response, status) => {
        console.log("status",status);
        if (status === 200) {
            setConfirm("Success");
            window.location.href = "/login/";
        }
    };
    const handleSubmit = (event) => {
        setConfirm("Confirming");
        event.preventDefault();
        apiLogout(handleLookup)
    };

    return <div className="text-center">
        <form className="form-group" onSubmit={handleSubmit}>
            <p>Are you sure to logout?</p>
            <button onClick={handleSubmit} className="btn btn-info"
                    style={{fontSize: "15px", fontFamily: "system-ui", fontWeight: "600"}}>{confirm}
            </button>
        </form>

    </div>
}

export default class Examples extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    openModal() {
        this.setState({
            visible: true
        });
    }

    closeModal() {
        this.setState({
            visible: false
        });
    }

    render() {
        return (
            <section className="">
                <Modal visible={this.state.visible} width="300px" height="200px" effect="fadeInUp"
                       onClickAway={() => this.closeModal()}>
                    <div className="p-1" style={{}}>
                        <div className="text-right align-text-top pr-1">
                            <a className="" style={{fontSize: "16px", fontFamily: "system-ui", fontWeight: "700"}}
                               href="javascript:void(0);" onClick={() => this.closeModal()}>X</a>
                        </div>
                        <Logout/>
                    </div>
                </Modal>
                <input className="btn btn-primary" type="button" style={{
                    fontSize: "15px", fontWeight: 600,
                    lineHeight: "2px",
                    color: "#fffefe",
                    fontFamily: "system-ui", textDecoration: "none", width: "100px", height: "30px"
                }} value="Confirm"
                       onClick={() => this.openModal()}/>
            </section>
        );
    }
}