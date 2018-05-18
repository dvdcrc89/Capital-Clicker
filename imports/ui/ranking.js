import React from "react";
import {Accounts} from "meteor/accounts-base";
import {Meteor} from "meteor/meteor";
import {Leaderboard} from "../api/leaderboard";
import {Tracker} from "meteor/tracker";
import {history} from "../routes/appRouter";


export default class Ranking extends React.Component {


    constructor(props){
        super(props);
        this.state={
            ranking: []
        }
    }
    componentDidMount(){
        this.leaderboardTracker=Tracker.autorun(()=>{
            Meteor.subscribe('leaderboard');
            const ranking=Leaderboard.find({},{sort:{points:-1} , limit:10}).fetch();
            this.setState({ranking});

        });

    }
    componentWillUnmount(){
        this.leaderboardTracker.stop();
    }
    fetchData(){
        const results = this.state.ranking;

       return (results.map((result)=>{ return (<div className={"score"}><p>{result.userName}</p><p className={"red"}>{result.points} <img className={"star"}  src={"./../img/star.png"}/></p></div>)}))
    }
    render(){
        return(
            <div className={"rankingWrapper"}>
                <img className={"back"}  src={"./../img/back1.svg"} onClick={()=>history.push('/game')}/>

                <div className={"ranking"}>
                    <h1>Leaderboard Top 10</h1>
                {this.fetchData()}
            </div>
            </div>);
    }
}
