import React from "react";
import Signup from "./signup";
import {Accounts} from "meteor/accounts-base";
import {Meteor} from "meteor/meteor";
import {history} from "../routes/appRouter";
import {country} from "./country";
import {capitals} from './capital'
import {Battle} from "../api/battle";
import {Leaderboard} from "../api/leaderboard";
import {Tracker} from "meteor/tracker";
import FlipMove from 'react-flip-move';
import LiveMultiplayer from './liveMultiplayer';
import ReactCountdownClock from 'react-countdown-clock'
const shuffle = require('shuffle-array');
let audio = new Audio('battle.mp3');
let keeper=[];

const questions = capitals.map((cap) =>{

    let wrong = shuffle(capitals)[0].city;
    while(cap.city==wrong) wrong = shuffle(capitals)[0].city;
    let country_flag=undefined;
    for(key in country){
        if (country[key].country===cap.country) {
            country_flag = "./../flags/"+country[key].flag.toLowerCase()+".png";


        }

    }
    return ({
        question: cap.country,
        answer: cap.city,
        wrong: wrong,
        flag: country_flag

    })

})



export default class Multibattle extends React.Component {
    constructor(props){
        super(props);
        this.state={
            current:shuffle(questions)[0],
            pointsPerClick:1,
            lifes: 6,
            points:0,
            state:0,
            message:null,
            upgrade:0

        }
    }
    componentDidMount(){

        audio.play();

    }
    componentWillUnmount(){
        Meteor.call('battle.drop');
        audio.pause();

    }


    reset(){
        Meteor.call('battle.join');
        this.setState({
            current:shuffle(questions)[0],
            pointsPerClick:1,
            lifes: 6,
            points:0,
            state:1,
            upgrade:0
        })
    }

    onLogout(){
        Accounts.logout();
    }

    getRight(){
        let audio = new Audio('right.mp3');
        audio.volume=0.7;

        audio.play();
        Meteor.call('battle.add',this.state.pointsPerClick);
        this.setState({
            current:shuffle.pick((questions),{picks:'1'}),
            points: this.state.points + this.state.pointsPerClick,
            message: "WELL DONE!!",
            upgrade:0
        })
    }

    getWrong(){
        let audio = new Audio('wrong.mp3');
        audio.volume=0.5;

        audio.play();
        if (this.state.lifes===0){
            this.endGame();
        } else {
            this.setState({
                lifes: this.state.lifes - 1,
                current: shuffle.pick((questions), {picks: '1'}),
                message: "WROOONG!!!",
                upgrade:0


            })
        }
    }
    lifes(){
        const lifes=[];
        for(i=0;i<this.state.lifes;i++){
            lifes.push(<img className={"life"}  src={"./../img/life.png"}/>)
        }

        if(lifes.length>0){
            return (
                <div className={"lifes"}>
                    {lifes}
                </div>)}
        else return <img className={"life"}  src={"./../img/danger.png"}/>
    }

    endGame(){
        Meteor.call("leaderboardhero.insert",this.state.points);
        Meteor.call('battle.drop');
        this.setState({
            state:2
        })
    }

    getClock(){
        return(
            <ReactCountdownClock seconds={180}
                                 color="White"
                                 alpha={0.9}
                                 size={100}
                                 onComplete={this.endGame.bind(this)} />
        )
    }
    shoufflePicks(){


        let answersPicks = [{
                answer: <div className={"answer1-battle"} key={"right"} onClick={this.getRight.bind(this)}><p className={"word"}>{this.state.current.answer}</p></div>
        },
            {
                answer:  <div className={"answer1-battle"} key={"wrong"} onClick={this.getWrong.bind(this)}><p className={"word"}>{this.state.current.wrong}</p></div>
            }];

        if(this.state.upgrade<1) {
            keeper = shuffle(answersPicks);
        } else answersPicks= keeper;

        return (
            <div className={"game-battle"}>
                <div className={"question"}>
                <div className={"flag"}>
                    <img src={this.state.current.flag}/>
                    <p className={"centered"}> {this.state.current.question}</p>
                </div>
            </div>
                <div className={"answers"}>
                    {answersPicks[0].answer}
                    {answersPicks[1].answer}
                </div>

            </div>)
    }


    buyUpgrade() {


        const plus5 = <div className={"up"} onClick={()=>{
            Meteor.call('battle.add',-5);
            this.setState({
                points:this.state.points -5,
                pointsPerClick: this.state.pointsPerClick+5,
                upgrade:1
            })}}>
            <img src={"./../img/compass"}></img><p>COMPASS: POINTS PER CLICK <bold>+5</bold></p><p className={"red"}> (5 points)</p></div>

        const plus100 = <div className={"up"} onClick={()=>{
            Meteor.call('battle.add',-50);
            this.setState({
                points:this.state.points -50,
                pointsPerClick: this.state.pointsPerClick+50,
                upgrade:1
            })}}>
            <img src={"./../img/map"}></img><p>SMARTPHONE: POINTS PER CLICK <bold>+50</bold></p><p className={"red"}>(50 points)</p></div>

        const life = <div className={"up"} onClick={()=>{
            Meteor.call('battle.add',-( 6*this.state.pointsPerClick));
            this.setState({
                points:this.state.points - 6*this.state.pointsPerClick,
                lifes: this.state.lifes+1,
                upgrade:1
            })}}>
            <img src={"./../img/energy"}></img><p>CHARGER: ADD <bold>1</bold> LIFE</p> <p className={"red"}>({6*this.state.pointsPerClick} points)</p> </div>

        const plus25 = <div className={"up"} onClick={()=>{
            Meteor.call('battle.add',-25);

            this.setState({
                points:this.state.points -25,
                pointsPerClick: this.state.pointsPerClick+25,
                upgrade:1
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
            <img className={"back"}  src={"./../img/back1.svg"} onClick={()=>history.push("/")}/>

            <h1> Multi Battle</h1>
            <div className={"menu-odd"} onClick={this.reset.bind(this)}>Join the battle </div>
            <p>Players online: {Battle.find().fetch().length} </p>
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

                            <LiveMultiplayer/>
                        </div>
                        <div className={"canvas-battle"}>

                            <div className={"stats"}>
                                <img className={"back"}  src={"./../img/back1.svg"} onClick={()=>history.push("/")}/>
                                {this.getClock()}

                            </div>

                                {this.shoufflePicks()}

                        </div>
                        <div className={"upgradeSection"}>
                            {this.lifes()}

                            <h1>{this.state.points} <img className={"star"}  src={"./../img/star.png"}/></h1>
                            <h1>{this.state.pointsPerClick}  <img className={"star"}  src={"./../img/star.png"}/> per <img className={"life"}  src={"./../img/click.png"}/></h1>
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