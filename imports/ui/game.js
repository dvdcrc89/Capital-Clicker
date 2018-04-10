import React from "react";
import Signup from "./signup";
import {Accounts} from "meteor/accounts-base";
import {Meteor} from "meteor/meteor";
import {history} from "../routes/appRouter";
import ReactPlayer from 'react-player';
const shuffle = require('shuffle-array');

const questions = [{
    question: "Dog",
    answer: "Cane",
    wrong: "Gatto"
},{
    question: "Cat",
    answer: "Gatto",
    wrong: "Cane"
},{
    question: "Bird",
    answer: "Uccello",
    wrong: "Gatto"
},{
    question: "Red",
    answer: "Rosso",
    wrong: "Blue"
}];

let index = 0;


export default class Game extends React.Component {
    constructor(props){
        super(props);
        this.state={
            current:questions[0],
            pointsPerClick:1,
            lifes: 4,
            points:0,
            state:0
        }
    }

    reset(){
        this.setState({
            current:questions[0],
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
            points: this.state.points + this.state.pointsPerClick
        })
    }

    getWrong(){
        if (this.state.lifes===0){
            this.endGame();
        } else {
            this.setState({
                lifes: this.state.lifes - 1,
                current: shuffle.pick((questions), {picks: '1'}),

            })
        }
    }

    endGame(){
                this.setState({
                    state:2
                })
        }

    shoufflePicks(){

        const answersPicks = [{
                answer: <div className={"answer1"} key={"right"} onClick={this.getRight.bind(this)}><p className={"word"}>{this.state.current.answer}</p></div>
             },
            {
                answer:  <div className={"answer2"} key={"wrong"} onClick={this.getWrong.bind(this)}><p className={"word"}>{this.state.current.wrong}</p></div>
            }];

        shuffle(answersPicks);
        return (
            <div className={"game"}>
                {answersPicks[0].answer}
                <div className={"question"}><p className={"word"}> {this.state.current.question}</p></div>
                {answersPicks[1].answer}
            </div>)
    }


    buyUpgrade() {

        const upgrade = [];
        if (this.state.points>10) upgrade.push(<button onClick={()=>{
                                                                     this.setState({
                                                                     points:this.state.points -10,
                                                                     pointsPerClick: this.state.pointsPerClick+10
                                                                     })}}>10</button>)

        if (this.state.points>100) upgrade.push(<button onClick={()=>{
            this.setState({
                points:this.state.points -100,
                pointsPerClick: this.state.pointsPerClick+100
            })}}>100</button>)

        if (this.state.points>1000) upgrade.push(<button onClick={()=>{
            this.setState({
                points:this.state.points -1000,
                pointsPerClick: this.state.pointsPerClick+1000
            })}}>1000</button>)
        if (this.state.points>10000) upgrade.push(<button onClick={()=>{
            this.setState({
                points:this.state.points -10000,
                pointsPerClick: this.state.pointsPerClick+10000
            })}}>10000</button>)
        if (this.state.points>100000) upgrade.push(<button onClick={()=>{
            this.setState({
                points:this.state.points -100000,
                pointsPerClick: this.state.pointsPerClick+100000
            })}}>100000</button>)


        return ( <div className={"upgrade"}>{upgrade}</div>)


    }

    parseGame(){

        switch(this.state.state){
            case 0:
                    return(<button onClick={this.reset.bind(this)}>Start Game</button>)
            case 1:
                    return (
                        <div className={"canvas"}>
                                <div className={"stats"}>
                                <p>Points: {this.state.points}</p>
                                    <p>Points per Click: {this.state.pointsPerClick}</p>
                                <p> Lifes: {this.state.lifes}</p>
                                </div>
                                {this.shoufflePicks()}
                                {this.buyUpgrade()}
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
                    <button onClick={() => {
                        this.onLogout() }}>Logout
                    </button>
        </div>)
    }
}