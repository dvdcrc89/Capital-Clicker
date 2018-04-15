import {Meteor} from "meteor/meteor";
import React from "react";
import ReactDOM from "react-dom";
import Signup from "../ui/signup";
import createHistory from 'history/createBrowserHistory'
import Login from "../ui/login";
import {Router, Switch, Route} from 'react-router-dom';
import Game from  '../ui/game';
import Ranking from '../ui/ranking'

export const history = createHistory();

//Define pages that can be visit from Unauthenticated users only
const unauthenticatedPages = ['/', '/signgup', '/login'];
//Define pages that can be visit from Authenticated users only
const authenticatedPages = ['/game'];


export const onAuthChange = () => {
    const pathname = history.location.pathname.toLowerCase();
    const isAuthenticated = !!Meteor.userId();
    const isUnauthenticatedPages = unauthenticatedPages.includes(pathname);
    const isAuthenticatedPages = authenticatedPages.includes(pathname);

    if (!(isAuthenticated) && isAuthenticatedPages) {
        history.replace("/");
    } else if (isAuthenticated && isUnauthenticatedPages) {
        history.replace("/game");
    }

}

export const AppRouter = () => (

    <Router history={history}>
        <Switch>
            <Route exact path="/" component={Login}/>

            <Route exact path="/signup" component={Signup}/>

            <Route exact path="/game" component={Game}/>
            <Route exact path="/leaderboard" component={Ranking}/>


            {/*<Route component={NotFound}/>*/}
        </Switch>
    </Router>
);