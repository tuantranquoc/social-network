import Modal from 'react-awesome-modal';
import React, {Component} from 'react';
import {CropImage} from "../profile/badge";

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
            <section className="ml-2">
                <Modal visible={this.state.visible} width="300px" height="200px" effect="fadeInUp"
                       onClickAway={() => this.closeModal()}>
                    <div>
                        <CropImage/>
                        <a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>
                    </div>
                </Modal>
                <input type="button" className="btn btn-info py-1 px-2" style={{fontSize: "15px",marginTop:"100px"}}
                       value="Edit"
                       onClick={() => this.openModal()}/>
            </section>
        );
    }
}