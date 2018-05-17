import React from "react";
import Signup from "./signup";
import {Accounts} from "meteor/accounts-base";
import {Meteor} from "meteor/meteor";
import {history} from "../routes/appRouter";
import ReactPlayer from 'react-player';
import FlipMove from 'react-flip-move';
import {Leaderboard} from "../api/leaderboard";
import {Battle} from "../api/battle";
import {Tracker} from "meteor/tracker";

export default class LiveMultiplayer extends React.Component {

    constructor(props){
        super(props);
        this.state={
            ranking:[],
        }
    }
    componentDidMount() {
        this.battleTracker = Tracker.autorun(() => {
            Meteor.subscribe('battle');
            const ranking = Battle.find({}, {sort: {points: -1}, limit: 10}).fetch();
            this.setState({ranking});

        });
    }

    componentWillUnmount(){
        Meteor.call('battle.drop');
        this.battleTracker.stop();
    }

fetchData(){

    return (this.state.ranking.map((result)=>{
        let classN="score-battle";
        if (result.userId===Meteor.userId()) classN='you score-battle';
        return (<div className={classN} key={result._id}><p>{result.userName}</p><p className={"red"}>{result.points} Points</p></div>)}))
}

render() {
        return(
    <div>
        <h1>Players online</h1>
        <FlipMove duration={750} easing="ease-out" maintainContainerHeight="true">
            {this.fetchData()}
        </FlipMove>
    </div>)
}
}