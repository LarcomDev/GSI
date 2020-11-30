import React from "react";
import { connect } from "react-redux";

import { Button, Modal, Nav, Form } from "react-bootstrap";
import axios from "axios";

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            input: {
                username: '',
                password: ''
            }
        }

        this.handleSignup = this.handleSignup.bind(this);
    }

    async handleSignup() {
        try {
            const data = await (await axios.post(`${process.env.BACKEND_URL}/signup`, {...this.state.input})).data;
            this.props.dispatch({type: 'STORE_USER', data: { User: data }});
            this.setState({ show: false });
        } catch (error) {
            console.log("Sign Up error", error);
            this.setState({ show: true})
        }
    }

    render() {
        return (
            <>
                <Nav.Item>
                    <Nav.Link onClick={() => { this.setState({ show: true }) }}>Sign Up</Nav.Link>
                </Nav.Item>

                <Modal show={this.state.show} onHide={() => { this.setState({ show: false }) }} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Sign Up</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="email" placeholder="Enter username" onChange={e => {this.setState({input: {...this.state.input, username: e.target.value}})}}/>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={e => {this.setState({input: {...this.state.input, password: e.target.value}})}}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { this.setState({ show: false }) }}>Close</Button>
                        <Button variant="primary" onClick={this.handleSignup}>Sign Up</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default connect((state) => ({ ...state }))(SignUp);