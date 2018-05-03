import React from "react";
import Signup from "./signup";
import {Accounts} from "meteor/accounts-base";
import {Meteor} from "meteor/meteor";
import {history} from "../routes/appRouter";
import {Game} from  '../ui/game'
import {Link} from "react-router-dom";

export default class Login extends React.Component {

    componentWillMount() {
        if (Meteor.userId()) {
            history.replace('/game');
        }

    }

    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };

    }

    onSubmit(e) {

        e.preventDefault();
        let email = this.refs.email.value.trim();
        let password = this.refs.password.value.trim();
        Meteor.loginWithPassword({email}, password, (err) => {
            if (err) {
                this.setState({error: err.reason});
            } else {
                this.setState({error: ""});

            }
        });


    }

    render() {

        return (
            <div className={"signlog"}>
                <h1>Login to Capital Clicker</h1>
                <p>Please enter your username and password and click "Login" or click "Sign Up" to register!</p>
                <form onSubmit={this.onSubmit.bind(this)} noValidate>
                    <input type="email" name="email" ref="email" placeholder="Username"/>
                    <input type="password" name="password" ref="password" placeholder="Password"/>
                    <button>Login</button>
                </form>
                {this.state.error ? <p><span class="red">{this.state.error}</span></p> : undefined}
                <p>Do not have an account? No worries! <br/><a href="/signup">Register here</a></p>
            </div>

        );
    }
}