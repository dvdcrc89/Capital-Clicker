import React from "react";
import {Accounts} from "meteor/accounts-base";
import {Meteor} from "meteor/meteor";
import {Leaderboardhero} from "../api/leaderboardhero";
import {Tracker} from "meteor/tracker";
import {history} from "../routes/appRouter";


export default class RankingHero extends React.Component {


    constructor(props){
        super(props);
        this.state={
            ranking: []
        }
    }
    componentDidMount(){
        this.leaderboardheroTracker=Tracker.autorun(()=>{
            Meteor.subscribe('leaderboardhero');
            const ranking=Leaderboardhero.find({},{sort:{points:-1} , limit:15}).fetch();
            this.setState({ranking});

        });

    }
    componentWillUnmount(){
        this.leaderboardheroTracker.stop();
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
                    <h1>Heros Hall of Fame</h1>
                {this.fetchData()}
            </div>
            </div>);
    }
}
