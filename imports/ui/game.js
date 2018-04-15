import React from "react";
import Signup from "./signup";
import {Accounts} from "meteor/accounts-base";
import {Meteor} from "meteor/meteor";
import {history} from "../routes/appRouter";
import ReactPlayer from 'react-player';
import {capitals} from './capital'
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
            lifes: 4,
            points:0,
            state:0,
            message:null
        }
    }

    reset(){
        this.setState({
            current:shuffle(questions)[0],
            pointsPerClick:1,
            lifes: 4,
            points:0,
            state:1
        })
    }

    onLogout(){
        Accounts.logout();
    }

    getRight(){

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
                Meteor.call("leaderboard.insert",this.state.points);
                this.setState({
                    state:2
                })
        }

    shoufflePicks(){

        const answersPicks = [{
                answer: <div className={"answer1"} key={"right"} onClick={this.getRight.bind(this)}><p className={"word"}>{this.state.current.answer}</p></div>
             },
            {
                answer:  <div className={"answer1"} key={"wrong"} onClick={this.getWrong.bind(this)}><p className={"word"}>{this.state.current.wrong}</p></div>
            }];150

        shuffle(answersPicks);
        return (
            <div className={"game"}>
                <div className={"question"}><p className={"word"}> {this.state.current.question}</p></div>

                <div className={"answers"}>
                {answersPicks[0].answer}
                {answersPicks[1].answer}
                </div>

            </div>)
    }


    buyUpgrade() {


        const plus5 = <div className={"up"} onClick={()=>{
            this.setState({
            points:this.state.points -10,
            pointsPerClick: this.state.pointsPerClick+5
        })}}>
        <img src={"./../img/compass"}></img><p>COMPASS: POINTS PER CLICK <bold>+5</bold></p><p className={"red"}> (10 points)</p></div>

        const plus100 = <div className={"up"} onClick={()=>{
            this.setState({
                points:this.state.points -100,
                pointsPerClick: this.state.pointsPerClick+50
            })}}>
            <img src={"./../img/map"}></img><p>SMARTPHONE: POINTS PER CLICK <bold>+50</bold></p><p className={"red"}>(100 points)</p></div>

        const life = <div className={"up"} onClick={()=>{
            this.setState({
                points:this.state.points -1000,
                lifes: this.state.lifes+1
            })}}>
            <img src={"./../img/energy"}></img><p>CHARGER: ADD <bold>1</bold> LIFE</p> <p className={"red"}>(1000 points)</p> </div>

        const plus25 = <div className={"up"} onClick={()=>{
            this.setState({
                points:this.state.points -50,
                pointsPerClick: this.state.pointsPerClick+25
            })}}>
            <img src={"./../img/map1"}></img><p>MAP: POINTS PER CLICK <bold>+25</bold></p><p className={"red"}> (50 points)</p></div>

        const upgrade = [];
        if (this.state.points>=1) upgrade.push(plus5);

        if (this.state.points>=2) upgrade.push(plus25);

        if (this.state.points>=3) upgrade.push(plus100);


        if (this.state.points>=4) upgrade.push(life);


        return ( <div className={"upgrade"}>{upgrade}</div>)


    }

    renderMenu(){
        return (<div className={"menu"}>
            <h1> Game Menu</h1>
            <div className={"menu-odd"} onClick={this.reset.bind(this)}>Start Game</div>
            <div className={"menu-even"} onClick={()=>history.push('/leaderboard')}>Leaderboard</div>
            <div className={"menu-odd"} onClick={this.onLogout.bind(this)}>World Map</div>
            <div className={"menu-even"} onClick={this.reset.bind(this)}>Settings</div>
            <div className={"menu-odd"} onClick={this.onLogout.bind(this)}>Logout</div>
        </div>)
    }



    parseGame(){

        switch(this.state.state){
            case 0:
                    return (this.renderMenu())
            case 1:
                    return (
                        <div className={"fullScreen"}>
                        <div className={"canvas"}>

                            <div className={"stats"}>
                                <img className={"back"}  src={"./../img/back1.svg"} onClick={()=>this.setState({state:0})}/>

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

                            <ReactPlayer url='https://www.youtube.com/embed/o6IjyOuUMHY?ecver=2' playing />
                            <p> You Scored : {this.state.points}</p>
                             <button onClick={this.reset.bind(this)}>Start another Game</button>
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