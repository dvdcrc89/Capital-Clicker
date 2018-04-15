import React from "react";
import Signup from "./signup";
import {Accounts} from "meteor/accounts-base";
import {Meteor} from "meteor/meteor";
import {history} from "../routes/appRouter";
import {capitals} from './capital'
import {Battle} from "../api/battle";
import {Leaderboard} from "../api/leaderboard";
import {Tracker} from "meteor/tracker";
import FlipMove from 'react-flip-move';

const shuffle = require('shuffle-array');

const questions = capitals.map((cap) =>{
    return ({
        question: cap.country,
        answer: cap.city,
        wrong: shuffle(capitals)[0].city
    })
})



export default class Game extends React.Component {
    constructor(props){
        super(props);
        this.state={
            current:shuffle(questions)[0],
            pointsPerClick:1,
            lifes: 8,
            points:0,
            state:0,
            message:null,
            ranking:[]
        }
    }
    componentDidMount(){
        this.battleTracker=Tracker.autorun(()=>{
            Meteor.subscribe('battle');
            const ranking=Battle.find({},{sort:{points:-1} , limit:10}).fetch();
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
            console.log(Meteor.userId() +"  " + result.userId);
            if (result.userId===Meteor.userId()) classN='you score-battle';
            return (<div className={classN} key={result._id}><p>{result.userName}</p><p className={"red"}>{result.points} Points</p></div>)}))
    }

    reset(){
        Meteor.call('battle.join');
        this.setState({
            current:shuffle(questions)[0],
            pointsPerClick:1,
            lifes: 8,
            points:0,
            state:1
        })
    }

    onLogout(){
        Accounts.logout();
    }

    getRight(){
        Meteor.call('battle.add',this.state.pointsPerClick);
        this.setState({
            current:shuffle.pick((questions),{picks:'1'}),
            points: this.state.points + this.state.pointsPerClick,
            message: "Well done! The capital of " + this.state.current.question +" is "+ this.state.current.answer
        })
    }

    getWrong(){
        if (this.state.lifes===0){
            this.endGame();
        } else {
            this.setState({
                lifes: this.state.lifes - 1,
                current: shuffle.pick((questions), {picks: '1'}),
                message: "You have got it wrong this time, The capital of " + this.state.current.question +" is "+ this.state.current.answer


            })
        }
    }

    endGame(){
        Meteor.call('battle.drop');
        this.setState({
            state:2
        })
    }

    shoufflePicks(){

        const answersPicks = [{
            answer: <div className={"answer1-battle"} key={"right"} onClick={this.getRight.bind(this)}><p className={"word"}>{this.state.current.answer}</p></div>
        },
            {
                answer:  <div className={"answer1-battle"} key={"wrong"} onClick={this.getWrong.bind(this)}><p className={"word"}>{this.state.current.wrong}</p></div>
            }];150

        shuffle(answersPicks);
        return (
            <div className={"game-battle"}>
                <div className={"question-battle"}><p className={"word"}> {this.state.current.question}</p></div>

                <div className={"answers"}>
                    {answersPicks[0].answer}
                    {answersPicks[1].answer}
                </div>

            </div>)
    }


    buyUpgrade() {


        const plus5 = <div className={"up"} onClick={()=>{
            this.setState({
                points:this.state.points -5,
                pointsPerClick: this.state.pointsPerClick+5
            })}}>
            <img src={"./../img/compass"}></img><p>COMPASS: POINTS PER CLICK <bold>+5</bold></p><p className={"red"}> (5 points)</p></div>

        const plus100 = <div className={"up"} onClick={()=>{
            this.setState({
                points:this.state.points -50,
                pointsPerClick: this.state.pointsPerClick+50
            })}}>
            <img src={"./../img/map"}></img><p>SMARTPHONE: POINTS PER CLICK <bold>+50</bold></p><p className={"red"}>(50 points)</p></div>

        const life = <div className={"up"} onClick={()=>{
            this.setState({
                points:this.state.points - 6*this.state.pointsPerClick,
                lifes: this.state.lifes+1
            })}}>
            <img src={"./../img/energy"}></img><p>CHARGER: ADD <bold>1</bold> LIFE</p> <p className={"red"}>({6*this.state.pointsPerClick} points)</p> </div>

        const plus25 = <div className={"up"} onClick={()=>{
            this.setState({
                points:this.state.points -25,
                pointsPerClick: this.state.pointsPerClick+25
            })}}>
            <img src={"./../img/map1"}></img><p>MAP: POINTS PER CLICK <bold>+25</bold></p><p className={"red"}> (25 points)</p></div>

        const upgrade = [];
        if (this.state.points>=5) upgrade.push(plus5);

        if (this.state.points>=25) upgrade.push(plus25);

        if (this.state.points>=50) upgrade.push(plus100);


        if (this.state.points>=(6*this.state.pointsPerClick)) upgrade.push(life);


        return ( <div className={"upgrade"}>{upgrade}</div>)


    }

    renderMenu(){
        return (<div className={"menu"}>
            <h1> Multi Battle</h1>
            <div className={"menu-odd"} onClick={this.reset.bind(this)}>Join the battle </div>
            <p>Players online: {this.state.ranking.length} </p>
        </div>)
    }



    parseGame(){

        switch(this.state.state){
            case 0:
                Meteor.call('battle.drop');
                return (this.renderMenu())
            case 1:
                return (
                    <div className={"fullScreen"}>
                        <div className={"ranking-battle upgradeSection"}>
                            <h1>Players online</h1>
                            <FlipMove duration={750} easing="ease-out" maintainContainerHeight="true">
                                {this.fetchData()}
                            </FlipMove>
                        </div>
                        <div className={"canvas-battle"}>

                            <div className={"stats"}>
                                <img className={"back"}  src={"./../img/back1.svg"} onClick={()=>history.push("/")}/>

                                <p>Points: {this.state.points}</p>
                                <p>Points per Click: {this.state.pointsPerClick}</p>
                                <p> Lifes: {this.state.lifes}</p>
                            </div>

                            {this.shoufflePicks()}
                            <div className={"footerGame"}>
                                <p>   {this.state.message}</p>
                            </div>
                        </div>
                        <div className={"upgradeSection"}>

                            <h1>Upgrades</h1>
                            {this.buyUpgrade()}
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className={"wrapper"}>
                        <div className={"endedGame"}>
                            <img className={"back"}  src={"./../img/back1.svg"} onClick={()=>this.setState({state:0})}/>

                            <h1>Congratulation! You Scored {this.state.points} Points</h1>
                        </div>
                    </div>)
        }

    }


    render(){
        return(<div className={"wrapper"}>
            {this.parseGame()}
        </div>)
    }
}